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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#fdfcf9] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#ede5da] overflow-hidden my-0 sm:my-8 flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        
        {/* Header Pastel Beige Cálido */}
        <div className="bg-gradient-to-r from-[#faeee1] via-[#f7ebd9] to-[#fceee7] px-6 py-4.5 text-[#2d2420] flex items-center justify-between border-b border-[#e8ded1] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/80 rounded-2xl shadow-xs border border-[#e2d6c6]">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#2d2420]">
                Solicitud de Adopción & Visita Previa
              </h2>
              <p className="text-[#5a4c41] text-xs truncate max-w-[240px] sm:max-w-md">Mascota: {pet.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-black/5 active:scale-95 text-[#4a3f35] flex items-center justify-center transition-all touch-manipulation cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-[#2d2420]">¡Visita Agendada y Solicitud Enviada!</h3>
            <p className="text-[#5a4c41] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Hemos enviado tu postulación con el turno seleccionado a <strong>{pet.contactEmail}</strong> ({shelterName}).
              Nos comunicaremos contigo a tu teléfono o WhatsApp uruguayo (<strong>{phone}</strong>) para coordinar la bienvenida.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[46px] px-8 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-2xl text-xs transition-all touch-manipulation cursor-pointer shadow-xs"
              >
                Cerrar y volver a la mascota
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Banner de Sede e Información */}
              <div className="bg-[#fcf7ed] border border-[#e8dfcf] p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-[#523e2e]">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[#2d2420]">Sede de encuentro en Uruguay:</span>
                  <span>{shelterName}. Podrás conocer e interactuar con la mascota en el día y horario que elijas.</span>
                </div>
              </div>

              {loadedSavedProfile && (
                <div className="bg-[#fff9ef] border border-[#e8d8be] p-3 rounded-2xl flex items-center gap-2 text-xs text-[#523e2e]">
                  <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>¡Tus datos guardados de adoptante se han precargado automáticamente!</span>
                </div>
              )}

              {/* SECCIÓN 1: Calendario de Turnos y Visita Previa */}
              <div className="space-y-3 bg-[#fbf8f3] p-4 rounded-2xl border border-[#ebe2d5]">
                <h4 className="text-xs font-bold text-[#634832] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>1. Visita Previa y Turno en el Refugio</span>
                </h4>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-orange-200 bg-white cursor-pointer active:scale-98 transition-all touch-manipulation">
                  <input
                    type="checkbox"
                    checked={isPreVisit}
                    onChange={(e) => setIsPreVisit(e.target.checked)}
                    className="w-5 h-5 text-orange-500 rounded border-stone-300 focus:ring-orange-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#2d2420] block">Deseo realizar una visita previa para conocerlo</span>
                    <span className="text-[11px] text-stone-500">Recomendado para asegurar que haya conexión y compatibilidad mutua.</span>
                  </div>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="block font-semibold text-[#3e342f] mb-1">
                      Día preferido *
                    </label>
                    <input
                      type="date"
                      required
                      min={minDateStr}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 font-medium text-[#2d2420]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3e342f] mb-1">
                      Turno disponible *
                    </label>
                    <select
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 font-medium text-[#2d2420]"
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
                <h4 className="text-xs font-bold text-[#634832] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-600" /> 2. Datos de Contacto (Uruguay)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#3e342f] mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Sofía Rodríguez"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 text-[#2d2420]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3e342f] mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 text-[#2d2420]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#3e342f] mb-1">Celular / WhatsApp uruguayo (+598) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+598 99 123 456"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 text-[#2d2420]"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: Vivienda */}
              <div className="space-y-3 pt-2 border-t border-[#eee6db] text-xs">
                <h4 className="text-xs font-bold text-[#634832] uppercase tracking-wider flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-orange-600" /> 3. Vivienda y Espacio
                </h4>

                <div className="space-y-2.5">
                  <div>
                    <label className="block font-semibold text-[#3e342f] mb-1">Tipo de Vivienda *</label>
                    <select
                      value={housingType}
                      onChange={(e) => setHousingType(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 text-[#2d2420]"
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
                      className={`min-h-[46px] p-2.5 rounded-xl border text-center font-bold text-xs transition-all touch-manipulation cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${
                        hasYard
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs"
                          : "border-[#ded5c7] bg-white text-[#4a3f35] hover:bg-[#f6eee4]"
                      }`}
                    >
                      <span>🌿 Con patio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasYard(false)}
                      className={`min-h-[46px] p-2.5 rounded-xl border text-center font-bold text-xs transition-all touch-manipulation cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${
                        !hasYard
                          ? "border-amber-500 bg-amber-50 text-amber-900 shadow-xs"
                          : "border-[#ded5c7] bg-white text-[#4a3f35] hover:bg-[#f6eee4]"
                      }`}
                    >
                      <span>🏢 Sin patio</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 4: Integrantes y Mascotas con Contadores (+/-) */}
              <div className="pt-2 border-t border-[#eee6db]">
                <HouseholdCounters data={household} onChange={setHousehold} />
              </div>

              {/* SECCIÓN 5: Rutina y Mensaje */}
              <div className="space-y-3 pt-2 border-t border-[#eee6db] text-xs">
                <h4 className="text-xs font-bold text-[#634832] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> 5. Rutina y Mensaje
                </h4>

                <div className="space-y-2">
                  <div>
                    <label className="block font-semibold text-[#3e342f] mb-1">Tiempo libre diario *</label>
                    <select
                      value={freeTimeHours}
                      onChange={(e) => setFreeTimeHours(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 text-[#2d2420]"
                    >
                      <option value="Trabajo remoto / Siempre alguien en casa">Trabajo remoto / Siempre alguien en casa</option>
                      <option value="Más de 4 horas diarias">Más de 4 horas diarias</option>
                      <option value="2 a 4 horas diarias">2 a 4 horas diarias</option>
                      <option value="Menos de 2 horas diarias">Menos de 2 horas diarias</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3e342f] mb-1">Mensaje para el refugio (opcional)</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Cuéntanos por qué deseas adoptar a esta mascota..."
                      className="w-full px-3 py-2 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 text-[#2d2420]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de Envío Sticky / Accesibles en Celular */}
            <div className="p-4 bg-[#f8f5ee] border-t border-[#e8dfd3] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 active:scale-95 touch-manipulation cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-400 hover:from-orange-600 hover:to-rose-500 disabled:opacity-50 text-white text-xs font-black rounded-2xl shadow-sm transition-all active:scale-95 touch-manipulation cursor-pointer"
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
