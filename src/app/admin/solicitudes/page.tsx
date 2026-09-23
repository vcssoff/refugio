import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import AdminSolicitudesClient from "@/components/AdminSolicitudesClient";

export const revalidate = 0; // SSR dinámico

export const metadata = {
  title: "Bandeja de Solicitudes y Notificaciones - Refugio Patitas",
  description: "Espacio de admisión de publicaciones y gestión de solicitudes de adopción.",
};

export default async function AdminSolicitudesPage() {
  const session = await auth();

  // Publicaciones esperando admisión
  const pendingPets = await prisma.pet.findMany({
    where: {
      status: "PENDIENTE_MODERACION",
    },
    include: {
      images: { orderBy: { order: "asc" } },
      user: {
        select: {
          name: true,
          email: true,
          role: true,
          isVerifiedShelter: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Solicitudes de adopción recibidas en el sistema
  const applications = await prisma.adoptionApplication.findMany({
    include: {
      pet: {
        select: {
          id: true,
          title: true,
          contactEmail: true,
          shelterLocation: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedPets = pendingPets.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  const serializedApps = applications.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    preferredDate: a.preferredDate ? a.preferredDate.toISOString() : null,
  }));

  return (
    <AdminSolicitudesClient
      initialPendingPets={serializedPets}
      initialApplications={serializedApps}
    />
  );
}
