import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    // Validar permisos de moderación
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session?.user as any)?.role;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isVerifiedShelter = (session?.user as any)?.isVerifiedShelter;

    // Permitir ver la lista para pruebas si no hay sesión o si es admin/refugio
    const isAuthorized =
      userRole === "ADMIN" || userRole === "REFUGIO" || Boolean(isVerifiedShelter);

    const pendingPets = await prisma.pet.findMany({
      where: {
        status: "PENDIENTE_MODERACION",
      },
      include: {
        images: true,
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            isVerifiedShelter: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      pets: pendingPets,
      isAuthorized,
    });
  } catch (error) {
    console.error("Error en GET /api/moderation:", error);
    return NextResponse.json({ error: "Error al obtener publicaciones pendientes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session?.user as any)?.role;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isVerifiedShelter = (session?.user as any)?.isVerifiedShelter;

    const isAuthorized =
      userRole === "ADMIN" || userRole === "REFUGIO" || Boolean(isVerifiedShelter);

    if (!isAuthorized && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "No tienes permisos de moderación. Solo Administradores y Refugios Verificados pueden aprobar publicaciones." },
        { status: 403 }
      );
    }

    const { petId, action, note } = await req.json();

    if (!petId || !action) {
      return NextResponse.json({ error: "Parámetros incompletos" }, { status: 400 });
    }

    const newStatus = action === "APPROVE" ? "PUBLICADO" : "RECHAZADO";

    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: {
        status: newStatus,
        moderationNote: note || null,
        reviewedById: session?.user?.id || null,
      },
    });

    return NextResponse.json({ success: true, pet: updatedPet });
  } catch (error) {
    console.error("Error en POST /api/moderation:", error);
    return NextResponse.json({ error: "Error al procesar la moderación" }, { status: 500 });
  }
}
