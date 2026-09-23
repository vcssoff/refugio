import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ModeracionClient from "./ModeracionClient";

export const revalidate = 0; // SSR dinámico

export const metadata = {
  title: "Panel de Moderación - Refugio",
  description: "Revisión y aprobación comunitaria de publicaciones de mascotas.",
};

export default async function ModeracionPage() {
  const session = await auth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isVerifiedShelter = (session?.user as any)?.isVerifiedShelter;
  const isAuthorized = userRole === "ADMIN" || userRole === "REFUGIO" || Boolean(isVerifiedShelter);

  const pendingPets = await prisma.pet.findMany({
    where: {
      status: "PENDIENTE_MODERACION",
    },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
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

  // Convertimos las fechas a strings serializables
  const formattedPets = pendingPets.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <ModeracionClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialPendingPets={formattedPets as any}
      isAuthorized={isAuthorized}
    />
  );
}
