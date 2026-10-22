import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendAdoptionStatusNotification } from "@/lib/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, notes } = body; // action: "APPROVE" | "REJECT" | "CANCEL"

    if (!["APPROVE", "REJECT", "CANCEL"].includes(action)) {
      return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
    }

    const application = await prisma.adoptionApplication.findUnique({
      where: { id },
      include: {
        pet: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session.user as any)?.role;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isVerifiedShelter = Boolean((session.user as any)?.isVerifiedShelter);
    const sessionEmail = session.user.email?.toLowerCase()?.trim();
    const adminEmail = (process.env.ADMIN_EMAIL || "sofiaacedress@gmail.com").toLowerCase().trim();

    const isShelterOrAdmin =
      userRole === "ADMIN" ||
      userRole === "REFUGIO" ||
      isVerifiedShelter ||
      sessionEmail === adminEmail ||
      application.pet.userId === session.user.id;

    const isApplicant =
      application.applicantId === session.user.id ||
      application.email.toLowerCase().trim() === sessionEmail;

    if (action === "APPROVE" || action === "REJECT") {
      if (!isShelterOrAdmin) {
        return NextResponse.json(
          { error: "No tienes permisos para responder a esta solicitud" },
          { status: 403 }
        );
      }

      const newStatus = action === "APPROVE" ? "APROBADO" : "RECHAZADO";

      // Actualizar estado de la solicitud
      const updatedApp = await prisma.adoptionApplication.update({
        where: { id },
        data: {
          status: newStatus,
          notes: notes ? notes : application.notes,
        },
      });

      // Si se aprueba, marcar la mascota como ADOPTADA en todo el sitio
      if (action === "APPROVE") {
        await prisma.pet.update({
          where: { id: application.petId },
          data: { status: "ADOPTADO" },
        });
      }

      // Enviar notificación al usuario adoptante
      await sendAdoptionStatusNotification({
        applicantName: application.fullName,
        applicantEmail: application.email,
        petTitle: application.pet.title,
        status: newStatus,
        notes: notes || undefined,
      });

      return NextResponse.json({
        success: true,
        application: updatedApp,
        message:
          action === "APPROVE"
            ? "¡Adopción confirmada! La mascota ahora figura como ADOPTADA y se le notificó al adoptante."
            : "Solicitud rechazada y adoptante notificado.",
      });
    }

    if (action === "CANCEL") {
      if (!isApplicant && !isShelterOrAdmin) {
        return NextResponse.json(
          { error: "No tienes permisos para cancelar esta solicitud" },
          { status: 403 }
        );
      }

      const updatedApp = await prisma.adoptionApplication.update({
        where: { id },
        data: { status: "CANCELADO" },
      });

      return NextResponse.json({
        success: true,
        application: updatedApp,
        message: "Solicitud cancelada con éxito.",
      });
    }

    return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });
  } catch (error) {
    console.error("Error en POST /api/applications/[id]/status:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la solicitud" },
      { status: 500 }
    );
  }
}
