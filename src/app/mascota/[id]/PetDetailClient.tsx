"use client";

import React, { useState } from "react";
import Link from "next/link";
import ResponsivePicture from "@/components/ResponsivePicture";
import AdoptionFormModal from "@/components/AdoptionFormModal";
import MapExplorer from "@/components/map/MapExplorer";
import PetComments from "@/components/PetComments";
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
  Heart,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Share2,
  AlertCircle,
  Stethoscope,
  Sparkles,
  Printer,
  Calendar,
} from "lucide-react";

interface PetDetailClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pet: any;
}

export default function PetDetailClient({ pet }: PetDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = pet.images || [];
  const activeImage = images[selectedImageIndex] || images[0];
  const typeConfig = TYPE_LABELS[pet.type as PetType] || {
    label: pet.type,
    badgeColor: "bg-orange-100 text-orange-900",
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
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-orange-500">Inicio</Link>
          <span>/</span>
          <Link
            href={pet.type === "ADOPCION" ? "/adopciones" : "/perdidos"}
            className="hover:text-orange-500"
          >
            {typeConfig.label}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-stone-200 font-semibold truncate max-w-[150px]">{pet.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {isLostOrFound && (
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-stone-700 bg-orange-50/50 dark:bg-stone-800 text-orange-800 dark:text-orange-300 font-bold hover:bg-orange-100 transition-colors"
              title="Imprimir cartel para pegar en la vía pública"
            >
              <Printer className="w-3.5 h-3.5 text-orange-600" />
              Imprimir Cartel
            </button>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-300 hover:bg-orange-50/50 dark:hover:bg-stone-800 transition-colors font-semibold"
          >
            <Share2 className="w-3.5 h-3.5 text-orange-500" />
            {copiedLink ? "¡Copiado!" : "Compartir"}
          </button>
        </div>
      </div>

      {/* Main Grid: Galería a la izquierda, Información a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Galería de Fotos WebP & Comentarios */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden border border-orange-100 dark:border-stone-800 shadow-md bg-orange-50/40 dark:bg-stone-800">
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
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-200/95 text-rose-950 border border-rose-300 shadow-xs backdrop-blur-md animate-pulse">
                  🚨 Adopción Urgente
                </span>
              )}

              {pet.ageGroup === "SENIOR" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-200/95 text-amber-950 border border-amber-300 shadow-xs backdrop-blur-md">
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
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? "border-orange-500 ring-2 ring-orange-500/30 scale-102"
                      : "border-slate-200 dark:border-stone-700 opacity-75 hover:opacity-100"
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
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-orange-100 dark:border-stone-800 shadow-xs space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-stone-100">Historia y Cuidados</h2>
            <div className="text-sm text-slate-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
              {pet.description}
            </div>

            {/* Condición Médica / Herida Destacada */}
            {pet.healthCondition && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-start gap-3 text-xs text-rose-950 dark:text-rose-200">
                <Stethoscope className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black text-sm block">Condición Médica / Atención Especial:</strong>
                  <p className="mt-0.5">{pet.healthCondition}</p>
                </div>
              </div>
            )}

            {pet.specialNeeds && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Requerimientos Adicionales:</strong>{" "}
                  {pet.specialNeeds}
                </div>
              </div>
            )}
          </div>

          {/* Mapa con Radio de 300 metros si tiene geolocalización (Uruguay) */}
          {hasLocation && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-orange-100 dark:border-stone-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-stone-100 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    Zona Reportada en Uruguay (Radio de 300 Metros)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-stone-400">
                    {pet.city ? `${pet.city} • ` : ""}
                    {pet.address || "Área aproximada"}
                  </p>
                </div>
                <span className="text-[11px] font-black text-orange-800 dark:text-orange-300 bg-orange-100 dark:bg-stone-800 px-3 py-1 rounded-xl">
                  Radio 300m
                </span>
              </div>

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
                    imageUrl: activeImage?.urlThumb,
                  },
                ]}
                centerLat={pet.latitude}
                centerLng={pet.longitude}
                zoom={15}
                height="320px"
              />
            </div>
          )}

          {/* Muro de Comentarios y Avistamientos para Mascotas Perdidas y Encontradas */}
          {isLostOrFound && (
            <PetComments
              petId={pet.id}
              petTitle={pet.title}
              initialComments={pet.comments || []}
            />
          )}
        </div>

        {/* Columna Derecha: Tarjeta de Datos y Formulario / Contacto */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-orange-100 dark:border-stone-800 shadow-md space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-stone-400 mb-1">
                <span>{SPECIES_LABELS[pet.species as Species] || pet.species}</span>
                {pet.name && <span>• Nombre: <strong>{pet.name}</strong></span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{pet.title}</h1>
              {pet.city && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-stone-400 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>{pet.city} {pet.address ? `(${pet.address})` : ""}</span>
                </div>
              )}
            </div>

            {/* Ficha Rápida: Grid de Características */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-orange-50/40 dark:bg-stone-800/60 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 dark:text-stone-400 block font-medium">Género</span>
                <span className="font-bold text-slate-800 dark:text-stone-100">
                  {GENDER_LABELS[pet.gender as Gender] || pet.gender}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-stone-400 block font-medium">Edad Estimada</span>
                <span className="font-bold text-slate-800 dark:text-stone-100">
                  {AGE_LABELS[pet.ageGroup as AgeGroup] || pet.ageGroup}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-stone-400 block font-medium">Tamaño</span>
                <span className="font-bold text-slate-800 dark:text-stone-100">
                  {SIZE_LABELS[pet.size as PetSize] || pet.size}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-stone-400 block font-medium">Color / Rasgos</span>
                <span className="font-bold text-slate-800 dark:text-stone-100">{pet.color || "No especificado"}</span>
              </div>
            </div>

            {/* Salud y Cuidados */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 dark:text-stone-400 uppercase tracking-wider">
                Estado Veterinario
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                    pet.neutered
                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                      : "bg-slate-50 dark:bg-stone-800 text-slate-500 border-slate-200 dark:border-stone-700"
                  }`}
                >
                  {pet.neutered ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Castrado/a</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                    pet.vaccinated
                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                      : "bg-slate-50 dark:bg-stone-800 text-slate-500 border-slate-200 dark:border-stone-700"
                  }`}
                >
                  {pet.vaccinated ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Vacunado/a</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                    pet.dewormed
                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                      : "bg-slate-50 dark:bg-stone-800 text-slate-500 border-slate-200 dark:border-stone-700"
                  }`}
                >
                  {pet.dewormed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Desparasitado</span>
                </div>
              </div>
            </div>

            {/* Convivencia */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 dark:text-stone-400 uppercase tracking-wider">
                Convivencia y Temperamento
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span
                  className={`px-3 py-1.5 rounded-xl font-semibold border ${
                    pet.goodWithKids
                      ? "bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800"
                      : "bg-slate-50 dark:bg-stone-800 text-slate-500 border-slate-200 dark:border-stone-700"
                  }`}
                >
                  {pet.goodWithKids ? "✅ Apto para Niños" : "⚠️ Preferible sin niños pequeños"}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-xl font-semibold border ${
                    pet.goodWithDogs
                      ? "bg-orange-50 dark:bg-orange-950/60 text-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800"
                      : "bg-slate-50 dark:bg-stone-800 text-slate-500 border-slate-200 dark:border-stone-700"
                  }`}
                >
                  {pet.goodWithDogs ? "✅ Sociable con perros" : "⚠️ Único perro"}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-xl font-semibold border ${
                    pet.goodWithCats
                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                      : "bg-slate-50 dark:bg-stone-800 text-slate-500 border-slate-200 dark:border-stone-700"
                  }`}
                >
                  {pet.goodWithCats ? "✅ Sociable con gatos" : "⚠️ No convive con gatos"}
                </span>
              </div>
            </div>

            {/* Botón Principal de Adopción o Reporte */}
            {pet.type === "ADOPCION" ? (
              <div className="pt-4 border-t border-slate-100 dark:border-stone-800 space-y-3">
                <button
                  onClick={() => setIsAdoptionModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white font-black rounded-2xl shadow-md text-base transition-all active:scale-98"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Quiero Adoptar & Coordinar Visita
                </button>
                <p className="text-[11px] text-slate-500 dark:text-stone-400 text-center">
                  Selecciona tu día y horario para conocerlo en <strong>{shelterName}</strong>.
                </p>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 dark:border-stone-800 space-y-3">
                <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 p-4 rounded-2xl text-xs text-rose-900 dark:text-rose-200 space-y-2">
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
            <div className="pt-2 border-t border-slate-100 dark:border-stone-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-stone-400 uppercase tracking-wider">
                Contacto Directo en Uruguay
              </h3>
              
              <div className="space-y-2">
                <a
                  href={`mailto:${pet.contactEmail}?subject=Consulta%20desde%20Refugio%20Patitas:%20${encodeURIComponent(pet.title)}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-stone-800 hover:bg-orange-50 dark:hover:bg-stone-750 text-slate-800 dark:text-stone-100 border border-slate-200 dark:border-stone-700 transition-colors text-xs font-semibold"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-stone-700 text-orange-700 dark:text-orange-300 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 dark:text-stone-400 block font-normal">Correo</span>
                    <span className="truncate">{pet.contactEmail}</span>
                  </div>
                </a>

                {pet.contactPhone && (
                  <a
                    href={`https://wa.me/${pet.contactPhone.replace(/[^0-9]/g, "")}?text=Hola,%20te%20escribo%20desde%20Refugio%20Patitas%20Uruguay%20sobre:%20${encodeURIComponent(pet.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 transition-colors text-xs font-bold"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-normal">WhatsApp Uruguay (Abrir chat)</span>
                      <span>{pet.contactPhone}</span>
                    </div>
                  </a>
                )}
              </div>

              {pet.user?.isVerifiedShelter && (
                <div className="flex items-center gap-2 p-3 bg-orange-50/70 dark:bg-stone-800 border border-orange-200 dark:border-stone-700 rounded-2xl text-xs text-orange-950 dark:text-orange-200">
                  <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
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
