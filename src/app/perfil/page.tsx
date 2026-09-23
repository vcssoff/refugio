import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import PerfilClient from "./PerfilClient";

export const revalidate = 0; // SSR dinámico

export const metadata = {
  title: "Mi Perfil - Refugio",
  description: "Administra tus mascotas publicadas y revisa solicitudes de adopción recibidas.",
};

export default async function PerfilPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/perfil");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  const pets = await prisma.pet.findMany({
    where: { userId: user.id },
    include: {
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const receivedApplications = await prisma.adoptionApplication.findMany({
    where: {
      pet: {
        userId: user.id,
      },
    },
    include: {
      pet: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const sentApplications = await prisma.adoptionApplication.findMany({
    where: {
      applicantId: user.id,
    },
    include: {
      pet: {
        select: { id: true, title: true, contactEmail: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PerfilClient
      data={{
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerifiedShelter: user.isVerifiedShelter,
          shelterName: user.shelterName,
        },
        pets,
        receivedApplications,
        sentApplications,
      }}
    />
  );
}
