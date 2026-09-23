"use client";

import React from "react";
import { Search, RotateCcw, AlertTriangle } from "lucide-react";
import { SPECIES_LABELS, Species } from "@/lib/constants";

export interface FilterState {
  species: string;
  size: string;
  gender: string;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  onlyUrgent: boolean;
  search: string;
}

interface PetFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export default function PetFilters({ filters, onChange, onReset }: PetFiltersProps) {
  const updateField = (key: keyof FilterState, value: unknown) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#ede5da] shadow-xs space-y-4">
      {/* Barra de Búsqueda y Botones de Acción */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-orange-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateField("search", e.target.value)}
            placeholder="Buscar por nombre, raza, barrio o ciudad..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#ded5c7] text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#fdfbf8] text-[#2d2420]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => updateField("onlyUrgent", !filters.onlyUrgent)}
            className={`min-h-[44px] flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-2xl transition-all whitespace-nowrap active:scale-95 touch-manipulation cursor-pointer ${
              filters.onlyUrgent
                ? "bg-rose-600 text-white shadow-xs ring-2 ring-rose-600/40"
                : "bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-200"
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${filters.onlyUrgent ? "text-white" : "text-rose-600"}`} />
            <span>{filters.onlyUrgent ? "✓ Filtrando Urgentes" : "🚨 Casos Urgentes & Viejitos"}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#52443a] hover:text-[#2d2420] bg-[#f5efe6] hover:bg-[#ede5da] active:scale-95 border border-[#e2d7c8] rounded-2xl transition-all whitespace-nowrap touch-manipulation cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {/* Selectores Facetados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-3 border-t border-[#eee6dc] text-xs">
        {/* Especie */}
        <div>
          <label className="block font-bold text-[#4a3f35] mb-1">Especie</label>
          <select
            value={filters.species}
            onChange={(e) => updateField("species", e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#ded5c7] bg-white text-[#2d2420] font-medium focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Todas las especies</option>
            <option value="PERRO">Perro</option>
            <option value="GATO">Gato</option>
            <option value="OTRO">Otros animales</option>
          </select>
        </div>

        {/* Tamaño */}
        <div>
          <label className="block font-bold text-[#4a3f35] mb-1">Tamaño</label>
          <select
            value={filters.size}
            onChange={(e) => updateField("size", e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#ded5c7] bg-white text-[#2d2420] font-medium focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Cualquier tamaño</option>
            <option value="PEQUENO">Pequeño</option>
            <option value="MEDIANO">Mediano</option>
            <option value="GRANDE">Grande</option>
          </select>
        </div>

        {/* Género */}
        <div>
          <label className="block font-bold text-[#4a3f35] mb-1">Género</label>
          <select
            value={filters.gender}
            onChange={(e) => updateField("gender", e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#ded5c7] bg-white text-[#2d2420] font-medium focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Cualquiera</option>
            <option value="MACHO">Macho</option>
            <option value="HEMBRA">Hembra</option>
          </select>
        </div>

        {/* Toggles de Convivencia */}
        <div className="col-span-2 sm:col-span-3 md:col-span-1 flex flex-col justify-end gap-2 pt-1">
          <label className="inline-flex items-center gap-2 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={filters.goodWithKids}
              onChange={(e) => updateField("goodWithKids", e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded border-[#ded5c7] focus:ring-orange-400"
            />
            <span className="text-[11px] text-[#3e342f] font-semibold">Bueno con niños</span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={filters.goodWithDogs}
              onChange={(e) => updateField("goodWithDogs", e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded border-[#ded5c7] focus:ring-orange-400"
            />
            <span className="text-[11px] text-[#3e342f] font-semibold">Sociable con perros</span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={filters.goodWithCats}
              onChange={(e) => updateField("goodWithCats", e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded border-[#ded5c7] focus:ring-orange-400"
            />
            <span className="text-[11px] text-[#3e342f] font-semibold">Sociable con gatos</span>
          </label>
        </div>
      </div>
    </div>
  );
}
