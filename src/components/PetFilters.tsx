"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { SPECIES_LABELS, Species } from "@/lib/constants";

export interface FilterState {
  species: string;
  size: string;
  gender: string;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
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
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      {/* Barra de Búsqueda y Botón Limpiar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateField("search", e.target.value)}
            placeholder="Buscar por nombre, raza, barrio o ciudad..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
          />
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors whitespace-nowrap self-end sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer Filtros
        </button>
      </div>

      {/* Selectores Facetados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
        {/* Especie */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Especie</label>
          <select
            value={filters.species}
            onChange={(e) => updateField("species", e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Todas las especies</option>
            <option value="PERRO">Perro</option>
            <option value="GATO">Gato</option>
            <option value="OTRO">Otros animales</option>
          </select>
        </div>

        {/* Tamaño */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Tamaño</label>
          <select
            value={filters.size}
            onChange={(e) => updateField("size", e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Cualquier tamaño</option>
            <option value="PEQUENO">Pequeño</option>
            <option value="MEDIANO">Mediano</option>
            <option value="GRANDE">Grande</option>
          </select>
        </div>

        {/* Género */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Género</label>
          <select
            value={filters.gender}
            onChange={(e) => updateField("gender", e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Cualquiera</option>
            <option value="MACHO">Macho</option>
            <option value="HEMBRA">Hembra</option>
          </select>
        </div>

        {/* Toggles de Convivencia */}
        <div className="col-span-2 sm:col-span-3 md:col-span-1 flex flex-col justify-end gap-1.5 pt-1">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.goodWithKids}
              onChange={(e) => updateField("goodWithKids", e.target.checked)}
              className="w-3.5 h-3.5 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-700 font-medium">Bueno con niños</span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.goodWithDogs}
              onChange={(e) => updateField("goodWithDogs", e.target.checked)}
              className="w-3.5 h-3.5 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-700 font-medium">Sociable con perros</span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.goodWithCats}
              onChange={(e) => updateField("goodWithCats", e.target.checked)}
              className="w-3.5 h-3.5 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-700 font-medium">Sociable con gatos</span>
          </label>
        </div>
      </div>
    </div>
  );
}
