"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  CheckCircle2,
  Loader2,
  Home,
  Clock,
  Users,
  Calendar,
  MapPin,
  Sparkles,
  Phone,
  Mail,
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
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    housingType: HOUSING_OPTIONS[0].value,
    hasYard: false,
    freeTimeHours: "Más de 4 horas diarias",
    householdMembers: "",
    hasBabiesOrKids: false,
    otherAnimals: "",
    experience: "",
    notes: "",
    // Nuevos campos: Calendario, Turnos y Visita Previa
    preferredDate: "",
    preferredTimeSlot: "Tarde (15:00 a 18:00)",
    isPreVisit: true, // true por defecto para fomentar la visita previa
  });

  // Fecha mínima para el calendario (a partir de mañana)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  // Cargar perfil guardado del usuario si existe
  useEffect(() => {
    if (!isOpen) return;

    async function loadProfile() {
      try {
        const res = await fetch("/api/user/adoption-profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setFormData((prev) => ({
              ...prev,
              housingType: data.profile.housingType || prev.housingType,
              hasYard: data.profile.hasYard ?? prev.hasYard,
              freeTimeHours: data.profile.freeTimeHours || prev.freeTimeHours,
              householdMembers: data.profile.householdMembers || prev.householdMembers,
              hasBabiesOrKids: data.profile.hasBabiesOrKids ?? prev.hasBabiesOrKids,
              otherAnimals: data.profile.otherAnimals || prev.otherAnimals,
              experience: data.profile.experience || prev.experience,
            }));
            setLoadedSavedProfile(true);
          }
        }
      } catch (err) {
        console.warn("No se pudo cargar el perfil guardado:", err);
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
      const res = await fetch(`/api/pets/${pet.id}/adopt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          shelterLocation: pet.shelterLocation || "Refugio Patitas - Sede Central",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar la solicitud");
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Ocurrió un error inesperado al procesar la solicitud");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const shelterName = pet.shelterLocation || "Refugio Patitas - Sede Central";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden my-8">
        
        {/* Header Cálido */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Solicitud de Adopción & Visita</h2>
              <p className="text-orange-100 text-xs">Mascota: {pet.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">¡Turno y Solicitud Registrada!</h3>
            <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
              Hemos enviado tu postulación con el turno seleccionado a <strong>{pet.contactEmail}</strong> ({shelterName}).
              El equipo de <strong>Refugio Patitas</strong> revisará tu información y te contactará por WhatsApp o correo para confirmar la visita.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Cerrar y volver
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            {/* Banner de Sede e Información */}
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
              <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold">Ubicación de la Mascota:</span>
                <span>{shelterName}. Puedes coordinar un turno para conocerlo previamente.</span>
              </div>
            </div>

            {loadedSavedProfile && (
              <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl flex items-center gap-2 text-xs text-orange-900">
                <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
                <span>¡Genial! Hemos precargado tus datos guardados desde tu perfil de adoptante.</span>
              </div>
            )}

            {/* SECCIÓN 1: Calendario de Turnos y Visita Previa */}
            <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-500" />
                1. Días y Horarios Disponibles para Visita
              </h4>

              {/* Checkbox Visita Previa */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-orange-200 bg-orange-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPreVisit}
                  onChange={(e) => setFormData({ ...formData, isPreVisit: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500 mt-0.5"
                />
                <div className="text-xs">
                  <strong className="text-orange-950 font-bold block">
                    Quiero coordinar una Visita Previa
                  </strong>
                  <span className="text-orange-800">
                    Visita al refugio para conocer e interactuar personalmente con la mascota antes de formalizar la adopción.
                  </span>
                </div>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Día preferido de visita *
                  </label>
                  <input
                    type="date"
                    required
                    min={minDateStr}
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Horario / Turno disponible *
                  </label>
                  <select
                    value={formData.preferredTimeSlot}
                    onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Mañana (10:00 a 13:00)">Turno Mañana (10:00 a 13:00 hs)</option>
                    <option value="Tarde (15:00 a 18:00)">Turno Tarde (15:00 a 18:00 hs)</option>
                    <option value="Sábado especial (11:00 a 16:00)">Sábado especial (11:00 a 16:00 hs)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Información Personal de Contacto */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> 2. Tus Datos Personales de Contacto
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej. Sofía Castillo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Número de Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+54 9 11 1234-5678"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: Entorno y Vivienda */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" /> 3. Tu Hogar y Familia
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Vivienda *</label>
                  <select
                    value={formData.housingType}
                    onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500"
                  >
                    {HOUSING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasYard}
                    onChange={(e) => setFormData({ ...formData, hasYard: e.target.checked })}
                    className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                  />
                  <span className="font-medium text-slate-700">
                    ¿La vivienda cuenta con patio o jardín cerrado con cerco seguro?
                  </span>
                </label>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Integrantes de la casa *</label>
                  <input
                    type="text"
                    required
                    value={formData.householdMembers}
                    onChange={(e) => setFormData({ ...formData, householdMembers: e.target.value })}
                    placeholder="Ej. Vivo sola / 2 adultos y 1 hijo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasBabiesOrKids}
                    onChange={(e) => setFormData({ ...formData, hasBabiesOrKids: e.target.checked })}
                    className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500"
                  />
                  <span className="font-medium text-slate-700">
                    ¿Hay niños pequeños o bebés en el hogar?
                  </span>
                </label>
              </div>
            </div>

            {/* SECCIÓN 4: Rutina y Mensaje */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 4. Rutina y Otras Mascotas
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tiempo libre diario *</label>
                  <select
                    value={formData.freeTimeHours}
                    onChange={(e) => setFormData({ ...formData, freeTimeHours: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Trabajo remoto / Siempre alguien en casa">Trabajo remoto / Siempre alguien en casa</option>
                    <option value="Más de 4 horas diarias">Más de 4 horas diarias</option>
                    <option value="2 a 4 horas diarias">2 a 4 horas diarias</option>
                    <option value="Menos de 2 horas diarias">Menos de 2 horas diarias</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">¿Tienes otras mascotas?</label>
                  <input
                    type="text"
                    value={formData.otherAnimals}
                    onChange={(e) => setFormData({ ...formData, otherAnimals: e.target.value })}
                    placeholder="Ej. 1 perra mestiza de 4 años castrada / Ninguno"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mensaje para el refugio</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Cuéntanos por qué deseas adoptar a esta mascota..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Botones de Envío */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all"
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
