import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await prisma.petComment.findMany({
      where: { petId: id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error en GET /api/pets/[id]/comments:", error);
    return NextResponse.json({ error: "Error al obtener comentarios" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { authorName, authorPhone, location, message } = body;

    if (!authorName || !message) {
      return NextResponse.json(
        { error: "Nombre y mensaje del avistamiento son obligatorios" },
        { status: 400 }
      );
    }

    const comment = await prisma.petComment.create({
      data: {
        petId: id,
        authorName,
        authorPhone: authorPhone || null,
        location: location || null,
        message,
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Error en POST /api/pets/[id]/comments:", error);
    return NextResponse.json(
      { error: "Error al guardar el avistamiento" },
      { status: 500 }
    );
  }
}
