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
import { MapPin, Check, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";

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
  isUrgent?: boolean;
  healthCondition?: string | null;
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
    badgeColor: "bg-orange-100 text-orange-900 border-orange-200",
  };
  const primaryImage = pet.images?.[0];

  return (
    <Link
      href={`/mascota/${pet.id}`}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#eee6dc] shadow-xs hover:shadow-lg hover:border-orange-300 transition-all duration-300 relative touch-manipulation cursor-pointer"
    >
      {/* Contenedor de Imagen Responsiva */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-[#f7efe6]">
        <ResponsivePicture
          thumb={primaryImage?.urlThumb}
          card={primaryImage?.urlCard}
          detail={primaryImage?.urlDetail}
          original={primaryImage?.urlOriginal}
          alt={pet.title}
        />

        {/* Badges de Tipo & Urgencia con Colores Pasteles */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[85%]">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black border shadow-xs backdrop-blur-md ${typeConfig.badgeColor}`}
          >
            {typeConfig.label}
          </span>

          {pet.isUrgent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-950 border border-rose-300 shadow-xs backdrop-blur-md">
              🚨 Urgente
            </span>
          )}

          {pet.ageGroup === "SENIOR" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-950 border border-amber-300 shadow-xs backdrop-blur-md">
              👴 Viejito Senior
            </span>
          )}
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
          <div className="flex items-center justify-between text-xs text-[#63554b] mb-1 font-medium">
            <span>
              {SPECIES_LABELS[pet.species as Species] || pet.species} •{" "}
              {GENDER_LABELS[pet.gender as Gender] || pet.gender}
            </span>
            {pet.city && (
              <span className="flex items-center gap-1 truncate max-w-[130px] font-semibold text-[#523e2e]">
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                {pet.city}
              </span>
            )}
          </div>

          <h3 className="font-extrabold text-base text-[#2d2420] group-hover:text-orange-600 transition-colors line-clamp-1 mb-2">
            {pet.title}
          </h3>

          {/* Condición Médica / Herida si existe */}
          {pet.healthCondition && (
            <div className="mb-3 px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-950 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">Condición: {pet.healthCondition}</span>
            </div>
          )}

          {/* Tags con tonalidades pasteles y amigables */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pet.neutered && (
              <span className="text-[11px] font-semibold bg-[#faf5ed] text-amber-900 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-[#e8decf]">
                <Check className="w-3 h-3 text-emerald-600" /> Castrado/a
              </span>
            )}
            {pet.vaccinated && (
              <span className="text-[11px] font-semibold bg-[#faf5ed] text-orange-900 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-[#e8decf]">
                <Check className="w-3 h-3 text-emerald-600" /> Vacunado/a
              </span>
            )}
            {pet.goodWithKids && (
              <span className="text-[11px] font-semibold bg-rose-50 text-rose-900 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-rose-200">
                <Sparkles className="w-3 h-3 text-rose-500" /> Con Niños
              </span>
            )}
          </div>
        </div>

        {/* Footer de Tarjeta con Call to Action */}
        <div className="pt-3 border-t border-[#eee6dc] flex items-center justify-between text-xs font-bold text-orange-700">
          <span>{pet.type === "ADOPCION" ? "Conocer & Agendar Visita" : "Ver Ubicación & Avisos"}</span>
          <span className="group-hover:translate-x-1 transition-transform font-black">→</span>
        </div>
      </div>
    </Link>
  );
}
