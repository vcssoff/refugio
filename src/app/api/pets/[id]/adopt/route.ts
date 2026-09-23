import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendAdoptionApplicationAlert } from "@/lib/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const session = await auth();

    const {
      fullName,
      email,
      phone,
      housingType,
      hasYard,
      freeTimeHours,
      householdMembers,
      hasBabiesOrKids,
      otherAnimals,
      experience,
      notes,
    } = body;

    if (!fullName || !email || !phone || !housingType || !freeTimeHours || !householdMembers) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios en el cuestionario de adopción" },
        { status: 400 }
      );
    }

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!pet) {
      return NextResponse.json({ error: "Mascota no encontrada" }, { status: 404 });
    }

    if (pet.type !== "ADOPCION") {
      return NextResponse.json(
        { error: "Esta publicación no corresponde a una adopción" },
        { status: 400 }
      );
    }

    // Guardar la postulación en la base de datos
    const application = await prisma.adoptionApplication.create({
      data: {
        petId: id,
        applicantId: session?.user?.id || null,
        fullName,
        email,
        phone,
        housingType,
        hasYard: Boolean(hasYard),
        freeTimeHours,
        householdMembers,
        hasBabiesOrKids: Boolean(hasBabiesOrKids),
        otherAnimals: otherAnimals || null,
        experience: experience || null,
        notes: notes || null,
        status: "ENVIADO",
      },
    });

    // Enviar notificación por correo al refugio o dueño de la publicación
    const shelterEmail = pet.contactEmail || pet.user.email;
    await sendAdoptionApplicationAlert({
      petTitle: pet.title,
      petId: pet.id,
      applicantName: fullName,
      applicantEmail: email,
      applicantPhone: phone,
      housingType,
      hasYard: Boolean(hasYard),
      freeTimeHours,
      householdMembers,
      hasBabiesOrKids: Boolean(hasBabiesOrKids),
      otherAnimals,
      experience,
      notes,
      shelterEmail,
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Error en POST /api/pets/[id]/adopt:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la adopción" },
      { status: 500 }
    );
  }
}
