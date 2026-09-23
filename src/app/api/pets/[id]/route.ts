import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            isVerifiedShelter: true,
            shelterName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!pet) {
      return NextResponse.json({ error: "Mascota no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ pet });
  } catch (error) {
    console.error("Error en GET /api/pets/[id]:", error);
    return NextResponse.json({ error: "Error al obtener la mascota" }, { status: 500 });
  }
}
