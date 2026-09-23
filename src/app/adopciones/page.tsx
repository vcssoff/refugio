import React from "react";
import { prisma } from "@/lib/prisma";
import AdopcionesClient from "./AdopcionesClient";
import { PetCardData } from "@/components/PetCard";

export const revalidate = 0; // SSR dinámico

async function getAdoptionPets(): Promise<PetCardData[]> {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        type: "ADOPCION",
        status: "PUBLICADO",
      },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        user: {
          select: {
            isVerifiedShelter: true,
            shelterName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return pets as unknown as PetCardData[];
  } catch (error) {
    console.error("Error al cargar adopciones:", error);
    return [];
  }
}

export default async function AdopcionesPage() {
  const pets = await getAdoptionPets();

  return <AdopcionesClient initialPets={pets} />;
}
