"use client";

import React, { useState } from "react";
import ResponsivePicture from "@/components/ResponsivePicture";
import {
  Bell,
  PawPrint,
  Heart,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  Home,
  Users,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { TYPE_LABELS, PetType } from "@/lib/constants";

interface AdminSolicitudesClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialPendingPets: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialApplications: any[];
}

export default function AdminSolicitudesClient({
  initialPendingPets,
  initialApplications,
}: AdminSolicitudesClientProps) {
  const [activeTab, setActiveTab] = useState<"pets" | "applications">("pets");
  const [pendingPets, setPendingPets] = useState(initialPendingPets);
  const [applications, setApplications] = useState(initialApplications);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Acción para admitir o rechazar publicación de mascota
  const handleModeratePet = async (petId: string, action: "APPROVE" | "REJECT") => {
    setLoadingId(petId);
    setMessage(null);

    try {
      const res = await fetch("/api/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId, action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar la publicación");

      setPendingPets((prev) => prev.filter((p) => p.id !== petId));
      setMessage({
        text: action === "APPROVE" ? "¡Publicación admitida y publicada con éxito!" : "Publicación rechazada.",
        type: "success",
      });
    } catch (err: unknown) {
      if (err instanceof Error) setMessage({ text: err.message, type: "error" });
      else setMessage({ text: "Error inesperado", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header con gradiente cálido */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" />
            Centro de Notificaciones & Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Bandeja de Solicitudes</h1>
          <p className="text-orange-50 text-xs sm:text-sm mt-1 max-w-xl">
            Espacio de admisión para el Administrador de <strong>Refugio Patitas</strong>. Revisa publicaciones pendientes de vecinos y solicitudes de adopción con visitas agendadas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-white text-orange-600 rounded-2xl text-xs font-black shadow-sm">
            {pendingPets.length} Publicaciones
          </span>
          <span className="px-3.5 py-1.5 bg-white/20 text-white rounded-2xl text-xs font-bold backdrop-blur-sm">
            {applications.length} Adopciones
          </span>
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
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-orange-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("pets")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "pets"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <PawPrint className="w-4 h-4" />
          Publicaciones para Admisión ({pendingPets.length})
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "applications"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Heart className="w-4 h-4" />
          Solicitudes de Adopción & Visitas ({applications.length})
        </button>
      </div>

      {/* TAB 1: Publicaciones pendientes de admisión */}
      {activeTab === "pets" && (
        <div className="space-y-4">
          {pendingPets.length > 0 ? (
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {pendingPets.map((pet: any) => {
                const typeConfig = TYPE_LABELS[pet.type as PetType] || {
                  label: pet.type,
                  badgeColor: "bg-slate-100 text-slate-700",
                };
                const firstImg = pet.images?.[0];
                const isProcessing = loadingId === pet.id;

                return (
                  <div
                    key={pet.id}
                    className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between"
                  >
                    <div className="w-full md:w-44 h-36 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative">
                      <ResponsivePicture
                        thumb={firstImg?.urlThumb}
                        card={firstImg?.urlCard}
                        alt={pet.title}
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${typeConfig.badgeColor}`}>
                          {typeConfig.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-slate-800">{pet.species}</span>
                        <span>•</span>
                        <span>{new Date(pet.createdAt).toLocaleDateString("es-AR")}</span>
                        {pet.city && <span>• 📍 {pet.city}</span>}
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{pet.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {pet.description}
                      </p>

                      <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-orange-500" /> {pet.contactEmail}
                        </span>
                        {pet.contactPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-emerald-600" /> {pet.contactPhone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                      <button
                        onClick={() => handleModeratePet(pet.id, "APPROVE")}
                        disabled={isProcessing}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Admitir y Publicar
                      </button>

                      <button
                        onClick={() => handleModeratePet(pet.id, "REJECT")}
                        disabled={isProcessing}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Rechazar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-orange-100 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">¡Todas las publicaciones están al día!</h3>
              <p className="text-xs text-slate-500">
                No hay publicaciones nuevas esperando admisión por parte del administrador.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Solicitudes de Adopción y Visitas Previas */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          {applications.length > 0 ? (
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {applications.map((app: any) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm flex flex-col md:flex-row items-start justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                        Postulación para: {app.pet.title}
                      </span>
                      {app.isPreVisit && (
                        <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-rose-500" />
                          SOLICITA VISITA PREVIA
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        Recibida el {new Date(app.createdAt).toLocaleDateString("es-AR")}
                      </span>
                    </div>

                    {/* Turno de Visita Seleccionado */}
                    {app.preferredDate && (
                      <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
                        <div>
                          <strong>Turno Agendado: </strong>
                          <span>{new Date(app.preferredDate).toLocaleDateString("es-AR")}</span> •{" "}
                          <span className="font-semibold">{app.preferredTimeSlot}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-base font-bold text-slate-900">{app.fullName}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-orange-500" />
                          <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <a href={`tel:${app.phone}`} className="hover:underline">{app.phone}</a>
                        </span>
                      </div>
                    </div>

                    {/* Ficha de Cuestionario */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Vivienda</span>
                        <span className="font-semibold text-slate-800">{app.housingType}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Patio Cerrado</span>
                        <span className="font-semibold text-slate-800">{app.hasYard ? "Sí" : "No"}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Tiempo Libre</span>
                        <span className="font-semibold text-slate-800">{app.freeTimeHours}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Niños / Bebés</span>
                        <span className="font-semibold text-slate-800">{app.hasBabiesOrKids ? "Sí" : "No"}</span>
                      </div>
                    </div>

                    {app.notes && (
                      <p className="text-xs text-slate-600 italic bg-orange-50/40 p-3 rounded-xl border border-orange-100">
                        &quot;{app.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Acciones de Contacto */}
                  <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
                    <a
                      href={`mailto:${app.email}?subject=Confirmaci%C3%B3n%20de%20visita%20en%20Refugio%20Patitas%20para%20${encodeURIComponent(app.pet.title)}`}
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs text-center shadow-xs transition-colors"
                    >
                      Responder por Correo
                    </a>
                    {app.phone && (
                      <a
                        href={`https://wa.me/${app.phone.replace(/[^0-9]/g, "")}?text=Hola%20${encodeURIComponent(app.fullName)},%20te%20contacto%20desde%20Refugio%20Patitas%20sobre%20tu%20solicitud%20para%20${encodeURIComponent(app.pet.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs text-center shadow-xs transition-colors"
                      >
                        Contactar por WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-orange-100 space-y-3">
              <Heart className="w-12 h-12 text-rose-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No hay solicitudes de adopción pendientes</h3>
              <p className="text-xs text-slate-500">
                Cuando los postulantes agenden turnos o soliciten visitas, aparecerán aquí.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
