"use client";

import React, { useState } from "react";
import Link from "next/link";
import ResponsivePicture from "@/components/ResponsivePicture";
import AdoptionFormModal from "@/components/AdoptionFormModal";
import MapExplorer from "@/components/map/MapExplorer";
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
  Calendar,
  AlertCircle,
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
    badgeColor: "bg-slate-100 text-slate-800",
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const hasLocation = pet.latitude !== null && pet.longitude !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Acciones */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-teal-600">Inicio</Link>
          <span>/</span>
          <Link
            href={pet.type === "ADOPCION" ? "/adopciones" : "/perdidos"}
            className="hover:text-teal-600"
          >
            {typeConfig.label}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate max-w-[150px]">{pet.title}</span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-teal-600" />
          {copiedLink ? "¡Enlace copiado!" : "Compartir"}
        </button>
      </div>

      {/* Main Grid: Galería a la izquierda, Información a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Galería de Fotos WebP */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
            <ResponsivePicture
              thumb={activeImage?.urlThumb}
              card={activeImage?.urlCard}
              detail={activeImage?.urlDetail}
              original={activeImage?.urlOriginal}
              alt={pet.title}
              priority={true}
            />

            <div className="absolute top-4 left-4 z-10">
              <span
                className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs backdrop-blur-md ${typeConfig.badgeColor}`}
              >
                {typeConfig.label}
              </span>
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
                      ? "border-teal-600 ring-2 ring-teal-500/30 scale-102"
                      : "border-slate-200 opacity-75 hover:opacity-100"
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Historia y Detalles</h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {pet.description}
            </div>

            {pet.specialNeeds && (
              <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Cuidados o Necesidades Especiales:</strong>{" "}
                  {pet.specialNeeds}
                </div>
              </div>
            )}
          </div>

          {/* Mapa con Radio de 300 metros si tiene geolocalización */}
          {hasLocation && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    Zona Reportada (Radio de 300 Metros)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {pet.city ? `${pet.city} • ` : ""}
                    {pet.address || "Área aproximada"}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
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
        </div>

        {/* Columna Derecha: Tarjeta de Datos y Formulario / Contacto */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <span>{SPECIES_LABELS[pet.species as Species] || pet.species}</span>
                {pet.name && <span>• Nombre: <strong>{pet.name}</strong></span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{pet.title}</h1>
              {pet.city && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>{pet.city} {pet.address ? `(${pet.address})` : ""}</span>
                </div>
              )}
            </div>

            {/* Ficha Rápida: Grid de Características */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Género</span>
                <span className="font-bold text-slate-800">
                  {GENDER_LABELS[pet.gender as Gender] || pet.gender}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Edad Estimada</span>
                <span className="font-bold text-slate-800">
                  {AGE_LABELS[pet.ageGroup as AgeGroup] || pet.ageGroup}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Tamaño</span>
                <span className="font-bold text-slate-800">
                  {SIZE_LABELS[pet.size as PetSize] || pet.size}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Color / Rasgos</span>
                <span className="font-bold text-slate-800">{pet.color || "No especificado"}</span>
              </div>
            </div>

            {/* Salud y Cuidados */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Estado de Salud y Cuidados
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                    pet.neutered
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
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
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
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
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
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
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Convivencia y Temperamento
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span
                  className={`px-3 py-1.5 rounded-xl font-semibold border ${
                    pet.goodWithKids
                      ? "bg-sky-50 text-sky-800 border-sky-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  {pet.goodWithKids ? "✅ Apto para Niños" : "⚠️ Preferible sin niños pequeños"}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-xl font-semibold border ${
                    pet.goodWithDogs
                      ? "bg-sky-50 text-sky-800 border-sky-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  {pet.goodWithDogs ? "✅ Sociable con perros" : "⚠️ Único perro"}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-xl font-semibold border ${
                    pet.goodWithCats
                      ? "bg-sky-50 text-sky-800 border-sky-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  {pet.goodWithCats ? "✅ Sociable con gatos" : "⚠️ No convive con gatos"}
                </span>
              </div>
            </div>

            {/* Botón Principal de Adopción o Reporte */}
            {pet.type === "ADOPCION" ? (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <button
                  onClick={() => setIsAdoptionModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/30 text-base transition-all active:scale-98"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Quiero Adoptar a {pet.name || "esta Mascota"}
                </button>
                <p className="text-[11px] text-slate-500 text-center">
                  Completarás un cuestionario responsable que se enviará automáticamente al correo del refugio.
                </p>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-900 space-y-1">
                  <strong className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    ¿Tienes información o viste a esta mascota?
                  </strong>
                  <p>
                    Comunícate de inmediato con su familia utilizando los datos de contacto a continuación.
                  </p>
                </div>
              </div>
            )}

            {/* Datos de Contacto Directo */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Contacto del Refugio o Dueño
              </h3>
              
              <div className="space-y-2">
                <a
                  href={`mailto:${pet.contactEmail}?subject=Consulta%20sobre%20${encodeURIComponent(pet.title)}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 text-slate-800 hover:text-teal-800 border border-slate-200 transition-colors text-xs font-semibold"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block font-normal">Correo de Contacto</span>
                    <span className="truncate">{pet.contactEmail}</span>
                  </div>
                </a>

                {pet.contactPhone && (
                  <a
                    href={`https://wa.me/${pet.contactPhone.replace(/[^0-9]/g, "")}?text=Hola,%20te%20escribo%20por%20la%20publicaci%C3%B3n%20en%20Refugio:%20${encodeURIComponent(pet.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 transition-colors text-xs font-semibold"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">WhatsApp / Teléfono</span>
                      <span>{pet.contactPhone}</span>
                    </div>
                  </a>
                )}
              </div>

              {pet.user?.isVerifiedShelter && (
                <div className="flex items-center gap-2 p-3 bg-teal-50/70 border border-teal-200 rounded-2xl text-xs text-teal-900">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    Publicado por <strong>{pet.user.shelterName || "Refugio Verificado"}</strong>. Cuenta respaldada por nuestra comunidad.
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Modal Cuestionario de Adopción */}
      <AdoptionFormModal
        pet={{ id: pet.id, title: pet.title, contactEmail: pet.contactEmail }}
        isOpen={isAdoptionModalOpen}
        onClose={() => setIsAdoptionModalOpen(false)}
      />
    </div>
  );
}
