"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Home,
  Clock,
  Users,
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

  const [formData, setFormData] = useState({
    housingType: initialProfile?.housingType || HOUSING_OPTIONS[0].value,
    hasYard: initialProfile?.hasYard ?? false,
    freeTimeHours: initialProfile?.freeTimeHours || "Más de 4 horas diarias",
    householdMembers: initialProfile?.householdMembers || "",
    hasBabiesOrKids: initialProfile?.hasBabiesOrKids ?? false,
    otherAnimals: initialProfile?.otherAnimals || "",
    experience: initialProfile?.experience || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = () => {
    if (confirm("¿Deseas reiniciar todos los campos del cuestionario?")) {
      setFormData({
        housingType: HOUSING_OPTIONS[0].value,
        hasYard: false,
        freeTimeHours: "Más de 4 horas diarias",
        householdMembers: "",
        hasBabiesOrKids: false,
        otherAnimals: "",
        experience: "",
      });
      setSuccessMessage("");
      setErrorMessage("");
    }
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
      const res = await fetch("/api/user/adoption-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Perfil de Adoptante Responsable
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">Mi Formulario de Adopción</h1>
        <p className="text-orange-50 text-xs sm:text-sm mt-1 max-w-xl">
          Completa o actualiza tus datos de vivienda y estilo de vida cuando quieras. Se precargarán en cada solicitud para que adoptar en <strong>Refugio Patitas</strong> sea rápido y seguro.
        </p>
      </div>

      {!isLoggedIn && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-900">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            Inicia sesión para que tus respuestas queden guardadas en tu cuenta permanentemente.
          </span>
          <button
            onClick={() => router.push("/login?callbackUrl=/mi-formulario")}
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shrink-0"
          >
            Iniciar Sesión
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm space-y-6">
        {/* Sección 1: Vivienda */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Home className="w-4 h-4 text-orange-500" />
            1. Vivienda y Espacio
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tipo de Vivienda *
              </label>
              <select
                value={formData.housingType}
                onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-orange-500 text-sm"
              >
                {HOUSING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-orange-100 bg-orange-50/30 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasYard}
                onChange={(e) => setFormData({ ...formData, hasYard: e.target.checked })}
                className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
              />
              <span className="font-medium text-slate-800">
                ¿La vivienda cuenta con patio o jardín cerrado con cerco seguro?
              </span>
            </label>
          </div>
        </div>

        {/* Sección 2: Integrantes y Familia */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-500" />
            2. Integrantes del Hogar
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ¿Quiénes viven en la casa? *
              </label>
              <input
                type="text"
                required
                value={formData.householdMembers}
                onChange={(e) => setFormData({ ...formData, householdMembers: e.target.value })}
                placeholder="Ej. Vivo sola / Pareja y 1 hijo de 7 años"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-rose-100 bg-rose-50/30 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasBabiesOrKids}
                onChange={(e) => setFormData({ ...formData, hasBabiesOrKids: e.target.checked })}
                className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500"
              />
              <span className="font-medium text-slate-800">
                ¿Viven bebés o niños pequeños en el hogar?
              </span>
            </label>
          </div>
        </div>

        {/* Sección 3: Rutina y Otras Mascotas */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            3. Rutina y Otras Mascotas
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tiempo libre disponible al día para paseos y atención *
              </label>
              <select
                value={formData.freeTimeHours}
                onChange={(e) => setFormData({ ...formData, freeTimeHours: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="Trabajo remoto / Siempre alguien en casa">Trabajo remoto / Siempre alguien en casa</option>
                <option value="Más de 4 horas diarias">Más de 4 horas diarias</option>
                <option value="2 a 4 horas diarias">2 a 4 horas diarias</option>
                <option value="Menos de 2 horas diarias">Menos de 2 horas diarias</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ¿Tienes otras mascotas actualmente? (Especie, edad, castrados)
              </label>
              <input
                type="text"
                value={formData.otherAnimals}
                onChange={(e) => setFormData({ ...formData, otherAnimals: e.target.value })}
                placeholder="Ej. 1 gata de 3 años castrada / Ninguno"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Experiencia previa con animales
              </label>
              <textarea
                rows={3}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Cuéntanos si has tenido perros o gatos antes..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Rehacer Cuestionario desde Cero
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-md shadow-orange-500/25 text-sm transition-all active:scale-98"
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
