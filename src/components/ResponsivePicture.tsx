"use client";
import React, { useState } from "react";
import { PawPrint } from "lucide-react";

interface ResponsivePictureProps {
  thumb?: string | null;
  card?: string | null;
  detail?: string | null;
  original?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export default function ResponsivePicture({
  thumb,
  card,
  detail,
  original,
  alt,
  className = "w-full h-full relative overflow-hidden bg-slate-100",
  imgClassName = "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
  priority = false,
}: ResponsivePictureProps) {
  const [hasError, setHasError] = useState(false);

  // Seleccionar la mejor URL por defecto
  const fallbackSrc = card || detail || original || thumb || "";

  if (!fallbackSrc || hasError) {
    return (
      <div className={`${className} flex flex-col items-center justify-center text-slate-400 bg-amber-50/50`}>
        <PawPrint className="w-12 h-12 text-amber-300 stroke-[1.5] mb-1" />
        <span className="text-xs font-medium text-slate-400">Sin foto disponible</span>
      </div>
    );
  }

  return (
    <picture className={className}>
      {/* Resoluciones adaptadas a diferentes viewports */}
      {thumb && (
        <source
          media="(max-width: 480px)"
          srcSet={thumb}
          type="image/webp"
        />
      )}
      {card && (
        <source
          media="(max-width: 768px)"
          srcSet={card}
          type="image/webp"
        />
      )}
      {detail && (
        <source
          media="(max-width: 1280px)"
          srcSet={detail}
          type="image/webp"
        />
      )}
      {original && (
        <source
          media="(min-width: 1281px)"
          srcSet={original}
          type="image/webp"
        />
      )}

      {/* Etiqueta img nativa estándar (0 cuota de Vercel Image Optimization) */}
      <img
        src={fallbackSrc}
        alt={alt}
        className={imgClassName}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setHasError(true)}
      />
    </picture>
  );
}
