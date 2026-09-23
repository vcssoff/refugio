import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ profile: null });
    }

    const profile = await prisma.userAdoptionProfile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error en GET /api/user/adoption-profile:", error);
    return NextResponse.json({ error: "Error al obtener el perfil" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para guardar tu formulario" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      housingType,
      hasYard,
      freeTimeHours,
      householdMembers,
      hasBabiesOrKids,
      otherAnimals,
      experience,
    } = body;

    if (!housingType || !freeTimeHours || !householdMembers) {
      return NextResponse.json(
        { error: "Por favor completa todos los campos requeridos del formulario" },
        { status: 400 }
      );
    }

    const profile = await prisma.userAdoptionProfile.upsert({
      where: { userId: session.user.id },
      update: {
        housingType,
        hasYard: Boolean(hasYard),
        freeTimeHours,
        householdMembers,
        hasBabiesOrKids: Boolean(hasBabiesOrKids),
        otherAnimals: otherAnimals || null,
        experience: experience || null,
      },
      create: {
        userId: session.user.id,
        housingType,
        hasYard: Boolean(hasYard),
        freeTimeHours,
        householdMembers,
        hasBabiesOrKids: Boolean(hasBabiesOrKids),
        otherAnimals: otherAnimals || null,
        experience: experience || null,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error en POST /api/user/adoption-profile:", error);
    return NextResponse.json(
      { error: "Error al guardar el formulario de adopción" },
      { status: 500 }
    );
  }
}
