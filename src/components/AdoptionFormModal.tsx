"use client";

import React, { useState } from "react";
import { X, Heart, CheckCircle2, Loader2, Home, Clock, Users, ShieldCheck } from "lucide-react";
import { HOUSING_OPTIONS } from "@/lib/constants";

interface AdoptionFormModalProps {
  pet: {
    id: string;
    title: string;
    contactEmail: string;
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
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/pets/${pet.id}/adopt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
        setErrorMessage("Ocurrió un error inesperado");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Postulación de Adopción Responsable</h2>
              <p className="text-teal-100 text-xs">Para: {pet.title}</p>
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
            <h3 className="text-2xl font-bold text-slate-800">¡Postulación Enviada con Éxito!</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Hemos enviado tu cuestionario de adopción al correo del refugio o rescatista (<strong>{pet.contactEmail}</strong>).
              Se pondrán en contacto contigo pronto por WhatsApp o correo electrónico.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Cerrar y volver
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {errorMessage}
              </div>
            )}

            <div className="bg-teal-50/60 border border-teal-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-teal-900">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                Este cuestionario nos permite asegurar que el estilo de vida del postulante sea compatible con la mascota y evitar segundas devoluciones.
              </span>
            </div>

            {/* Datos Personales */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> 1. Tus Datos de Contacto
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej. Sofía Castillo"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+54 9 11 1234-5678"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Hogar y Familia */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" /> 2. Tu Hogar y Entorno
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Vivienda *</label>
                  <select
                    value={formData.housingType}
                    onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {HOUSING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasYard"
                    checked={formData.hasYard}
                    onChange={(e) => setFormData({ ...formData, hasYard: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <label htmlFor="hasYard" className="text-xs font-medium text-slate-700 cursor-pointer">
                    ¿La vivienda cuenta con patio o jardín con cerco seguro?
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Integrantes de la casa *</label>
                  <input
                    type="text"
                    required
                    value={formData.householdMembers}
                    onChange={(e) => setFormData({ ...formData, householdMembers: e.target.value })}
                    placeholder="Ej. Vivo sola / 2 adultos y 1 adolescente"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasBabiesOrKids"
                    checked={formData.hasBabiesOrKids}
                    onChange={(e) => setFormData({ ...formData, hasBabiesOrKids: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <label htmlFor="hasBabiesOrKids" className="text-xs font-medium text-slate-700 cursor-pointer">
                    ¿Viven bebés o niños pequeños en el hogar?
                  </label>
                </div>
              </div>
            </div>

            {/* Rutina y Otras Mascotas */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 3. Rutina y Otras Mascotas
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tiempo libre disponible al día *</label>
                  <select
                    value={formData.freeTimeHours}
                    onChange={(e) => setFormData({ ...formData, freeTimeHours: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Trabajo remoto / Siempre alguien en casa">Trabajo remoto / Siempre alguien en casa</option>
                    <option value="Más de 4 horas diarias">Más de 4 horas diarias</option>
                    <option value="2 a 4 horas diarias">2 a 4 horas diarias</option>
                    <option value="Menos de 2 horas diarias">Menos de 2 horas diarias</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">¿Tienes otras mascotas actualmente?</label>
                  <input
                    type="text"
                    value={formData.otherAnimals}
                    onChange={(e) => setFormData({ ...formData, otherAnimals: e.target.value })}
                    placeholder="Ej. 1 perra mestiza de 4 años castrada / Ninguno"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mensaje o comentarios adicionales para el refugio</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Cuéntanos por qué te gustaría adoptar a esta mascota..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando solicitud...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    Enviar Postulación al Refugio
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
