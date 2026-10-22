"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ImageUploaderWebP, { UploadedPetImage } from "@/components/ImageUploaderWebP";
import MapSelector from "@/components/map/MapSelector";
import {
  PetType,
  Species,
  Gender,
  AgeGroup,
  PetSize,
  TYPE_LABELS,
  SPECIES_LABELS,
  GENDER_LABELS,
  AGE_LABELS,
  SIZE_LABELS,
} from "@/lib/constants";
import {
  PawPrint,
  Heart,
  Compass,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function PublicarClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isVerifiedShelter = Boolean((session?.user as any)?.isVerifiedShelter);
  const sessionEmail = session?.user?.email?.toLowerCase()?.trim();
  const isAdminOrShelter =
    userRole === "ADMIN" ||
    userRole === "REFUGIO" ||
    isVerifiedShelter ||
    sessionEmail === "sofiaacedress@gmail.com";

  const initialType = (searchParams.get("type") as PetType) || "ADOPCION";

  const [type, setType] = useState<PetType>(initialType);
  const [images, setImages] = useState<UploadedPetImage[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [createdPet, setCreatedPet] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: -34.9011, // Montevideo, Uruguay
    lng: -56.1645,
  });

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    species: "PERRO" as Species,
    otherSpecies: "",
    gender: "MACHO" as Gender,
    ageGroup: "JOVEN" as AgeGroup,
    size: "MEDIANO" as PetSize,
    color: "",
    vaccinated: false,
    dewormed: false,
    neutered: false,
    specialNeeds: "",
    isUrgent: false,
    healthCondition: "",
    goodWithDogs: false,
    goodWithCats: false,
    goodWithKids: false,
    description: "",
    contactEmail: "",
    contactPhone: "",
    city: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (!formData.title.trim()) {
      setErrorMessage("Por favor ingresa un título para la publicación");
      setIsSubmitting(false);
      return;
    }

    if (!formData.contactEmail.trim()) {
      setErrorMessage("El correo de contacto es obligatorio para recibir notificaciones");
      setIsSubmitting(false);
      return;
    }

    if (images.length === 0) {
      setErrorMessage("Debes subir al menos una foto (se optimizará a WebP automáticamente)");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        type,
        latitude: location.lat,
        longitude: location.lng,
        images,
      };

      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al crear la publicación");
      }

      setCreatedPet(data.pet);
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Ocurrió un error inesperado");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    const isAutoPub = Boolean(createdPet?.status === "PUBLICADO" || isAdminOrShelter);

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#2d2420]">
          {isAutoPub ? "¡Mascota Publicada Exitosamente!" : "¡Publicación Recibida!"}
        </h1>

        {isAutoPub ? (
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl text-sm text-emerald-950 space-y-2 text-left shadow-xs">
            <p className="font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Publicación Directa (Sin Moderación Previa)
            </p>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Como publicaste desde tu cuenta de <strong>Administradora / Refugio</strong>, tu mascota ha quedado activa de inmediato y ya está visible para toda la comunidad.
            </p>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl text-sm text-amber-900 space-y-2 text-left shadow-xs">
            <p className="font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              En proceso de moderación comunitaria
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Se ha enviado una notificación al administrador de la página para su aprobación. En cuanto sea aprobada, aparecerá visible en el catálogo y mapa.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          {createdPet?.id && (
            <Link
              href={`/mascota/${createdPet.id}`}
              className="w-full sm:w-auto px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-sm transition-all shadow-xs"
            >
              Ver Ficha de la Mascota
            </Link>
          )}

          <Link
            href={type === "ADOPCION" ? "/adopciones" : "/perdidos"}
            className="w-full sm:w-auto px-7 py-3.5 bg-white border border-[#ded5c7] hover:bg-stone-50 text-[#3e342f] font-bold rounded-2xl text-sm transition-all"
          >
            Ver Catálogo
          </Link>

          <button
            onClick={() => {
              setIsSuccess(false);
              setImages([]);
              setCreatedPet(null);
              setFormData({
                title: "",
                name: "",
                species: "PERRO",
                otherSpecies: "",
                gender: "MACHO",
                ageGroup: "JOVEN",
                size: "MEDIANO",
                color: "",
                vaccinated: false,
                dewormed: false,
                neutered: false,
                specialNeeds: "",
                isUrgent: false,
                healthCondition: "",
                goodWithDogs: false,
                goodWithCats: false,
                goodWithKids: false,
                description: "",
                contactEmail: "",
                contactPhone: "",
                city: "",
                address: "",
              });
            }}
            className="w-full sm:w-auto px-5 py-3.5 text-xs text-stone-600 hover:text-stone-900 font-bold transition-colors cursor-pointer"
          >
            + Publicar Otra Mascota
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Encabezado */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">
          <PawPrint className="w-3.5 h-3.5 text-orange-600" />
          Nueva Publicación Solidaria
        </div>
        <h1 className="text-3xl font-black text-[#2d2420]">
          Publicar Mascota
        </h1>
        <p className="text-xs sm:text-sm text-[#63554b]">
          Completa los datos para dar en adopción o reportar un animal perdido / encontrado con mapa de radio 300m en Uruguay.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Paso 1: Tipo de Publicación */}
        <div className="bg-white rounded-3xl p-6 border border-[#ede5da] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#2d2420] uppercase tracking-wider">
            1. Selecciona el Tipo de Publicación
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["ADOPCION", "PERDIDO", "ENCONTRADO"] as PetType[]).map((t) => {
              const active = type === t;
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95 touch-manipulation cursor-pointer ${
                    active
                      ? "border-orange-500 bg-orange-50/80 ring-2 ring-orange-400/30"
                      : "border-[#ded5c7] hover:border-orange-300 bg-white"
                  }`}
                >
                  <span className="block font-bold text-sm text-[#2d2420] mb-1">
                    {TYPE_LABELS[t].label}
                  </span>
                  <span className="text-[11px] text-[#63554b] block leading-tight">
                    {TYPE_LABELS[t].description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paso 2: Fotos WebP en Cliente */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Fotografías (Conversión Automática a WebP)
            </h2>
            <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-lg">
              0 costo Vercel
            </span>
          </div>

          <ImageUploaderWebP
            onImagesUploaded={(uploadedList) => setImages(uploadedList)}
            maxImages={5}
          />
        </div>

        {/* Paso 3: Datos de la Mascota */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Información de la Mascota
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título de la publicación *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej. Cachorro mestizo busca hogar amoroso / Golden retriever perdido en Palermo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre de la mascota (si se conoce)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Toby / Manchitas"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Especie *
              </label>
              <select
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value as Species })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="PERRO">Perro</option>
                <option value="GATO">Gato</option>
                <option value="OTRO">Otros animales (Conejo, Ave, etc.)</option>
              </select>
            </div>

            {formData.species === "OTRO" && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Especificar Especie
                </label>
                <input
                  type="text"
                  value={formData.otherSpecies}
                  onChange={(e) => setFormData({ ...formData, otherSpecies: e.target.value })}
                  placeholder="Ej. Conejo enano, Loro, Tortuga"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Género</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="MACHO">Macho</option>
                <option value="HEMBRA">Hembra</option>
                <option value="DESCONOCIDO">Desconocido</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Edad Estimada</label>
              <select
                value={formData.ageGroup}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as AgeGroup })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="CACHORRO">Cachorro (0 a 1 año)</option>
                <option value="JOVEN">Joven (1 a 3 años)</option>
                <option value="ADULTO">Adulto (3 a 8 años)</option>
                <option value="SENIOR">Senior (más de 8 años)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tamaño</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value as PetSize })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="PEQUENO">Pequeño (hasta 10kg)</option>
                <option value="MEDIANO">Mediano (10 a 25kg)</option>
                <option value="GRANDE">Grande (más de 25kg)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Color / Marcas</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Ej. Marrón con patas blancas, mancha en el ojo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Salud y Cuidados */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase">Estado Veterinario</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vaccinated}
                  onChange={(e) => setFormData({ ...formData, vaccinated: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <span className="text-xs font-medium text-slate-800">Vacunado/a</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dewormed}
                  onChange={(e) => setFormData({ ...formData, dewormed: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <span className="text-xs font-medium text-slate-800">Desparasitado/a</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.neutered}
                  onChange={(e) => setFormData({ ...formData, neutered: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <span className="text-xs font-medium text-slate-800">Castrado/a</span>
              </label>
            </div>
          </div>

          {/* Convivencia y Temperamento */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase">Convivencia</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.goodWithKids}
                  onChange={(e) => setFormData({ ...formData, goodWithKids: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <span className="text-xs font-medium text-slate-800">Sociable con Niños</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.goodWithDogs}
                  onChange={(e) => setFormData({ ...formData, goodWithDogs: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <span className="text-xs font-medium text-slate-800">Sociable con Perros</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.goodWithCats}
                  onChange={(e) => setFormData({ ...formData, goodWithCats: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <span className="text-xs font-medium text-slate-800">Sociable con Gatos</span>
              </label>
            </div>
          </div>

          {/* Adopciones Urgentes y Estado de Salud / Heridas */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Adopción Urgente y Estado de Salud
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-rose-200 bg-rose-50/40 cursor-pointer hover:bg-rose-50/70 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <div>
                  <span className="text-xs font-bold text-rose-900 block">🚨 Marcar como Caso Urgente / Patitas Doradas</span>
                  <span className="text-[11px] text-rose-700">Mascotas de edad avanzada (senior), con necesidad de tratamiento o rescate prioritario.</span>
                </div>
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Herida, discapacidad o enfermedad conocida (opcional)
                </label>
                <input
                  type="text"
                  value={formData.healthCondition}
                  onChange={(e) => setFormData({ ...formData, healthCondition: e.target.value })}
                  placeholder="Ej. Le falta una patita trasera (trípode), tiene asma, ciego de un ojito..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descripción, historia o detalles del animal *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Cuéntanos su personalidad, cómo fue rescatado o las circunstancias donde se perdió..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Paso 4: Ubicación y Mapa con Radio de 300 Metros */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-600" />
              4. Ubicación en Mapa (Radio de 300 Metros)
            </h2>
            <span className="text-xs text-slate-400">OpenStreetMap (Sin clave API)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ciudad o Localidad *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ej. Montevideo / Canelones / Maldonado"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Barrio o Calle aproximada
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Ej. Pocitos, Av. Brasil y Benito Blanco"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <MapSelector
            initialLat={location.lat}
            initialLng={location.lng}
            onLocationSelected={(coords) => setLocation(coords)}
            height="340px"
          />
        </div>

        {/* Paso 5: Contacto */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            5. Datos de Contacto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico (donde recibirás postulaciones o mensajes) *
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="refugio@ejemplo.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teléfono / WhatsApp (Uruguay: +598)
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="Ej. +598 99 123 456"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Banner de Aviso de Moderación / Publicación Directa */}
        {isAdminOrShelter ? (
          <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-emerald-900">Modo Administrador / Refugio Verificado:</strong>
              <p className="mt-0.5 text-emerald-800">
                Tu publicación se publicará y activará de manera inmediata sin requerir aprobación o moderación previa. Estará visible al instante para toda la comunidad.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Política de Seguridad y Moderación:</strong>
              <p className="mt-0.5 text-amber-800">
                Al hacer clic en &quot;Enviar Mascota a Moderación&quot;, tu ficha se enviará al equipo de moderación. Una vez validada, quedará visible de inmediato para toda la comunidad.
              </p>
            </div>
          </div>
        )}

        {/* Botón de Envío */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 ${
              isAdminOrShelter
                ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-emerald-500/20"
                : "bg-gradient-to-r from-orange-500 via-amber-500 to-rose-400 hover:from-orange-600 hover:to-rose-500 shadow-orange-500/20"
            } disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg text-base transition-all active:scale-95 touch-manipulation cursor-pointer`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isAdminOrShelter ? "Publicando mascota..." : "Procesando publicación..."}
              </>
            ) : (
              <>
                {isAdminOrShelter ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    Publicar Mascota Inmediatamente
                  </>
                ) : (
                  <>
                    <PawPrint className="w-5 h-5 fill-white" />
                    Enviar Mascota a Moderación
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
