"use client";

import React, { useState } from "react";
import Link from "next/link";
import ResponsivePicture from "@/components/ResponsivePicture";
import AdoptionFormModal from "@/components/AdoptionFormModal";
import PetComments from "@/components/PetComments";
import dynamic from "next/dynamic";
import {
  TYPE_LABELS,
  SPECIES_LABELS,
  GENDER_LABELS,
  AGE_LABELS,
  SIZE_LABELS,
  PetType,
  Species,
  Gender,
  AgeGroup,
  PetSize,
} from "@/lib/constants";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  ShieldCheck,
  Heart,
  Share2,
  AlertCircle,
  Printer,
  Sparkles,
  Stethoscope,
} from "lucide-react";

const MapExplorer = dynamic(() => import("@/components/map/MapExplorer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] bg-[#fbf7f1] animate-pulse rounded-2xl flex items-center justify-center text-xs text-stone-500 font-medium">
      Cargando mapa con radio de 300 metros...
    </div>
  ),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PetDetailClient({ pet }: { pet: any }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = pet.images || [];
  const activeImage = images[selectedImageIndex] || images[0];

  const typeConfig = TYPE_LABELS[pet.type as PetType] || {
    label: pet.type,
    badgeColor: "bg-orange-100 text-orange-900 border-orange-200",
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const hasLocation = pet.latitude !== null && pet.longitude !== null;
  const isLostOrFound = pet.type === "PERDIDO" || pet.type === "ENCONTRADO";
  const shelterName = pet.shelterLocation || "Refugio Patitas - Sede Montevideo";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Acciones */}
      <div className="flex items-center justify-between text-xs text-[#63554b]">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-orange-600 font-medium">Inicio</Link>
          <span>/</span>
          <Link
            href={pet.type === "ADOPCION" ? "/adopciones" : "/perdidos"}
            className="hover:text-orange-600 font-medium"
          >
            {typeConfig.label}
          </Link>
          <span>/</span>
          <span className="text-[#2d2420] font-bold truncate max-w-[150px] sm:max-w-xs">{pet.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {isLostOrFound && (
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-orange-200 bg-[#fbf5ec] hover:bg-orange-100 text-orange-900 font-bold active:scale-95 touch-manipulation cursor-pointer transition-all shadow-xs"
              title="Imprimir cartel para pegar en la vía pública"
            >
              <Printer className="w-3.5 h-3.5 text-orange-600" />
              <span>Imprimir Cartel</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#ded5c7] bg-white text-[#3e342f] hover:bg-[#f6eee4] active:scale-95 font-semibold transition-all touch-manipulation cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-orange-600" />
            <span>{copiedLink ? "¡Copiado!" : "Compartir"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Galería a la izquierda, Información a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Galería de Fotos WebP & Comentarios */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden border border-[#eee6dc] shadow-md bg-[#f7efe6]">
            <ResponsivePicture
              thumb={activeImage?.urlThumb}
              card={activeImage?.urlCard}
              detail={activeImage?.urlDetail}
              original={activeImage?.urlOriginal}
              alt={pet.title}
              priority={true}
            />

            {/* Badges de Estado y Urgencia */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border shadow-xs backdrop-blur-md ${typeConfig.badgeColor}`}
              >
                {typeConfig.label}
              </span>

              {pet.isUrgent && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-950 border border-rose-300 shadow-xs backdrop-blur-md">
                  🚨 Adopción Urgente
                </span>
              )}

              {pet.ageGroup === "SENIOR" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300 shadow-xs backdrop-blur-md">
                  👴 Abuelito Senior
                </span>
              )}
            </div>
          </div>

          {/* Carrusel de Miniaturas */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {images.map((img: any, idx: number) => (
                <button
                  type="button"
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all touch-manipulation cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-orange-500 ring-2 ring-orange-500/30 scale-102"
                      : "border-[#ded5c7] opacity-75 hover:opacity-100"
                  }`}
                >
                  <ResponsivePicture
                    thumb={img.urlThumb}
                    card={img.urlCard}
                    alt={`Miniatura ${idx + 1}`}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Descripción & Historia */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ded1] shadow-xs space-y-4">
            <h2 className="text-lg font-black text-[#2d2420]">Historia y Cuidados</h2>
            <div className="text-sm text-[#4a3f35] leading-relaxed whitespace-pre-line">
              {pet.description}
            </div>

            {/* Condición Médica / Herida Destacada */}
            {pet.healthCondition && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-950">
                <Stethoscope className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black block text-sm">Estado de Salud y Cuidados Especiales:</strong>
                  <p className="mt-0.5">{pet.healthCondition}</p>
                </div>
              </div>
            )}
          </div>

          {/* Ubicación con Radio de 300 Metros */}
          {hasLocation && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ded1] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#2d2420] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    Ubicación Aproximada en Uruguay
                  </h3>
                  <p className="text-xs text-[#63554b]">
                    {pet.city ? `${pet.city}` : "Montevideo"} • Mostrando radio protector de 300 metros
                  </p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#eee6dc]">
                <MapExplorer
                  pets={[
                    {
                      id: pet.id,
                      title: pet.title,
                      type: pet.type,
                      species: pet.species,
                      latitude: pet.latitude,
                      longitude: pet.longitude,
                      city: pet.city,
                      address: pet.address,
                      imageUrl: activeImage?.urlThumb,
                    },
                  ]}
                  centerLat={pet.latitude}
                  centerLng={pet.longitude}
                  zoom={15}
                  height="340px"
                />
              </div>
            </div>
          )}

          {/* Muro Comunitario de Avistamientos y Comentarios */}
          {isLostOrFound && (
            <PetComments petId={pet.id} petTitle={pet.title} initialComments={pet.comments || []} />
          )}
        </div>

        {/* Columna Derecha: Ficha Técnica & Contacto */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ded1] shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block mb-1">
                Ficha Técnica
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#2d2420] leading-tight">
                {pet.name || pet.title}
              </h1>
              {pet.city && (
                <p className="text-xs text-[#523e2e] flex items-center gap-1 mt-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  {pet.city} {pet.address ? `(${pet.address})` : ""}
                </p>
              )}
            </div>

            {/* Grid de Atributos */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#fbf8f3] border border-[#ebe0d3]">
                <span className="text-[#63554b] block text-[10px] uppercase font-bold">Especie</span>
                <span className="font-extrabold text-[#2d2420] text-sm">
                  {SPECIES_LABELS[pet.species as Species] || pet.species}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#fbf8f3] border border-[#ebe0d3]">
                <span className="text-[#63554b] block text-[10px] uppercase font-bold">Género</span>
                <span className="font-extrabold text-[#2d2420] text-sm">
                  {GENDER_LABELS[pet.gender as Gender] || pet.gender}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#fbf8f3] border border-[#ebe0d3]">
                <span className="text-[#63554b] block text-[10px] uppercase font-bold">Edad Estimada</span>
                <span className="font-extrabold text-[#2d2420] text-sm">
                  {AGE_LABELS[pet.ageGroup as AgeGroup] || pet.ageGroup}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#fbf8f3] border border-[#ebe0d3]">
                <span className="text-[#63554b] block text-[10px] uppercase font-bold">Tamaño</span>
                <span className="font-extrabold text-[#2d2420] text-sm">
                  {SIZE_LABELS[pet.size as PetSize] || pet.size}
                </span>
              </div>
            </div>

            {/* Salud */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#63554b] uppercase tracking-wider">
                Estado Veterinario
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold ${
                    pet.neutered
                      ? "bg-amber-50 text-amber-900 border-amber-200"
                      : "bg-[#fbf8f3] text-stone-500 border-[#ded5c7]"
                  }`}
                >
                  {pet.neutered ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <span className="truncate">Castrado/a</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold ${
                    pet.vaccinated
                      ? "bg-amber-50 text-amber-900 border-amber-200"
                      : "bg-[#fbf8f3] text-stone-500 border-[#ded5c7]"
                  }`}
                >
                  {pet.vaccinated ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <span className="truncate">Vacunado/a</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold ${
                    pet.dewormed
                      ? "bg-amber-50 text-amber-900 border-amber-200"
                      : "bg-[#fbf8f3] text-stone-500 border-[#ded5c7]"
                  }`}
                >
                  {pet.dewormed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <span className="truncate">Desparasitado</span>
                </div>
              </div>
            </div>

            {/* Convivencia */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#63554b] uppercase tracking-wider">
                Convivencia y Temperamento
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span
                  className={`px-3 py-1.5 rounded-xl font-semibold border ${
                    pet.goodWithKids
                      ? "bg-rose-50 text-rose-900 border-rose-200"
                      : "bg-[#fbf8f3] text-stone-500 border-[#ded5c7]"
                  }`}
                >
                  {pet.goodWithKids ? "✅ Apto para Niños" : "⚠️ Preferible sin niños pequeños"}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-xl font-semibold border ${
                    pet.goodWithDogs
                      ? "bg-orange-50 text-orange-900 border-orange-200"
                      : "bg-[#fbf8f3] text-stone-500 border-[#ded5c7]"
                  }`}
                >
                  {pet.goodWithDogs ? "✅ Sociable con perros" : "⚠️ Único perro"}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-xl font-semibold border ${
                    pet.goodWithCats
                      ? "bg-amber-50 text-amber-900 border-amber-200"
                      : "bg-[#fbf8f3] text-stone-500 border-[#ded5c7]"
                  }`}
                >
                  {pet.goodWithCats ? "✅ Sociable con gatos" : "⚠️ No convive con gatos"}
                </span>
              </div>
            </div>

            {/* Botón Principal de Adopción o Reporte */}
            {pet.type === "ADOPCION" ? (
              <div className="pt-4 border-t border-[#eee6dc] space-y-3">
                <button
                  type="button"
                  onClick={() => setIsAdoptionModalOpen(true)}
                  className="w-full min-h-[52px] flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-400 hover:from-orange-600 hover:to-rose-500 text-white font-black rounded-2xl shadow-sm text-base transition-all active:scale-95 touch-manipulation cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>Quiero Adoptar & Coordinar Visita</span>
                </button>
                <p className="text-[11px] text-[#63554b] text-center">
                  Selecciona tu día y horario para conocerlo en <strong>{shelterName}</strong>.
                </p>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#eee6dc] space-y-3">
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-950 space-y-2">
                  <strong className="font-black text-sm flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    ¿Tienes información o viste a esta mascota?
                  </strong>
                  <p>
                    Comunícate con su familia o escribe un aviso en el <strong>Muro de Avistamientos</strong> más abajo.
                  </p>
                </div>
              </div>
            )}

            {/* Datos de Contacto Directo (Uruguay) */}
            <div className="pt-2 border-t border-[#eee6dc] space-y-3">
              <h3 className="text-xs font-bold text-[#63554b] uppercase tracking-wider">
                Contacto Directo en Uruguay
              </h3>
              
              <div className="space-y-2">
                <a
                  href={`mailto:${pet.contactEmail}?subject=Consulta%20desde%20Refugio%20Patitas:%20${encodeURIComponent(pet.title)}`}
                  className="min-h-[48px] flex items-center gap-3 p-3 rounded-2xl bg-[#fbf8f3] hover:bg-[#f6eee4] text-[#2d2420] border border-[#ded5c7] transition-all text-xs font-semibold touch-manipulation active:scale-98"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] text-stone-500 block font-normal">Correo</span>
                    <span className="truncate">{pet.contactEmail}</span>
                  </div>
                </a>

                {pet.contactPhone && (
                  <a
                    href={`https://wa.me/${pet.contactPhone.replace(/[^0-9]/g, "")}?text=Hola,%20te%20escribo%20desde%20Refugio%20Patitas%20Uruguay%20sobre:%20${encodeURIComponent(pet.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 transition-all text-xs font-bold touch-manipulation active:scale-98"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-700 block font-normal">WhatsApp Uruguay (Toca para abrir chat)</span>
                      <span>{pet.contactPhone}</span>
                    </div>
                  </a>
                )}
              </div>

              {pet.user?.isVerifiedShelter && (
                <div className="flex items-center gap-2 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Publicado por <strong>{pet.user.shelterName || "Refugio Patitas Verificado"}</strong>.
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Modal Cuestionario de Adopción */}
      <AdoptionFormModal
        pet={{
          id: pet.id,
          title: pet.title,
          contactEmail: pet.contactEmail,
          shelterLocation: shelterName,
        }}
        isOpen={isAdoptionModalOpen}
        onClose={() => setIsAdoptionModalOpen(false)}
      />
    </div>
  );
}
