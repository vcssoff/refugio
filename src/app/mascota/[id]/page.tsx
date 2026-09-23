import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PetDetailClient from "./PetDetailClient";
import type { Metadata } from "next";

export const revalidate = 0; // SSR dinámico

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pet = await prisma.pet.findUnique({
    where: { id },
    select: { title: true, description: true, type: true },
  });

  if (!pet) return { title: "Mascota no encontrada - Refugio" };

  return {
    title: `${pet.title} (${pet.type === "ADOPCION" ? "En Adopción" : "Alerta"}) - Refugio`,
    description: pet.description.slice(0, 160),
  };
}

export default async function PetDetailPage({ params }: PageProps) {
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
    notFound();
  }

  return <PetDetailClient pet={pet} />;
}
