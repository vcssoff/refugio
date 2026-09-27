"use client";

import React, { useState } from "react";
import { MessageSquare, MapPin, Phone, Send, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ded1] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#eee6dc] pb-4">
        <div>
          <h3 className="text-lg font-black text-[#2d2420] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            Muro de Avistamientos y Datos de la Comunidad
          </h3>
          <p className="text-xs text-[#5a4c41] mt-0.5">
            ¿Viste a esta mascota en la calle o tienes información? Deja un aviso aquí para ayudar al dueño a ubicarla.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-xs font-bold shrink-0">
          {comments.length} avisos
        </span>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Formulario de Nuevo Avistamiento */}
      <form onSubmit={handleSubmit} className="bg-[#fbf8f3] p-4 sm:p-5 rounded-2xl border border-[#ebe0d3] space-y-3">
        <span className="block text-xs font-black uppercase tracking-wider text-[#634832]">
          Reportar si lo viste o encontraste
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-[#3e342f] mb-1">Tu Nombre *</label>
            <input
              type="text"
              required
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              placeholder="Ej. Lucía Pérez"
              className="w-full px-3 py-2.5 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 text-[#2d2420]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#3e342f] mb-1">Tu Teléfono / WhatsApp (opcional)</label>
            <input
              type="tel"
              value={formData.authorPhone}
              onChange={(e) => setFormData({ ...formData, authorPhone: e.target.value })}
              placeholder="+598 9X XXX XXX"
              className="w-full px-3 py-2.5 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 text-[#2d2420]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-[#3e342f] mb-1">¿Dónde lo viste exactamente? (Calle, esquina, barrio)</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ej. Rambla y Trouville, Pocitos"
              className="w-full px-3 py-2.5 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 text-[#2d2420]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-[#3e342f] mb-1">Mensaje o Detalle del Avistamiento *</label>
            <textarea
              required
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Cuéntanos a qué hora fue, hacia dónde iba o si alguien lo tiene retenido..."
              className="w-full px-3 py-2 rounded-xl border border-[#ded5c7] bg-white text-xs focus:ring-2 focus:ring-orange-400 text-[#2d2420]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[46px] inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl text-xs shadow-xs active:scale-95 touch-manipulation cursor-pointer transition-all disabled:opacity-50"
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
              className="p-4 rounded-2xl border border-[#e8ded1] bg-[#fdfbf8] space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    {c.authorName[0]?.toUpperCase() || "U"}
                  </div>
                  <strong className="text-[#2d2420]">{c.authorName}</strong>
                </div>

                <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(c.createdAt).toLocaleString("es-UY", { dateStyle: "short", timeStyle: "short" })}</span>
                </div>
              </div>

              {c.location && (
                <div className="flex items-center gap-1.5 text-orange-900 font-semibold bg-orange-100/70 border border-orange-200 px-3 py-1 rounded-lg w-fit text-[11px]">
                  <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                  <span>Avistado en: {c.location}</span>
                </div>
              )}

              <p className="text-[#3e342f] leading-relaxed bg-white p-3 rounded-xl border border-[#eee6db]">
                &quot;{c.message}&quot;
              </p>

              {c.authorPhone && (
                <div className="flex justify-end pt-1">
                  <a
                    href={`https://wa.me/${c.authorPhone.replace(/[^0-9]/g, "")}?text=Hola%20${encodeURIComponent(c.authorName)},%20te%20contacto%20sobre%20el%20avistamiento%20de%20mi%20mascota%20${encodeURIComponent(petTitle)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[40px] inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 active:scale-95 touch-manipulation cursor-pointer transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Contactar a {c.authorName} ({c.authorPhone})</span>
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-stone-500 text-xs">
            Aún no hay reportes de avistamiento para esta mascota. Si la viste o tienes información, publica el primer aviso arriba.
          </div>
        )}
      </div>
    </div>
  );
}
