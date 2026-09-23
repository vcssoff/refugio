"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, MapPin, Phone, Send, Clock, User, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface Comment {
  id: string;
  authorName: string;
  authorPhone?: string | null;
  location?: string | null;
  message: string;
  createdAt: string;
}

interface PetCommentsProps {
  petId: string;
  petTitle: string;
  initialComments?: Comment[];
}

export default function PetComments({ petId, petTitle, initialComments = [] }: PetCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [formData, setFormData] = useState({
    authorName: "",
    authorPhone: "",
    location: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/pets/${petId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo registrar el aviso");

      setComments([data.comment, ...comments]);
      setFormData({ authorName: "", authorPhone: "", location: "", message: "" });
      setSuccessMessage("¡Aviso de avistamiento publicado! El dueño y la comunidad podrán verlo de inmediato.");
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMessage(err.message);
      else setErrorMessage("Error inesperado al publicar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-orange-100 dark:border-stone-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-orange-100 dark:border-stone-800 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-stone-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            Muro de Avistamientos y Datos de la Comunidad
          </h3>
          <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">
            ¿Viste a esta mascota en la calle o tienes información? Deja un aviso aquí para ayudar al dueño a ubicarla.
          </p>
        </div>

        <span className="px-3 py-1 bg-orange-100 dark:bg-stone-800 text-orange-800 dark:text-orange-300 rounded-full text-xs font-bold">
          {comments.length} avisos
        </span>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Formulario de Nuevo Avistamiento */}
      <form onSubmit={handleSubmit} className="bg-orange-50/40 dark:bg-stone-800/50 p-4 sm:p-5 rounded-2xl border border-orange-100 dark:border-stone-700 space-y-3">
        <span className="block text-xs font-black uppercase tracking-wider text-orange-800 dark:text-orange-300">
          Reportar si lo viste o encontraste
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">Tu Nombre *</label>
            <input
              type="text"
              required
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              placeholder="Ej. Vecino de Pocitos"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">Teléfono / WhatsApp (Uruguay)</label>
            <input
              type="tel"
              value={formData.authorPhone}
              onChange={(e) => setFormData({ ...formData, authorPhone: e.target.value })}
              placeholder="Ej. +598 99 123 456"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">¿Dónde lo viste exactamente?</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ej. Av. Rivera y Luis Alberto de Herrera, cerca de la plaza"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 dark:text-stone-300 mb-1">Mensaje o Detalle del Avistamiento *</label>
            <textarea
              required
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Cuéntanos a qué hora fue, hacia dónde iba o si alguien lo tiene retenido..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl text-xs shadow-xs hover:from-orange-600 hover:to-rose-600 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Publicar Avistamiento
          </button>
        </div>
      </form>

      {/* Lista de Avistamientos */}
      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl border border-orange-100 dark:border-stone-800 bg-orange-50/20 dark:bg-stone-800/40 space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-orange-100 dark:bg-stone-700 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold text-xs">
                    {c.authorName[0]?.toUpperCase() || "U"}
                  </div>
                  <strong className="text-slate-900 dark:text-stone-100">{c.authorName}</strong>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 dark:text-stone-400 text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(c.createdAt).toLocaleString("es-UY", { dateStyle: "short", timeStyle: "short" })}</span>
                </div>
              </div>

              {c.location && (
                <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-300 font-semibold bg-orange-100/60 dark:bg-stone-700/60 px-2.5 py-1 rounded-lg w-fit text-[11px]">
                  <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>Avistado en: {c.location}</span>
                </div>
              )}

              <p className="text-slate-700 dark:text-stone-300 leading-relaxed bg-white dark:bg-stone-900 p-3 rounded-xl border border-orange-50 dark:border-stone-800">
                "{c.message}"
              </p>

              {c.authorPhone && (
                <div className="flex justify-end pt-1">
                  <a
                    href={`https://wa.me/${c.authorPhone.replace(/[^0-9]/g, "")}?text=Hola%20${encodeURIComponent(c.authorName)},%20te%20contacto%20sobre%20el%20avistamiento%20de%20mi%20mascota%20${encodeURIComponent(petTitle)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800"
                  >
                    <Phone className="w-3 h-3" /> Contactar a {c.authorName} ({c.authorPhone})
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-slate-400 dark:text-stone-500 text-xs">
            Aún no hay reportes de avistamiento para esta mascota. Si la viste o tienes información, publica el primer aviso arriba.
          </div>
        )}
      </div>
    </div>
  );
}
