import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    const existingPet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!existingPet) {
      return NextResponse.json({ error: "Mascota no encontrada" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session?.user as any)?.role;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isVerifiedShelter = Boolean((session?.user as any)?.isVerifiedShelter);
    const sessionEmail = session?.user?.email?.toLowerCase()?.trim();
    const adminEmail = (process.env.ADMIN_EMAIL || "sofiaacedress@gmail.com").toLowerCase().trim();

    const isAuthorized =
      userRole === "ADMIN" ||
      userRole === "REFUGIO" ||
      isVerifiedShelter ||
      sessionEmail === adminEmail ||
      session?.user?.id === existingPet.userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "No tienes permisos para modificar esta mascota" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      type,
      status,
      species,
      otherSpecies,
      name,
      gender,
      ageGroup,
      size,
      color,
      vaccinated,
      dewormed,
      neutered,
      specialNeeds,
      isUrgent,
      healthCondition,
      goodWithDogs,
      goodWithCats,
      goodWithKids,
      description,
      contactEmail,
      contactPhone,
      shelterLocation,
      latitude,
      longitude,
      address,
      city,
      lostOrFoundDate,
      images, // array de { thumb, card, detail, original }
    } = body;

    // Si se enviaron imágenes nuevas, reemplazamos las anteriores
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.petImage.deleteMany({
        where: { petId: id },
      });

      await prisma.petImage.createMany({
        data: images.map(
          (
            img: { thumb: string; card: string; detail: string; original: string },
            index: number
          ) => ({
            petId: id,
            urlThumb: img.thumb,
            urlCard: img.card,
            urlDetail: img.detail,
            urlOriginal: img.original,
            order: index,
          })
        ),
      });
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(status !== undefined && { status }),
        ...(species !== undefined && { species }),
        ...(otherSpecies !== undefined && { otherSpecies }),
        ...(name !== undefined && { name }),
        ...(gender !== undefined && { gender }),
        ...(ageGroup !== undefined && { ageGroup }),
        ...(size !== undefined && { size }),
        ...(color !== undefined && { color }),
        ...(vaccinated !== undefined && { vaccinated: Boolean(vaccinated) }),
        ...(dewormed !== undefined && { dewormed: Boolean(dewormed) }),
        ...(neutered !== undefined && { neutered: Boolean(neutered) }),
        ...(specialNeeds !== undefined && { specialNeeds }),
        ...(isUrgent !== undefined && { isUrgent: Boolean(isUrgent) }),
        ...(healthCondition !== undefined && { healthCondition }),
        ...(goodWithDogs !== undefined && { goodWithDogs: Boolean(goodWithDogs) }),
        ...(goodWithCats !== undefined && { goodWithCats: Boolean(goodWithCats) }),
        ...(goodWithKids !== undefined && { goodWithKids: Boolean(goodWithKids) }),
        ...(description !== undefined && { description }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(shelterLocation !== undefined && { shelterLocation }),
        ...(latitude !== undefined && { latitude: latitude ? parseFloat(latitude) : null }),
        ...(longitude !== undefined && { longitude: longitude ? parseFloat(longitude) : null }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(lostOrFoundDate !== undefined && {
          lostOrFoundDate: lostOrFoundDate ? new Date(lostOrFoundDate) : null,
        }),
      },
      include: {
        images: { orderBy: { order: "asc" } },
        user: true,
      },
    });

    return NextResponse.json({ success: true, pet: updatedPet });
  } catch (error) {
    console.error("Error en PATCH /api/pets/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar la mascota" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    const existingPet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!existingPet) {
      return NextResponse.json({ error: "Mascota no encontrada" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session?.user as any)?.role;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isVerifiedShelter = Boolean((session?.user as any)?.isVerifiedShelter);
    const sessionEmail = session?.user?.email?.toLowerCase()?.trim();
    const adminEmail = (process.env.ADMIN_EMAIL || "sofiaacedress@gmail.com").toLowerCase().trim();

    const isAuthorized =
      userRole === "ADMIN" ||
      userRole === "REFUGIO" ||
      isVerifiedShelter ||
      sessionEmail === adminEmail ||
      session?.user?.id === existingPet.userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "No tienes permisos para eliminar esta mascota" },
        { status: 403 }
      );
    }

    await prisma.pet.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Mascota eliminada correctamente" });
  } catch (error) {
    console.error("Error en DELETE /api/pets/[id]:", error);
    return NextResponse.json({ error: "Error al eliminar la mascota" }, { status: 500 });
  }
}
