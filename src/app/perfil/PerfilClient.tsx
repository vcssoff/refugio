"use client";

import React, { useState } from "react";
import Link from "next/link";
import ResponsivePicture from "@/components/ResponsivePicture";
import {
  User,
  ShieldCheck,
  Heart,
  PawPrint,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Mail,
  Phone,
  Home,
  AlertCircle,
  Trash2,
  Pencil,
  Loader2,
} from "lucide-react";
import { TYPE_LABELS, PetType } from "@/lib/constants";

interface UserProfileData {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    isVerifiedShelter: boolean;
    shelterName: string | null;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pets: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receivedApplications: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sentApplications: any[];
}

export default function PerfilClient({ data }: { data: UserProfileData }) {
  const { user, pets, receivedApplications, sentApplications } = data;
  const [activeTab, setActiveTab] = useState<"pets" | "received" | "sent">("pets");
  const [myPets, setMyPets] = useState(pets);
  const [myReceived, setMyReceived] = useState(receivedApplications);
  const [mySent, setMySent] = useState(sentApplications);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Eliminar post directamente por el usuario
  const handleDeletePet = async (petId: string, petTitle: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la publicación de "${petTitle}"? Esta acción es definitiva.`)) {
      return;
    }

    setLoadingId(petId);
    setMessage(null);

    try {
      const res = await fetch(`/api/pets/${petId}`, { method: "DELETE" });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Error al eliminar la publicación");

      setMyPets((prev) => prev.filter((p) => p.id !== petId));
      setMessage({
        text: `La publicación de "${petTitle}" fue eliminada correctamente.`,
        type: "success",
      });
    } catch (err: unknown) {
      if (err instanceof Error) setMessage({ text: err.message, type: "error" });
      else setMessage({ text: "Error inesperado al eliminar", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  // Tick (Aprobar) o Cruz (Rechazar) para postulaciones recibidas
  const handleApplicationStatus = async (appId: string, action: "APPROVE" | "REJECT") => {
    const isApprove = action === "APPROVE";
    const promptText = isApprove
      ? "¿Deseas CONFIRMAR la adopción para este postulante? La mascota quedará automáticamente como ADOPTADA y se le notificará al adoptante."
      : "¿Deseas RECHAZAR esta postulación de adopción? Se le enviará una notificación al usuario.";

    if (!confirm(promptText)) return;

    setLoadingId(appId);
    setMessage(null);

    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Error al actualizar la postulación");

      setMyReceived((prev) =>
        prev.map((app) =>
          app.id === appId
            ? { ...app, status: action === "APPROVE" ? "APROBADO" : "RECHAZADO" }
            : app
        )
      );

      setMessage({
        text: resData.message || (isApprove ? "¡Adopción confirmada!" : "Postulación rechazada."),
        type: "success",
      });
    } catch (err: unknown) {
      if (err instanceof Error) setMessage({ text: err.message, type: "error" });
      else setMessage({ text: "Error al responder postulación", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  // Cancelar solicitud enviada por el adoptante
  const handleCancelApplication = async (appId: string) => {
    if (!confirm("¿Deseas cancelar esta solicitud de adopción?")) return;

    setLoadingId(appId);
    setMessage(null);

    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL" }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Error al cancelar la solicitud");

      setMySent((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: "CANCELADO" } : app
        )
      );

      setMessage({ text: "Solicitud cancelada correctamente.", type: "success" });
    } catch (err: unknown) {
      if (err instanceof Error) setMessage({ text: err.message, type: "error" });
      else setMessage({ text: "Error al cancelar solicitud", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Perfil */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-2xl">
            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {user.name || "Usuario de Refugio"}
              </h1>
              {user.isVerifiedShelter && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Refugio Verificado
                </span>
              )}
              {user.role === "ADMIN" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
            {user.shelterName && (
              <p className="text-xs font-semibold text-teal-700 mt-1">
                Organización: {user.shelterName}
              </p>
            )}
          </div>
        </div>

        <Link
          href="/publicar"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-end sm:self-auto"
        >
          <PawPrint className="w-4 h-4 fill-white" />
          Nueva Publicación
        </Link>
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
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("pets")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "pets"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <PawPrint className="w-4 h-4" />
          Mis Publicaciones ({myPets.length})
        </button>

        <button
          onClick={() => setActiveTab("received")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "received"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Heart className="w-4 h-4" />
          Postulaciones Recibidas ({myReceived.length})
        </button>

        <button
          onClick={() => setActiveTab("sent")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "sent"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          Mis Solicitudes Enviadas ({mySent.length})
        </button>
      </div>

      {/* Contenido Tab 1: Mis Publicaciones */}
      {activeTab === "pets" && (
        <div className="space-y-4">
          {myPets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {myPets.map((pet: any) => {
                const typeConfig = TYPE_LABELS[pet.type as PetType] || {
                  label: pet.type,
                  badgeColor: "bg-slate-100 text-slate-700",
                };
                const firstImg = pet.images?.[0];

                return (
                  <div
                    key={pet.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full aspect-4/3 bg-slate-100">
                        <ResponsivePicture
                          thumb={firstImg?.urlThumb}
                          card={firstImg?.urlCard}
                          alt={pet.title}
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${typeConfig.badgeColor}`}
                          >
                            {typeConfig.label}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute bottom-3 left-3">
                          {pet.status === "PENDIENTE_MODERACION" && (
                            <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" /> En Moderación
                            </span>
                          )}
                          {pet.status === "PUBLICADO" && (
                            <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Publicado
                            </span>
                          )}
                          {pet.status === "ADOPTADO" && (
                            <span className="bg-purple-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
                              <Heart className="w-3 h-3 fill-white" /> Adoptado
                            </span>
                          )}
                          {pet.status === "REUNIDO" && (
                            <span className="bg-teal-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Reunido con su familia
                            </span>
                          )}
                          {pet.status === "RECHAZADO" && (
                            <span className="bg-rose-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Rechazado
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                          {pet.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {pet.description}
                        </p>
                        {pet.moderationNote && (
                          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-xl">
                            <strong>Motivo:</strong> {pet.moderationNote}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold gap-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/mascota/${pet.id}`}
                          className="text-teal-600 hover:text-teal-800"
                        >
                          Ver
                        </Link>
                        <span>•</span>
                        <Link
                          href={`/mascota/${pet.id}/editar`}
                          className="text-amber-700 hover:text-amber-900 font-bold"
                        >
                          Editar
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeletePet(pet.id, pet.title)}
                        disabled={loadingId === pet.id}
                        className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Eliminar publicación directamente"
                      >
                        {loadingId === pet.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <PawPrint className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Aún no has publicado mascotas</h3>
              <p className="text-xs text-slate-500">
                Puedes crear una publicación para adopción o reportar un animal perdido/encontrado.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Contenido Tab 2: Postulaciones Recibidas */}
      {activeTab === "received" && (
        <div className="space-y-4">
          {myReceived.length > 0 ? (
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {myReceived.map((app: any) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                        Para: {app.pet.title}
                      </span>
                      {app.status === "APROBADO" ? (
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ADOPCIÓN CONFIRMADA
                        </span>
                      ) : app.status === "RECHAZADO" ? (
                        <span className="text-xs font-black text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-300 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          RECHAZADA
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          PENDIENTE DE RESPUESTA
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString("es-AR")}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">{app.fullName}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-teal-600" />
                          <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <a href={`tel:${app.phone}`} className="hover:underline">{app.phone}</a>
                        </span>
                      </div>
                    </div>

                    {/* Resumen del Cuestionario */}
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
                      <p className="text-xs text-slate-600 italic bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                        &quot;{app.notes}&quot;
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex flex-col gap-2 w-full md:w-56">
                    {/* Botones de Tick y Cruz */}
                    {app.status === "APROBADO" ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Adopción Confirmada
                        </div>
                        <p className="text-[10px] text-emerald-700">Mascota marcada como Adoptada</p>
                      </div>
                    ) : app.status === "RECHAZADO" ? (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-rose-800 font-extrabold text-xs">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          Solicitud Rechazada
                        </div>
                        <p className="text-[10px] text-rose-700">El usuario fue notificado</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <span className="block text-[11px] font-bold text-slate-700 text-center uppercase tracking-wider">
                          Responder Postulación
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={loadingId === app.id}
                            onClick={() => handleApplicationStatus(app.id, "APPROVE")}
                            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-xs touch-manipulation cursor-pointer transition-all disabled:opacity-50"
                            title="Confirmar Adopción (Marcar como adoptada y notificar)"
                          >
                            {loadingId === app.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                            <span>Aprobar</span>
                          </button>

                          <button
                            type="button"
                            disabled={loadingId === app.id}
                            onClick={() => handleApplicationStatus(app.id, "REJECT")}
                            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-xs touch-manipulation cursor-pointer transition-all disabled:opacity-50"
                            title="Rechazar Solicitud"
                          >
                            {loadingId === app.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4 text-white" />
                            )}
                            <span>Rechazar</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <a
                      href={`mailto:${app.email}?subject=Respuesta%20a%20tu%20postulaci%C3%B3n%20para%20${encodeURIComponent(app.pet.title)}`}
                      className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs text-center transition-colors"
                    >
                      Contactar por Email
                    </a>
                    {app.phone && (
                      <a
                        href={`https://wa.me/${app.phone.replace(/[^0-9]/g, "")}?text=Hola%20${encodeURIComponent(app.fullName)},%20te%20contacto%20sobre%20tu%20postulaci%C3%B3n%20de%20adopci%C3%B3n%20para%20${encodeURIComponent(app.pet.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs text-center transition-colors"
                      >
                        Contactar por WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No tienes postulaciones pendientes</h3>
              <p className="text-xs text-slate-500">
                Cuando los adoptantes completen el cuestionario para tus mascotas, los verás listados aquí.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Contenido Tab 3: Mis Solicitudes Enviadas */}
      {activeTab === "sent" && (
        <div className="space-y-4">
          {mySent.length > 0 ? (
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {mySent.map((app: any) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{app.pet.title}</h3>
                      {app.status === "APROBADO" ? (
                        <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ¡ADOPCIÓN APROBADA! 🎉
                        </span>
                      ) : app.status === "RECHAZADO" ? (
                        <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                          No seleccionada
                        </span>
                      ) : app.status === "CANCELADO" ? (
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                          Cancelada por ti
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          En revisión
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      Enviada el {new Date(app.createdAt).toLocaleDateString("es-AR")} al contacto ({app.pet.contactEmail})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href={`/mascota/${app.pet.id}`}
                      className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl text-center transition-colors"
                    >
                      Ver Mascota
                    </Link>

                    {app.status === "EN_REVISION" && (
                      <button
                        type="button"
                        onClick={() => handleCancelApplication(app.id)}
                        disabled={loadingId === app.id}
                        className="flex-1 sm:flex-none px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                        title="Cancelar solicitud si cambiaste de idea"
                      >
                        {loadingId === app.id ? "Cancelando..." : "Cancelar Solicitud"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No has enviado postulaciones todavía</h3>
              <p className="text-xs text-slate-500">
                Explora las mascotas en adopción y postúlate como adoptante responsable.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
