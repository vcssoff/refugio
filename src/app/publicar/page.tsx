import React, { Suspense } from "react";
import PublicarClient from "./PublicarClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Publicar Mascota - Refugio",
  description: "Publica una mascota en adopción o reporta un animal perdido o encontrado en el mapa con radio de 300 metros.",
};

export default function PublicarPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      }
    >
      <PublicarClient />
    </Suspense>
  );
}
