"use client";

import React, { useState } from "react";
import Link from "next/link";
import PetCard, { PetCardData } from "@/components/PetCard";
import MapExplorer, { PetMapItem } from "@/components/map/MapExplorer";
import { Compass, MapPin, Grid, PlusCircle, AlertTriangle } from "lucide-react";

interface PerdidosClientProps {
  initialPets: PetCardData[];
  defaultView?: "grid" | "map";
}

export default function PerdidosClient({
  initialPets,
  defaultView = "grid",
}: PerdidosClientProps) {
  const [view, setView] = useState<"grid" | "map">(defaultView);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const filteredPets = initialPets.filter((pet) => {
    if (typeFilter === "ALL") return true;
    return pet.type === typeFilter;
  });

  const mapItems: PetMapItem[] = filteredPets
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((p: any) => p.latitude !== null && p.longitude !== null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((p: any) => ({
      id: p.id,
      title: p.title,
      type: p.type,
      species: p.species,
      latitude: p.latitude,
      longitude: p.longitude,
      city: p.city,
      imageUrl: p.images?.[0]?.urlThumb || null,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header y Banner de Emergencia */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Alertas Comunitarias de Búsqueda
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Mascotas Perdidas y Encontradas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Utiliza el radio de 300 metros para ubicar reportes en tu barrio o notificar un hallazgo
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/publicar?type=PERDIDO"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Perdí mi Mascota
          </Link>
          <Link
            href="/publicar?type=ENCONTRADO"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Encontré una Mascota
          </Link>
        </div>
      </div>

      {/* Controles de Vista y Filtros */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filtros de Tipo */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setTypeFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              typeFilter === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todos ({initialPets.length})
          </button>
          <button
            onClick={() => setTypeFilter("PERDIDO")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              typeFilter === "PERDIDO"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            🚨 Perdidos ({initialPets.filter((p) => p.type === "PERDIDO").length})
          </button>
          <button
            onClick={() => setTypeFilter("ENCONTRADO")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              typeFilter === "ENCONTRADO"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            🔍 Encontrados ({initialPets.filter((p) => p.type === "ENCONTRADO").length})
          </button>
        </div>

        {/* Selector de Vista: Lista vs Mapa */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto justify-center">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              view === "grid"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Tarjetas
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              view === "map"
                ? "bg-white text-teal-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            Mapa Interactivo (300m)
          </button>
        </div>
      </div>

      {/* Vista de Contenido */}
      {view === "map" ? (
        <div className="space-y-3">
          <div className="bg-teal-50 border border-teal-200 p-3 rounded-2xl text-xs text-teal-900 flex items-center justify-between">
            <span>
              Mostrando ubicaciones con radio de <strong>300 metros</strong>. Haz clic en cualquier marcador para ver fotos y datos de contacto.
            </span>
            <span className="font-bold">{mapItems.length} geolocalizados</span>
          </div>

          <MapExplorer pets={mapItems} height="600px" />
        </div>
      ) : (
        <>
          {filteredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No hay alertas activas en esta categoría
              </h3>
              <p className="text-xs text-slate-500">
                Si perdiste o encontraste una mascota, puedes publicarla ahora para activar la alerta.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
