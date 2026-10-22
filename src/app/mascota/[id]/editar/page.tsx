import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditPetClient from "./EditPetClient";
import type { Metadata } from "next";

export const revalidate = 0; // SSR dinámico

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pet = await prisma.pet.findUnique({
    where: { id },
    select: { title: true },
  });

  if (!pet) return { title: "Mascota no encontrada - Refugio Patitas" };

  return {
    title: `Editar ${pet.title} - Refugio Patitas`,
  };
}

export default async function EditPetPage({ params }: PageProps) {
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
          email: true,
        },
      },
    },
  });

  if (!pet) {
    notFound();
  }

  return <EditPetClient pet={pet} />;
}
