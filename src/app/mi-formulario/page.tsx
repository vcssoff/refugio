import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import MiFormularioClient from "./MiFormularioClient";

export const revalidate = 0; // SSR dinámico

export const metadata = {
  title: "Mi Formulario de Adopción - Refugio Patitas",
  description: "Completa o actualiza tus datos de adoptante responsable en cualquier momento.",
};

export default async function MiFormularioPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let initialProfile = null;
  if (userId) {
    initialProfile = await prisma.userAdoptionProfile.findUnique({
      where: { userId },
    });
  }

  return (
    <MiFormularioClient
      initialProfile={initialProfile}
      isLoggedIn={Boolean(userId)}
    />
  );
}
