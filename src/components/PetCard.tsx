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
  shelterLocation?: string | null;
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
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
  };
  const primaryImage = pet.images?.[0];

  return (
    <Link
      href={`/mascota/${pet.id}`}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-orange-100/90 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 relative"
    >
      {/* Contenedor de Imagen Responsiva */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-orange-50/50">
        <ResponsivePicture
          thumb={primaryImage?.urlThumb}
          card={primaryImage?.urlCard}
          detail={primaryImage?.urlDetail}
          original={primaryImage?.urlOriginal}
          alt={pet.title}
        />

        {/* Badge de Tipo con colores cálidos */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black border shadow-xs backdrop-blur-md ${typeConfig.badgeColor}`}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* Refugio Verificado Badge */}
        {pet.user?.isVerifiedShelter && (
          <div className="absolute top-3 right-3 z-10 bg-orange-500/90 text-white p-1.5 rounded-full shadow-xs backdrop-blur-sm" title="Refugio Verificado Patitas">
            <ShieldCheck className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>
              {SPECIES_LABELS[pet.species as Species] || pet.species} •{" "}
              {GENDER_LABELS[pet.gender as Gender] || pet.gender}
            </span>
            {pet.city && (
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                {pet.city}
              </span>
            )}
          </div>

          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-2">
            {pet.title}
          </h3>

          {/* Tags con tonalidades cálidas y amigables */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pet.neutered && (
              <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200">
                <Check className="w-3 h-3" /> Castrado/a
              </span>
            )}
            {pet.vaccinated && (
              <span className="text-[11px] font-semibold bg-orange-50 text-orange-800 px-2 py-0.5 rounded-md flex items-center gap-1 border border-orange-200">
                <Check className="w-3 h-3" /> Vacunado/a
              </span>
            )}
            {pet.goodWithKids && (
              <span className="text-[11px] font-semibold bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md flex items-center gap-1 border border-rose-200">
                <Sparkles className="w-3 h-3 text-rose-500" /> Con Niños
              </span>
            )}
          </div>
        </div>

        {/* Footer de Tarjeta con Call to Action */}
        <div className="pt-3 border-t border-orange-50 flex items-center justify-between text-xs font-bold text-orange-600">
          <span>{pet.type === "ADOPCION" ? "Conocer & Agendar Visita" : "Ver Ubicación (300m)"}</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
