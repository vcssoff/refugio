"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ImageUploaderWebP, { UploadedPetImage } from "@/components/ImageUploaderWebP";
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
  ArrowLeft,
  Save,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const TYPE_OPTIONS = (Object.keys(TYPE_LABELS) as PetType[]).map((value) => ({
  value,
  label: TYPE_LABELS[value].label,
}));

const SPECIES_OPTIONS = (Object.keys(SPECIES_LABELS) as Species[]).map((value) => ({
  value,
  label: SPECIES_LABELS[value],
}));

const GENDER_OPTIONS = (Object.keys(GENDER_LABELS) as Gender[]).map((value) => ({
  value,
  label: GENDER_LABELS[value],
}));

const AGE_OPTIONS = (Object.keys(AGE_LABELS) as AgeGroup[]).map((value) => ({
  value,
  label: AGE_LABELS[value],
}));

const SIZE_OPTIONS = (Object.keys(SIZE_LABELS) as PetSize[]).map((value) => ({
  value,
  label: SIZE_LABELS[value],
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditPetClient({ pet }: { pet: any }) {
  const router = useRouter();
  const { data: session } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isVerifiedShelter = Boolean((session?.user as any)?.isVerifiedShelter);
  const sessionEmail = session?.user?.email?.toLowerCase()?.trim();
  const isAuthorized =
    userRole === "ADMIN" ||
    userRole === "REFUGIO" ||
    isVerifiedShelter ||
    sessionEmail === "sofiaacedress@gmail.com" ||
    session?.user?.id === pet.userId;

  const [formData, setFormData] = useState({
    title: pet.title || "",
    name: pet.name || "",
    type: pet.type || "ADOPCION",
    status: pet.status || "PUBLICADO",
    species: pet.species || "PERRO",
    gender: pet.gender || "MACHO",
    ageGroup: pet.ageGroup || "JOVEN",
    size: pet.size || "MEDIANO",
    color: pet.color || "",
    vaccinated: Boolean(pet.vaccinated),
    dewormed: Boolean(pet.dewormed),
    neutered: Boolean(pet.neutered),
    specialNeeds: pet.specialNeeds || "",
    isUrgent: Boolean(pet.isUrgent),
    healthCondition: pet.healthCondition || "",
    goodWithDogs: Boolean(pet.goodWithDogs),
    goodWithCats: Boolean(pet.goodWithCats),
    goodWithKids: Boolean(pet.goodWithKids),
    description: pet.description || "",
    contactEmail: pet.contactEmail || "",
    contactPhone: pet.contactPhone || "",
    shelterLocation: pet.shelterLocation || "Refugio Patitas - Sede Montevideo",
    city: pet.city || "Montevideo",
  });

  const [images, setImages] = useState<UploadedPetImage[]>(() =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pet.images || []).map((img: any) => ({
      thumb: img.urlThumb,
      card: img.urlCard,
      detail: img.urlDetail,
      original: img.urlOriginal,
    }))
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/pets/${pet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar la mascota");
      }

      setSuccessMsg("¡Ficha actualizada exitosamente!");
      setTimeout(() => {
        router.push(`/mascota/${pet.id}`);
        router.refresh();
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Error desconocido al guardar");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `¿Estás segura de que deseas eliminar permanentemente a "${formData.name || formData.title}"? Esta acción no se puede deshacer.`
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/pets/${pet.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al eliminar la mascota");
      }

      alert("Ficha eliminada con éxito.");
      router.push("/adopciones");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Error al eliminar");
      }
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Botón Volver y Cabecera */}
      <div className="flex items-center justify-between">
        <Link
          href={`/mascota/${pet.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#63554b] hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la ficha</span>
        </Link>

        {isAuthorized && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            Modo Administrador
          </span>
        )}
      </div>

      <div className="bg-gradient-to-r from-[#faeee1] via-[#f7ebd9] to-[#fceee7] rounded-3xl p-6 sm:p-8 text-[#2d2420] shadow-sm border border-[#e8dfd3]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-xs font-bold uppercase tracking-wider mb-2 text-orange-900 border border-[#e2d6c6]">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          Edición de Ficha
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2d2420]">
          Editar a {formData.name || formData.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#5a4c41] mt-1">
          Modifica los datos, cambia las fotos o ajusta el encuadre para que la cara quede perfecta.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg} Redirigiendo a la ficha...</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Gestión de Fotografías y Encuadre */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ded1] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee7dd] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#2d2420] uppercase tracking-wider">
                1. Fotografías y Encuadre de Caras
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Toca en <strong className="text-orange-600">"Encuadrar Cara"</strong> en cada foto para moverla, acercarla y evitar caras cortadas.
              </p>
            </div>
            <span className="text-xs text-orange-800 font-bold bg-orange-100/70 border border-orange-200 px-3 py-1 rounded-xl w-fit">
              {images.length} fotos guardadas
            </span>
          </div>

          <ImageUploaderWebP
            initialImages={images}
            onImagesUploaded={(uploaded) => setImages(uploaded)}
            maxImages={6}
          />
        </div>

        {/* 2. Datos Generales */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ded1] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#2d2420] uppercase tracking-wider border-b border-[#eee7dd] pb-3">
            2. Información General
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Título de la publicación *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Nombre de la mascota
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Tipo de Ficha
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Especie
              </label>
              <select
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              >
                {SPECIES_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Género
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Edad
              </label>
              <select
                value={formData.ageGroup}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              >
                {AGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Tamaño
              </label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              >
                {SIZE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3. Salud, Urgencia y Convivencia */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ded1] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#2d2420] uppercase tracking-wider border-b border-[#eee7dd] pb-3">
            3. Salud y Convivencia
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 p-3 rounded-xl border border-[#e8dfd3] bg-[#fbf8f3] cursor-pointer text-xs font-bold text-[#2d2420]">
              <input
                type="checkbox"
                checked={formData.vaccinated}
                onChange={(e) => setFormData({ ...formData, vaccinated: e.target.checked })}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span>Vacunado/a</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-[#e8dfd3] bg-[#fbf8f3] cursor-pointer text-xs font-bold text-[#2d2420]">
              <input
                type="checkbox"
                checked={formData.neutered}
                onChange={(e) => setFormData({ ...formData, neutered: e.target.checked })}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span>Castrado/a</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-[#e8dfd3] bg-[#fbf8f3] cursor-pointer text-xs font-bold text-[#2d2420]">
              <input
                type="checkbox"
                checked={formData.dewormed}
                onChange={(e) => setFormData({ ...formData, dewormed: e.target.checked })}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span>Desparasitado/a</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-rose-200 bg-rose-50/60 cursor-pointer text-xs font-bold text-rose-950">
              <input
                type="checkbox"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="w-4 h-4 accent-rose-500 rounded"
              />
              <span>🚨 Urgente</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <label className="flex items-center gap-2 p-3 rounded-xl border border-[#e8dfd3] bg-[#fbf8f3] cursor-pointer text-xs font-bold text-[#2d2420]">
              <input
                type="checkbox"
                checked={formData.goodWithDogs}
                onChange={(e) => setFormData({ ...formData, goodWithDogs: e.target.checked })}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span>🐶 Bien con perros</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-[#e8dfd3] bg-[#fbf8f3] cursor-pointer text-xs font-bold text-[#2d2420]">
              <input
                type="checkbox"
                checked={formData.goodWithCats}
                onChange={(e) => setFormData({ ...formData, goodWithCats: e.target.checked })}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span>🐱 Bien con gatos</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-[#e8dfd3] bg-[#fbf8f3] cursor-pointer text-xs font-bold text-[#2d2420]">
              <input
                type="checkbox"
                checked={formData.goodWithKids}
                onChange={(e) => setFormData({ ...formData, goodWithKids: e.target.checked })}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span>🧒 Bien con niños</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Condición de salud o medicación (opcional)
              </label>
              <input
                type="text"
                value={formData.healthCondition}
                onChange={(e) => setFormData({ ...formData, healthCondition: e.target.value })}
                placeholder="Ej. Ceguera parcial / Toma pastilla diaria"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Cuidados o necesidades especiales
              </label>
              <input
                type="text"
                value={formData.specialNeeds}
                onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                placeholder="Ej. Requiere patio cerrado / Dieta especial"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              />
            </div>
          </div>
        </div>

        {/* 4. Descripción y Contacto */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ded1] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#2d2420] uppercase tracking-wider border-b border-[#eee7dd] pb-3">
            4. Historia y Datos de Contacto
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#3e342f] mb-1">
              Descripción de la mascota *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Sede o Refugio
              </label>
              <input
                type="text"
                value={formData.shelterLocation}
                onChange={(e) => setFormData({ ...formData, shelterLocation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Ciudad / Departamento
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Email de contacto *
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e342f] mb-1">
                Teléfono de contacto / WhatsApp
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="Ej. +598 99 123 456"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Barra de Acciones Finales */}
        <div className="p-4 bg-white rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            disabled={isDeleting || isSaving}
            onClick={handleDelete}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 text-rose-600" />
                Eliminar Ficha Permanentemente
              </>
            )}
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              href={`/mascota/${pet.id}`}
              className="w-1/2 sm:w-auto px-5 py-3 rounded-xl border border-[#ded5c7] text-[#4a3f35] font-bold text-xs text-center hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={isSaving || isDeleting}
              className="w-1/2 sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-400 hover:from-orange-600 hover:to-rose-500 text-white font-black rounded-xl shadow-xs text-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando Cambios...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
