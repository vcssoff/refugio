"use client";

import React from "react";
import { Plus, Minus, Users, PawPrint } from "lucide-react";

export interface HouseholdData {
  womenCount: number;
  menCount: number;
  teensCount: number;
  kidsCount: number;
  babiesCount: number;
  dogsCount: number;
  catsCount: number;
  otherAnimals: string;
}

interface HouseholdCountersProps {
  data: HouseholdData;
  onChange: (data: HouseholdData) => void;
}

const OTHER_PETS_OPTIONS = ["Conejo", "Aves", "Hurón / Roedor", "Peces", "Ninguno"];

export default function HouseholdCounters({ data, onChange }: HouseholdCountersProps) {
  const updateCount = (key: keyof HouseholdData, delta: number) => {
    const current = (data[key] as number) || 0;
    const next = Math.max(0, current + delta);
    onChange({ ...data, [key]: next });
  };

  const toggleOtherAnimal = (option: string) => {
    if (option === "Ninguno") {
      onChange({ ...data, otherAnimals: "Ninguno" });
      return;
    }

    const currentList = data.otherAnimals
      ? data.otherAnimals.split(", ").filter((x) => x !== "Ninguno" && x.trim().length > 0)
      : [];

    let updated: string[];
    if (currentList.includes(option)) {
      updated = currentList.filter((x) => x !== option);
    } else {
      updated = [...currentList, option];
    }

    onChange({ ...data, otherAnimals: updated.length > 0 ? updated.join(", ") : "Ninguno" });
  };

  const selectedOthers = data.otherAnimals ? data.otherAnimals.split(", ") : [];

  const peopleCounters = [
    { key: "womenCount" as const, label: "Mujeres adultas", icon: "👩" },
    { key: "menCount" as const, label: "Hombres adultos", icon: "👨" },
    { key: "teensCount" as const, label: "Adolescentes", icon: "🎒" },
    { key: "kidsCount" as const, label: "Niños (2 a 12 años)", icon: "🧒" },
    { key: "babiesCount" as const, label: "Bebés (0 a 2 años)", icon: "👶" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Integrantes del Hogar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#634832]">
          <Users className="w-4 h-4 text-orange-600" />
          <span>¿Quiénes viven en la casa? (Toca + o - para sumar integrantes)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {peopleCounters.map(({ key, label, icon }) => {
            const val = data[key] || 0;
            return (
              <div
                key={key}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#e8dfd3] bg-[#fbf8f3] shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl select-none">{icon}</span>
                  <div>
                    <span className="text-xs font-bold text-[#2d2420] block">{label}</span>
                    <span className="text-[10px] text-stone-500 font-medium">En el hogar</span>
                  </div>
                </div>

                {/* Controles con botones grandes cómodos para celular (44px) */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      updateCount(key, -1);
                    }}
                    disabled={val <= 0}
                    className="w-11 h-11 rounded-xl bg-white border border-[#dcd3c5] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-stone-700 hover:bg-stone-50 active:scale-95 transition-all touch-manipulation cursor-pointer shadow-xs"
                    aria-label={`Restar ${label}`}
                  >
                    <Minus className="w-4 h-4 text-stone-700" />
                  </button>

                  <span className="w-7 text-center text-base font-black text-orange-700 select-none">
                    {val}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      updateCount(key, 1);
                    }}
                    className="w-11 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center transition-all shadow-xs touch-manipulation cursor-pointer"
                    aria-label={`Sumar ${label}`}
                  >
                    <Plus className="w-4 h-4 text-white font-bold" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Otras Mascotas en el Hogar */}
      <div className="space-y-3 pt-4 border-t border-[#eee6db]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#634832]">
          <PawPrint className="w-4 h-4 text-amber-600" />
          <span>¿Tienes otras mascotas actualmente en casa?</span>
        </div>

        {/* Perros y Gatos con contadores grandes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#e8dfd3] bg-[#fbf8f3] shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl select-none">🐶</span>
              <div>
                <span className="text-xs font-bold text-[#2d2420] block">Perros en casa</span>
                <span className="text-[10px] text-stone-500">Cantidad actual</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateCount("dogsCount", -1);
                }}
                disabled={data.dogsCount <= 0}
                className="w-11 h-11 rounded-xl bg-white border border-[#dcd3c5] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-stone-700 hover:bg-stone-50 active:scale-95 transition-all touch-manipulation cursor-pointer shadow-xs"
                aria-label="Restar perros"
              >
                <Minus className="w-4 h-4 text-stone-700" />
              </button>

              <span className="w-7 text-center text-base font-black text-amber-800 select-none">
                {data.dogsCount || 0}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateCount("dogsCount", 1);
                }}
                className="w-11 h-11 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white flex items-center justify-center transition-all shadow-xs touch-manipulation cursor-pointer"
                aria-label="Sumar perros"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#e8dfd3] bg-[#fbf8f3] shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl select-none">🐱</span>
              <div>
                <span className="text-xs font-bold text-[#2d2420] block">Gatos en casa</span>
                <span className="text-[10px] text-stone-500">Cantidad actual</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateCount("catsCount", -1);
                }}
                disabled={data.catsCount <= 0}
                className="w-11 h-11 rounded-xl bg-white border border-[#dcd3c5] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-stone-700 hover:bg-stone-50 active:scale-95 transition-all touch-manipulation cursor-pointer shadow-xs"
                aria-label="Restar gatos"
              >
                <Minus className="w-4 h-4 text-stone-700" />
              </button>

              <span className="w-7 text-center text-base font-black text-rose-700 select-none">
                {data.catsCount || 0}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateCount("catsCount", 1);
                }}
                className="w-11 h-11 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white flex items-center justify-center transition-all shadow-xs touch-manipulation cursor-pointer"
                aria-label="Sumar gatos"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Otras especies con Chips seleccionables con un clic */}
        <div className="space-y-2 pt-2">
          <label className="block text-[11px] font-bold text-[#4a3f35]">
            ¿Tienes otras especies o animales de compañía? (Toca para seleccionar)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {OTHER_PETS_OPTIONS.map((opt) => {
              const active = selectedOthers.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleOtherAnimal(opt);
                  }}
                  className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all touch-manipulation cursor-pointer active:scale-95 ${
                    active
                      ? "bg-amber-100/90 border-amber-300 text-amber-950 shadow-xs ring-2 ring-amber-400/40"
                      : "bg-white border-[#ded4c6] text-[#4a3f35] hover:bg-[#f6eee4]"
                  }`}
                >
                  {opt === "Ninguno" ? "❌ Ninguno" : `🐾 ${opt}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
