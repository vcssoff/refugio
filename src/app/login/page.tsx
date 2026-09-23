import React, { Suspense } from "react";
import LoginClient from "./LoginClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Iniciar Sesión o Registrarse - Refugio",
  description: "Accede a tu cuenta en Refugio para gestionar publicaciones y solicitudes de adopción.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
