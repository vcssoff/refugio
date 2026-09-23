"use client";

import React, { useState } from "react";
import ResponsivePicture from "@/components/ResponsivePicture";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Mail,
  MapPin,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { TYPE_LABELS, PetType } from "@/lib/constants";

interface PendingPet {
  id: string;
  title: string;
  type: string;
  species: string;
  name?: string | null;
  description: string;
  contactEmail: string;
  contactPhone?: string | null;
  city?: string | null;
  createdAt: string;
  images: Array<{
    urlThumb: string;
    urlCard: string;
    urlDetail: string;
    urlOriginal: string;
  }>;
  user: {
    name?: string | null;
    email: string;
    role: string;
    isVerifiedShelter: boolean;
  };
}

interface ModeracionClientProps {
  initialPendingPets: PendingPet[];
  isAuthorized: boolean;
}

export default function ModeracionClient({
  initialPendingPets,
  isAuthorized,
}: ModeracionClientProps) {
  const [pendingPets, setPendingPets] = useState<PendingPet[]>(initialPendingPets);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState<string>("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleModerate = async (petId: string, action: "APPROVE" | "REJECT", note?: string) => {
    setLoadingId(petId);
    setMessage(null);

    try {
      const res = await fetch("/api/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId, action, note }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al moderar publicación");

      setPendingPets((prev) => prev.filter((p) => p.id !== petId));
      setRejectingId(null);
      setRejectNote("");
      setMessage({
        text: action === "APPROVE" ? "Publicación aprobada exitosamente." : "Publicación rechazada.",
        type: "success",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage({ text: err.message, type: "error" });
      } else {
        setMessage({ text: "Error inesperado", type: "error" });
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Panel de Control Comunitario
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Bandeja de Moderación
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Revisión de solicitudes para el dueño del sitio y refugios o rescatistas verificados.
          </p>
        </div>

        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900">
          {pendingPets.length} pendientes de aprobación
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Lista de Publicaciones Pendientes */}
      {pendingPets.length > 0 ? (
        <div className="space-y-4">
          {pendingPets.map((pet) => {
            const typeConfig = TYPE_LABELS[pet.type as PetType] || {
              label: pet.type,
              badgeColor: "bg-slate-100 text-slate-700",
            };
            const firstImg = pet.images?.[0];
            const isProcessing = loadingId === pet.id;

            return (
              <div
                key={pet.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Miniatura */}
                <div className="w-full md:w-48 h-36 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative">
                  <ResponsivePicture
                    thumb={firstImg?.urlThumb}
                    card={firstImg?.urlCard}
                    alt={pet.title}
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${typeConfig.badgeColor}`}
                    >
                      {typeConfig.label}
                    </span>
                  </div>
                </div>

                {/* Detalles y Datos */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{pet.species}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(pet.createdAt).toLocaleDateString("es-AR")}
                    </span>
                    {pet.city && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {pet.city}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{pet.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {pet.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-teal-600" />
                      <span>{pet.contactEmail}</span>
                    </div>
                    <div>
                      <span>Usuario autor: </span>
                      <strong className="text-slate-700">{pet.user.email}</strong>
                    </div>
                  </div>

                  {/* Formulario de Rechazo si está activo */}
                  {rejectingId === pet.id && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 mt-3 animate-in fade-in">
                      <label className="block text-xs font-semibold text-rose-900">
                        Motivo del rechazo (opcional):
                      </label>
                      <input
                        type="text"
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="Ej. Contenido publicitario ajeno a animales / Fotos no visibles"
                        className="w-full p-2 text-xs rounded-xl border border-rose-300 bg-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setRejectingId(null)}
                          className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModerate(pet.id, "REJECT", rejectNote)}
                          disabled={isProcessing}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg"
                        >
                          Confirmar Rechazo
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleModerate(pet.id, "APPROVE")}
                    disabled={isProcessing}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )}
                    Aprobar
                  </button>

                  <button
                    onClick={() => setRejectingId(pet.id)}
                    disabled={isProcessing}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Rechazar
                  </button>

                  <a
                    href={`/mascota/${pet.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Previsualizar ficha"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-800">¡Bandeja al Día!</h2>
          <p className="text-xs text-slate-500">
            No hay publicaciones esperando moderación en este momento. Cada nueva mascota ingresada aparecerá aquí para tu revisión.
          </p>
        </div>
      )}
    </div>
  );
}
