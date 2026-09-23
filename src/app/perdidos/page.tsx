import React from "react";
import { prisma } from "@/lib/prisma";
import PerdidosClient from "./PerdidosClient";
import { PetCardData } from "@/components/PetCard";

export const revalidate = 0; // SSR dinámico

interface PageProps {
  searchParams: Promise<{ view?: string }>;
}

async function getLostAndFoundPets(): Promise<PetCardData[]> {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        type: { in: ["PERDIDO", "ENCONTRADO"] },
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
    console.error("Error al cargar perdidos y encontrados:", error);
    return [];
  }
}

export default async function PerdidosPage({ searchParams }: PageProps) {
  const { view } = await searchParams;
  const pets = await getLostAndFoundPets();

  return (
    <PerdidosClient
      initialPets={pets}
      defaultView={view === "map" ? "map" : "grid"}
    />
  );
}
