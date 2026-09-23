import React from "react";
import { prisma } from "@/lib/prisma";
import MascotaIdealWizard from "@/components/MascotaIdealWizard";
import { PetCardData } from "@/components/PetCard";

export const revalidate = 0; // SSR dinámico

export const metadata = {
  title: "Mi Mascota Ideal - Test de Compatibilidad - Refugio Patitas",
  description: "Descubre qué perro o gato de Refugio Patitas es más compatible con tu estilo de vida, vivienda y rutina.",
};

export default async function MascotaIdealPage() {
  const pets = await prisma.pet.findMany({
    where: {
      type: "ADOPCION",
      status: "PUBLICADO",
    },
    include: {
      images: { orderBy: { order: "asc" } },
      user: {
        select: {
          isVerifiedShelter: true,
          shelterName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <MascotaIdealWizard availablePets={pets as unknown as PetCardData[]} />;
}
