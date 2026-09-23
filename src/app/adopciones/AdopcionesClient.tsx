"use client";

import React, { useState, useMemo } from "react";
import PetCard, { PetCardData } from "@/components/PetCard";
import PetFilters, { FilterState } from "@/components/PetFilters";
import { Heart, SearchX } from "lucide-react";

interface AdopcionesClientProps {
  initialPets: PetCardData[];
}

export default function AdopcionesClient({ initialPets }: AdopcionesClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    species: "",
    size: "",
    gender: "",
    goodWithKids: false,
    goodWithDogs: false,
    goodWithCats: false,
    onlyUrgent: false,
    search: "",
  });

  const handleReset = () => {
    setFilters({
      species: "",
      size: "",
      gender: "",
      goodWithKids: false,
      goodWithDogs: false,
      goodWithCats: false,
      onlyUrgent: false,
      search: "",
    });
  };

  const filteredPets = useMemo(() => {
    return initialPets.filter((pet) => {
      if (filters.onlyUrgent && !pet.isUrgent && pet.ageGroup !== "SENIOR" && !pet.healthCondition) return false;
      if (filters.species && pet.species !== filters.species) return false;
      if (filters.size && pet.size !== filters.size) return false;
      if (filters.gender && pet.gender !== filters.gender) return false;
      if (filters.goodWithKids && !pet.goodWithKids) return false;
      if (filters.goodWithDogs && !pet.goodWithDogs) return false;
      if (filters.goodWithCats && !pet.goodWithCats) return false;

      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesTitle = pet.title.toLowerCase().includes(query);
        const matchesName = pet.name ? pet.name.toLowerCase().includes(query) : false;
        const matchesCity = pet.city ? pet.city.toLowerCase().includes(query) : false;
        if (!matchesTitle && !matchesName && !matchesCity) return false;
      }

      return true;
    });
  }, [initialPets, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 fill-teal-600" />
            Adopciones Responsables
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Mascotas en Adopción
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Mostrando {filteredPets.length} de {initialPets.length} animales buscando familia
          </p>
        </div>
      </div>

      {/* Barra de Filtros Facetados */}
      <PetFilters filters={filters} onChange={setFilters} onReset={handleReset} />

      {/* Grid de Resultados */}
      {filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No encontramos mascotas con estos filtros
          </h3>
          <p className="text-xs text-slate-500">
            Intenta cambiar los filtros de especie, tamaño o convivencia para ver más resultados.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Restablecer todos los filtros
          </button>
        </div>
      )}
    </div>
  );
}
