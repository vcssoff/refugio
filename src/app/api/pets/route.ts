import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendPendingModerationAlert } from "@/lib/email";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const status = searchParams.get("status") || "PUBLICADO";
    const species = searchParams.get("species");
    const size = searchParams.get("size");
    const gender = searchParams.get("gender");
    const goodWithKids = searchParams.get("goodWithKids");
    const goodWithDogs = searchParams.get("goodWithDogs");
    const goodWithCats = searchParams.get("goodWithCats");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (type) where.type = type;
    if (status && status !== "ALL") where.status = status;
    if (species) where.species = species;
    if (size) where.size = size;
    if (gender) where.gender = gender;
    if (goodWithKids === "true") where.goodWithKids = true;
    if (goodWithDogs === "true") where.goodWithDogs = true;
    if (goodWithCats === "true") where.goodWithCats = true;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { name: { contains: search } },
        { description: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const pets = await prisma.pet.findMany({
      where,
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
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ pets });
  } catch (error) {
    console.error("Error en GET /api/pets:", error);
    return NextResponse.json({ error: "Error al obtener mascotas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const {
      title,
      type,
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
      goodWithDogs,
      goodWithCats,
      goodWithKids,
      description,
      contactEmail,
      contactPhone,
      latitude,
      longitude,
      address,
      city,
      lostOrFoundDate,
      images, // array de { thumb, card, detail, original }
    } = body;

    if (!title || !type || !species || !description || !contactEmail) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios para publicar" },
        { status: 400 }
      );
    }

    // Si el usuario no ha iniciado sesión, creamos o vinculamos a un usuario temporal o requerimos sesión
    let userId = session?.user?.id;

    if (!userId) {
      // Buscar o crear usuario con el contactEmail
      let existingUser = await prisma.user.findUnique({
        where: { email: contactEmail.toLowerCase().trim() },
      });

      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            email: contactEmail.toLowerCase().trim(),
            name: name ? `Dueño de ${name}` : "Usuario",
            role: "USUARIO",
          },
        });
      }
      userId = existingUser.id;
    }

    // Regla de negocio: Toda publicación nueva entra como PENDIENTE_MODERACION
    const pet = await prisma.pet.create({
      data: {
        title,
        type,
        status: "PENDIENTE_MODERACION",
        species,
        otherSpecies: otherSpecies || null,
        name: name || null,
        gender: gender || "DESCONOCIDO",
        ageGroup: ageGroup || "ADULTO",
        size: size || "MEDIANO",
        color: color || null,
        vaccinated: Boolean(vaccinated),
        dewormed: Boolean(dewormed),
        neutered: Boolean(neutered),
        specialNeeds: specialNeeds || null,
        goodWithDogs: Boolean(goodWithDogs),
        goodWithCats: Boolean(goodWithCats),
        goodWithKids: Boolean(goodWithKids),
        description,
        contactEmail,
        contactPhone: contactPhone || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        address: address || null,
        city: city || null,
        lostOrFoundDate: lostOrFoundDate ? new Date(lostOrFoundDate) : null,
        userId,
        // Guardar las imágenes con sus 4 resoluciones WebP
        images: {
          create: (images || []).map(
            (
              img: { thumb: string; card: string; detail: string; original: string },
              index: number
            ) => ({
              urlThumb: img.thumb,
              urlCard: img.card,
              urlDetail: img.detail,
              urlOriginal: img.original,
              order: index,
            })
          ),
        },
      },
      include: {
        images: true,
      },
    });

    // Enviar alerta de moderación por correo al dueño de la página / admin
    await sendPendingModerationAlert({
      petId: pet.id,
      petTitle: pet.title,
      petType: pet.type,
      authorEmail: contactEmail,
    });

    return NextResponse.json({ success: true, pet }, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/pets:", error);
    return NextResponse.json({ error: "Error al crear la publicación" }, { status: 500 });
  }
}
