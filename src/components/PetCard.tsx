"use client";

import React from "react";
import Link from "next/link";
import ResponsivePicture from "./ResponsivePicture";
import {
  TYPE_LABELS,
  SPECIES_LABELS,
  GENDER_LABELS,
  PetType,
  Species,
  Gender,
} from "@/lib/constants";
import { MapPin, Check, Heart, ShieldCheck, Sparkles } from "lucide-react";

export interface PetCardData {
  id: string;
  title: string;
  type: string;
  species: string;
  name?: string | null;
  gender: string;
  ageGroup: string;
  size: string;
  city?: string | null;
  vaccinated: boolean;
  neutered: boolean;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  images: Array<{
    urlThumb: string;
    urlCard: string;
    urlDetail: string;
    urlOriginal: string;
  }>;
  user?: {
    isVerifiedShelter?: boolean;
    shelterName?: string | null;
  } | null;
}

interface PetCardProps {
  pet: PetCardData;
}

export default function PetCard({ pet }: PetCardProps) {
  const typeConfig = TYPE_LABELS[pet.type as PetType] || {
    label: pet.type,
    badgeColor: "bg-slate-100 text-slate-700",
  };
  const primaryImage = pet.images?.[0];

  return (
    <Link
      href={`/mascota/${pet.id}`}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-teal-200 transition-all duration-300 relative"
    >
      {/* Contenedor de Imagen Responsiva */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-slate-100">
        <ResponsivePicture
          thumb={primaryImage?.urlThumb}
          card={primaryImage?.urlCard}
          detail={primaryImage?.urlDetail}
          original={primaryImage?.urlOriginal}
          alt={pet.title}
        />

        {/* Badge de Tipo */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs backdrop-blur-md ${typeConfig.badgeColor}`}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* Refugio Verificado Badge */}
        {pet.user?.isVerifiedShelter && (
          <div className="absolute top-3 right-3 z-10 bg-teal-600/90 text-white p-1.5 rounded-full shadow-xs backdrop-blur-sm" title="Publicado por Refugio Verificado">
            <ShieldCheck className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span>
              {SPECIES_LABELS[pet.species as Species] || pet.species} •{" "}
              {GENDER_LABELS[pet.gender as Gender] || pet.gender}
            </span>
            {pet.city && (
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                {pet.city}
              </span>
            )}
          </div>

          <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 mb-2">
            {pet.title}
          </h3>

          {/* Tags de características */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pet.neutered && (
              <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-100">
                <Check className="w-3 h-3" /> Castrado/a
              </span>
            )}
            {pet.vaccinated && (
              <span className="text-[11px] font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md flex items-center gap-1 border border-teal-100">
                <Check className="w-3 h-3" /> Vacunado/a
              </span>
            )}
            {pet.goodWithKids && (
              <span className="text-[11px] font-medium bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md flex items-center gap-1 border border-sky-100">
                <Sparkles className="w-3 h-3" /> Con Niños
              </span>
            )}
          </div>
        </div>

        {/* Footer de Tarjeta con Call to Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
          <span>{pet.type === "ADOPCION" ? "Conocer y Postular" : "Ver Ubicación & Contacto"}</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
