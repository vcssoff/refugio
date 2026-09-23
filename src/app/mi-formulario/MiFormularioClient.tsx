"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HouseholdCounters, { HouseholdData } from "@/components/HouseholdCounters";
import {
  Home,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  Sparkles,
  Heart,
} from "lucide-react";
import { HOUSING_OPTIONS } from "@/lib/constants";

interface MiFormularioClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialProfile: any | null;
  isLoggedIn: boolean;
}

export default function MiFormularioClient({
  initialProfile,
  isLoggedIn,
}: MiFormularioClientProps) {
  const router = useRouter();

  const [housingType, setHousingType] = useState(
    initialProfile?.housingType || HOUSING_OPTIONS[0].value
  );
  const [hasYard, setHasYard] = useState<boolean>(initialProfile?.hasYard ?? true);
  const [freeTimeHours, setFreeTimeHours] = useState(
    initialProfile?.freeTimeHours || "Más de 4 horas diarias"
  );
  const [experience, setExperience] = useState(initialProfile?.experience || "");

  const [household, setHousehold] = useState<HouseholdData>({
    womenCount: initialProfile?.womenCount ?? 1,
    menCount: initialProfile?.menCount ?? 0,
    teensCount: initialProfile?.teensCount ?? 0,
    kidsCount: initialProfile?.kidsCount ?? 0,
    babiesCount: initialProfile?.babiesCount ?? 0,
    dogsCount: initialProfile?.dogsCount ?? 0,
    catsCount: initialProfile?.catsCount ?? 0,
    otherAnimals: initialProfile?.otherAnimals || "Ninguno",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = () => {
    setHousingType(HOUSING_OPTIONS[0].value);
    setHasYard(true);
    setFreeTimeHours("Más de 4 horas diarias");
    setExperience("");
    setHousehold({
      womenCount: 0,
      menCount: 0,
      teensCount: 0,
      kidsCount: 0,
      babiesCount: 0,
      dogsCount: 0,
      catsCount: 0,
      otherAnimals: "Ninguno",
    });
    setSuccessMessage("Cuestionario restablecido a valores iniciales.");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/login?callbackUrl=/mi-formulario");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        housingType,
        hasYard,
        freeTimeHours,
        experience,
        ...household,
      };

      const res = await fetch("/api/user/adoption-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo guardar el formulario");
      }

      setSuccessMessage("¡Formulario de adopción guardado con éxito! Se utilizará automáticamente en tus solicitudes.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Error al guardar el formulario");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Encabezado Pastel Cálido Beige */}
      <div className="bg-gradient-to-r from-[#faeee1] via-[#f7ebd9] to-[#fceee7] rounded-3xl p-6 sm:p-8 text-[#2d2420] shadow-sm border border-[#e8dfd3]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-xs font-bold uppercase tracking-wider mb-2 text-amber-900 border border-[#e2d6c6]">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          Perfil de Adoptante Responsable
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2d2420]">
          Mi Formulario de Adopción
        </h1>
        <p className="text-xs sm:text-sm text-[#5a4c41] mt-1 max-w-xl">
          Selecciona fácilmente las cantidades de personas y mascotas en tu hogar. Puedes rehacerlo y actualizarlo cuando quieras en <strong>Refugio Patitas</strong>.
        </p>
      </div>

      {!isLoggedIn && (
        <div className="bg-[#fef9f1] border border-[#e8dccb] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#534032]">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
            Inicia sesión para que tus respuestas queden guardadas en tu cuenta de forma permanente.
          </span>
          <button
            type="button"
            onClick={() => router.push("/login?callbackUrl=/mi-formulario")}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-xl transition-all shrink-0 touch-manipulation cursor-pointer text-center"
          >
            Iniciar Sesión
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ded1] shadow-xs space-y-6">
        {/* Sección 1: Vivienda */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-[#634832] uppercase tracking-wider flex items-center gap-2">
            <Home className="w-4 h-4 text-orange-600" />
            1. Vivienda y Espacio
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#3e342f] mb-1">
                Tipo de Vivienda *
              </label>
              <select
                value={housingType}
                onChange={(e) => setHousingType(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#ded5c7] bg-white font-medium focus:ring-2 focus:ring-orange-400 text-sm"
              >
                {HOUSING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Selector de patio seguro con botones táctiles grandes */}
            <div className="space-y-1.5 pt-1">
              <label className="block font-semibold text-[#3e342f]">
                ¿La vivienda cuenta con patio o jardín cerrado con cerco seguro?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setHasYard(true)}
                  className={`min-h-[48px] p-3 rounded-2xl border text-center font-bold text-xs transition-all touch-manipulation cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${
                    hasYard
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400/40 shadow-xs"
                      : "border-[#ded4c6] bg-white text-[#4a3f35] hover:bg-[#f8f3ec]"
                  }`}
                >
                  <span className="text-base">🌿</span>
                  <span>Sí, tiene patio cerrado</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHasYard(false)}
                  className={`min-h-[48px] p-3 rounded-2xl border text-center font-bold text-xs transition-all touch-manipulation cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${
                    !hasYard
                      ? "border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-400/40 shadow-xs"
                      : "border-[#ded4c6] bg-white text-[#4a3f35] hover:bg-[#f8f3ec]"
                  }`}
                >
                  <span className="text-base">🏢</span>
                  <span>No cuenta con patio cerrado</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 2 y 3: Integrantes y Mascotas con Contadores (+/-) */}
        <div className="pt-4 border-t border-[#eee6db]">
          <HouseholdCounters data={household} onChange={setHousehold} />
        </div>

        {/* Sección 4: Rutina y Experiencia */}
        <div className="pt-4 border-t border-[#eee6db] space-y-4">
          <h2 className="text-xs font-bold text-[#634832] uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Rutina y Experiencia Previa
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#3e342f] mb-1">
                Tiempo libre disponible al día para paseos y atención *
              </label>
              <select
                value={freeTimeHours}
                onChange={(e) => setFreeTimeHours(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#ded5c7] bg-white font-medium focus:ring-2 focus:ring-orange-400 text-sm"
              >
                <option value="Trabajo remoto / Siempre alguien en casa">Trabajo remoto / Siempre alguien en casa</option>
                <option value="Más de 4 horas diarias">Más de 4 horas diarias</option>
                <option value="2 a 4 horas diarias">2 a 4 horas diarias</option>
                <option value="Menos de 2 horas diarias">Menos de 2 horas diarias</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#3e342f] mb-1">
                Experiencia previa con animales
              </label>
              <textarea
                rows={2}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Cuéntanos si has tenido perros o gatos antes..."
                className="w-full p-3 rounded-xl border border-[#ded5c7] text-sm focus:ring-2 focus:ring-orange-400 bg-white text-[#2d2420]"
              />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-4 border-t border-[#eee6db] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#6b5849] hover:text-[#2d2420] transition-colors cursor-pointer touch-manipulation active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
            Reiniciar Cuestionario
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-400 hover:from-orange-600 hover:to-rose-500 text-white font-black rounded-2xl shadow-sm text-sm transition-all active:scale-95 touch-manipulation cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white" />
                Guardar y Actualizar Formulario
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
