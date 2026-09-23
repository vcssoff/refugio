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
    { key: "kidsCount" as const, label: "Niños (2-12 años)", icon: "🧒" },
    { key: "babiesCount" as const, label: "Bebés (0-2 años)", icon: "👶" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Integrantes del Hogar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
          <Users className="w-4 h-4 text-orange-500" />
          <span>¿Quiénes viven en la casa? (Selecciona cantidades)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {peopleCounters.map(({ key, label, icon }) => {
            const val = data[key] || 0;
            return (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-2xl border border-orange-100 dark:border-stone-700 bg-orange-50/30 dark:bg-stone-800/60 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-stone-200">{label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateCount(key, -1)}
                    disabled={val <= 0}
                    className="w-7 h-7 rounded-xl bg-white dark:bg-stone-700 border border-slate-200 dark:border-stone-600 disabled:opacity-40 flex items-center justify-center text-slate-700 dark:text-stone-200 hover:bg-orange-50 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-6 text-center text-sm font-extrabold text-orange-600 dark:text-orange-400">
                    {val}
                  </span>

                  <button
                    type="button"
                    onClick={() => updateCount(key, 1)}
                    className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Otras Mascotas en el Hogar */}
      <div className="space-y-3 pt-3 border-t border-orange-100 dark:border-stone-700">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
          <PawPrint className="w-4 h-4 text-rose-500" />
          <span>¿Tienes otras mascotas actualmente?</span>
        </div>

        {/* Perros y Gatos con contadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-orange-100 dark:border-stone-700 bg-orange-50/30 dark:bg-stone-800/60 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐶</span>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-stone-200 block">Perros en casa</span>
                <span className="text-[10px] text-slate-500 dark:text-stone-400">Cantidad actual</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateCount("dogsCount", -1)}
                disabled={data.dogsCount <= 0}
                className="w-8 h-8 rounded-xl bg-white dark:bg-stone-700 border border-slate-200 dark:border-stone-600 disabled:opacity-40 flex items-center justify-center text-slate-700 dark:text-stone-200 hover:bg-orange-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center text-sm font-extrabold text-orange-600 dark:text-orange-400">
                {data.dogsCount || 0}
              </span>
              <button
                type="button"
                onClick={() => updateCount("dogsCount", 1)}
                className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-orange-100 dark:border-stone-700 bg-orange-50/30 dark:bg-stone-800/60 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐱</span>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-stone-200 block">Gatos en casa</span>
                <span className="text-[10px] text-slate-500 dark:text-stone-400">Cantidad actual</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateCount("catsCount", -1)}
                disabled={data.catsCount <= 0}
                className="w-8 h-8 rounded-xl bg-white dark:bg-stone-700 border border-slate-200 dark:border-stone-600 disabled:opacity-40 flex items-center justify-center text-slate-700 dark:text-stone-200 hover:bg-orange-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center text-sm font-extrabold text-rose-500 dark:text-rose-400">
                {data.catsCount || 0}
              </span>
              <button
                type="button"
                onClick={() => updateCount("catsCount", 1)}
                className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Otras especies con Chips seleccionables con un clic */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-[11px] font-bold text-slate-600 dark:text-stone-300">
            ¿Otras especies o animales de compañía? (Haz clic para marcar)
          </label>
          <div className="flex flex-wrap gap-2">
            {OTHER_PETS_OPTIONS.map((opt) => {
              const active = selectedOthers.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleOtherAnimal(opt)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    active
                      ? "bg-amber-100 border-amber-300 text-amber-900 shadow-xs dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-200"
                      : "bg-white dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-600 dark:text-stone-300 hover:bg-orange-50/50"
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
