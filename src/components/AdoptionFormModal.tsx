"use client";

import React, { useState, useEffect } from "react";
import HouseholdCounters, { HouseholdData } from "@/components/HouseholdCounters";
import {
  X,
  Heart,
  CheckCircle2,
  Loader2,
  Home,
  Clock,
  Calendar,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import { HOUSING_OPTIONS } from "@/lib/constants";

interface AdoptionFormModalProps {
  pet: {
    id: string;
    title: string;
    contactEmail: string;
    shelterLocation?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function AdoptionFormModal({
  pet,
  isOpen,
  onClose,
}: AdoptionFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadedSavedProfile, setLoadedSavedProfile] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [housingType, setHousingType] = useState(HOUSING_OPTIONS[0].value);
  const [hasYard, setHasYard] = useState(true);
  const [freeTimeHours, setFreeTimeHours] = useState("Más de 4 horas diarias");
  const [experience, setExperience] = useState("");
  const [notes, setNotes] = useState("");

  // Turno de Visita
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("Tarde (15:00 a 18:00)");
  const [isPreVisit, setIsPreVisit] = useState(true);

  // Integrantes y Mascotas con Contadores
  const [household, setHousehold] = useState<HouseholdData>({
    womenCount: 1,
    menCount: 0,
    teensCount: 0,
    kidsCount: 0,
    babiesCount: 0,
    dogsCount: 0,
    catsCount: 0,
    otherAnimals: "Ninguno",
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    if (!isOpen) return;

    async function loadProfile() {
      try {
        const res = await fetch("/api/user/adoption-profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setHousingType(data.profile.housingType || HOUSING_OPTIONS[0].value);
            setHasYard(data.profile.hasYard ?? true);
            setFreeTimeHours(data.profile.freeTimeHours || "Más de 4 horas diarias");
            setExperience(data.profile.experience || "");
            setHousehold({
              womenCount: data.profile.womenCount ?? 1,
              menCount: data.profile.menCount ?? 0,
              teensCount: data.profile.teensCount ?? 0,
              kidsCount: data.profile.kidsCount ?? 0,
              babiesCount: data.profile.babiesCount ?? 0,
              dogsCount: data.profile.dogsCount ?? 0,
              catsCount: data.profile.catsCount ?? 0,
              otherAnimals: data.profile.otherAnimals || "Ninguno",
            });
            setLoadedSavedProfile(true);
          }
        }
      } catch (err) {
        console.warn("No se pudo precargar el perfil:", err);
      }
    }

    loadProfile();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        fullName,
        email,
        phone,
        housingType,
        hasYard,
        freeTimeHours,
        experience,
        notes,
        preferredDate,
        preferredTimeSlot,
        isPreVisit,
        shelterLocation: pet.shelterLocation || "Refugio Patitas - Sede Montevideo",
        ...household,
      };

      const res = await fetch(`/api/pets/${pet.id}/adopt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo enviar la postulación");

      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMessage(err.message);
      else setErrorMessage("Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shelterName = pet.shelterLocation || "Refugio Patitas - Sede Montevideo";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-orange-100 dark:border-stone-800 overflow-hidden my-8">
        
        {/* Header Pastel */}
        <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-rose-200 dark:from-stone-800 dark:to-stone-850 px-6 py-5 text-slate-800 dark:text-stone-100 flex items-center justify-between border-b border-orange-100 dark:border-stone-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/70 dark:bg-stone-700 rounded-2xl shadow-xs">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Solicitud de Adopción & Visita Previa
              </h2>
              <p className="text-slate-600 dark:text-stone-300 text-xs">Mascota: {pet.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-slate-700 dark:text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">¡Visita Agendada y Solicitud Enviada!</h3>
            <p className="text-slate-600 dark:text-stone-300 text-xs sm:text-sm max-w-md mx-auto">
              Hemos enviado tu postulación con el turno seleccionado a <strong>{pet.contactEmail}</strong> ({shelterName}).
              Nos comunicaremos contigo a tu teléfono o WhatsApp uruguayo (<strong>{phone}</strong>) para coordinar la bienvenida.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Cerrar y volver
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            {/* Banner de Sede e Información */}
            <div className="bg-amber-50/70 dark:bg-stone-850 border border-amber-200/80 dark:border-stone-700 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Ubicación física en Uruguay:</span>
                <span>{shelterName}. Podrás conocer e interactuar con la mascota en el día elegido.</span>
              </div>
            </div>

            {loadedSavedProfile && (
              <div className="bg-orange-50 dark:bg-stone-850 border border-orange-200 dark:border-stone-700 p-3 rounded-2xl flex items-center gap-2 text-xs text-orange-900 dark:text-orange-200">
                <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                <span>¡Tus datos guardados de adoptante se han precargado automáticamente!</span>
              </div>
            )}

            {/* SECCIÓN 1: Calendario de Turnos y Visita Previa */}
            <div className="space-y-3 bg-orange-50/30 dark:bg-stone-850 p-4 rounded-2xl border border-orange-100 dark:border-stone-700">
              <h4 className="text-xs font-bold text-slate-800 dark:text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-500" />
                1. Días y Horarios para Visita Previa
              </h4>

              {/* Botones de Selección Visita Previa */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsPreVisit(true)}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    isPreVisit
                      ? "border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 shadow-xs"
                      : "border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-slate-600 dark:text-stone-300"
                  }`}
                >
                  ⭐ Solicitar Visita Previa
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreVisit(false)}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    !isPreVisit
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 shadow-xs"
                      : "border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-slate-600 dark:text-stone-300"
                  }`}
                >
                  🐾 Adopción Directa
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">
                    Día preferido *
                  </label>
                  <input
                    type="date"
                    required
                    min={minDateStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">
                    Turno disponible *
                  </label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="Mañana (10:00 a 13:00)">Mañana (10:00 a 13:00 hs)</option>
                    <option value="Tarde (15:00 a 18:00)">Tarde (15:00 a 18:00 hs)</option>
                    <option value="Sábado especial (11:00 a 16:00)">Sábado especial (11:00 a 16:00 hs)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Información Personal de Contacto (Uruguay) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> 2. Datos de Contacto (Uruguay)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Sofía Castillo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">Celular / WhatsApp (Uruguay) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+598 99 123 456"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: Vivienda */}
            <div className="space-y-3 pt-2 border-t border-orange-100 dark:border-stone-800 text-xs">
              <h4 className="text-xs font-bold text-slate-400 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" /> 3. Vivienda y Patio
              </h4>

              <div className="space-y-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">Tipo de Vivienda *</label>
                  <select
                    value={housingType}
                    onChange={(e) => setHousingType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-orange-400"
                  >
                    {HOUSING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setHasYard(true)}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      hasYard
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200"
                        : "border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-slate-600 dark:text-stone-300"
                    }`}
                  >
                    🌿 Con patio cerrado
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasYard(false)}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      !hasYard
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200"
                        : "border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-slate-600 dark:text-stone-300"
                    }`}
                  >
                    🏢 Sin patio cerrado
                  </button>
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: Integrantes y Mascotas con Contadores (+/-) */}
            <div className="pt-2 border-t border-orange-100 dark:border-stone-800">
              <HouseholdCounters data={household} onChange={setHousehold} />
            </div>

            {/* SECCIÓN 5: Rutina y Mensaje */}
            <div className="space-y-3 pt-2 border-t border-orange-100 dark:border-stone-800 text-xs">
              <h4 className="text-xs font-bold text-slate-400 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 5. Rutina y Mensaje
              </h4>

              <div className="space-y-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">Tiempo libre diario *</label>
                  <select
                    value={freeTimeHours}
                    onChange={(e) => setFreeTimeHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="Trabajo remoto / Siempre alguien en casa">Trabajo remoto / Siempre alguien en casa</option>
                    <option value="Más de 4 horas diarias">Más de 4 horas diarias</option>
                    <option value="2 a 4 horas diarias">2 a 4 horas diarias</option>
                    <option value="Menos de 2 horas diarias">Menos de 2 horas diarias</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">Mensaje para el refugio</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Cuéntanos por qué deseas adoptar a esta mascota..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
            </div>

            {/* Botones de Envío */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-orange-100 dark:border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-stone-400 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 disabled:opacity-50 text-white text-xs font-extrabold rounded-2xl shadow-xs transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando solicitud...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    Enviar Solicitud y Agendar Visita
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
