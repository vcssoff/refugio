"use client";

import React, { useState, useMemo } from "react";
import PetCard, { PetCardData } from "@/components/PetCard";
import {
  Sparkles,
  Heart,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Flame,
  Home,
  Users,
  Compass,
} from "lucide-react";

interface MascotaIdealWizardProps {
  availablePets: PetCardData[];
}

export default function MascotaIdealWizard({ availablePets }: MascotaIdealWizardProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [answers, setAnswers] = useState({
    species: "CUALQUIERA", // "PERRO", "GATO", "CUALQUIERA"
    energyLevel: "MODERADO", // "TRANQUILO", "MODERADO", "ACTIVO"
    housing: "CASA", // "DEPTO", "CASA", "CAMPO"
    hasKids: false,
    hasDogs: false,
    hasCats: false,
    preferredSize: "CUALQUIERA", // "PEQUENO", "MEDIANO", "GRANDE", "CUALQUIERA"
  });

  const [isCompleted, setIsCompleted] = useState(false);

  const matchedPets = useMemo(() => {
    if (!isCompleted) return [];

    return availablePets
      .map((pet) => {
        let score = 50; // base

        // Especie
        if (answers.species !== "CUALQUIERA") {
          if (pet.species === answers.species) score += 30;
          else score -= 40;
        } else {
          score += 15;
        }

        // Convivencia Niños
        if (answers.hasKids) {
          if (pet.goodWithKids) score += 20;
          else score -= 25;
        }

        // Convivencia Perros
        if (answers.hasDogs) {
          if (pet.goodWithDogs) score += 15;
          else score -= 20;
        }

        // Convivencia Gatos
        if (answers.hasCats) {
          if (pet.goodWithCats) score += 15;
          else score -= 20;
        }

        // Tamaño y vivienda
        if (answers.housing === "DEPTO") {
          if (pet.size === "PEQUENO") score += 15;
          if (pet.size === "GRANDE") score -= 10;
        }

        if (answers.preferredSize !== "CUALQUIERA") {
          if (pet.size === answers.preferredSize) score += 20;
        }

        // Nivel de energía aproximado por edad
        if (answers.energyLevel === "TRANQUILO") {
          if (pet.ageGroup === "ADULTO" || pet.ageGroup === "SENIOR") score += 15;
          if (pet.ageGroup === "CACHORRO") score -= 10;
        } else if (answers.energyLevel === "ACTIVO") {
          if (pet.ageGroup === "CACHORRO" || pet.ageGroup === "JOVEN") score += 15;
        }

        const percentage = Math.min(99, Math.max(55, Math.round(score)));
        return { pet, percentage };
      })
      .filter((item) => item.percentage >= 60)
      .sort((a, b) => b.percentage - a.percentage);
  }, [availablePets, answers, isCompleted]);

  const handleReset = () => {
    setStep(1);
    setIsCompleted(false);
    setAnswers({
      species: "CUALQUIERA",
      energyLevel: "MODERADO",
      housing: "CASA",
      hasKids: false,
      hasDogs: false,
      hasCats: false,
      preferredSize: "CUALQUIERA",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Visual Cálido */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          Test de Afinidad y Amor a Primera Vista
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Encuentra tu{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500">
            Mascota Ideal
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Responde 4 preguntas sencillas sobre tu estilo de vida y nuestro algoritmo te recomendará los animales de <strong>Refugio Patitas</strong> con mayor compatibilidad para ti.
        </p>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-orange-100 shadow-md space-y-8 max-w-2xl mx-auto">
          {/* Barra de Progreso */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Paso {step} de {totalSteps}</span>
              <span className="text-orange-600">{Math.round((step / totalSteps) * 100)}% Completado</span>
            </div>
            <div className="w-full h-2.5 bg-orange-100/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Paso 1: Especie Preferida */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-900 text-center">
                ¿Qué tipo de compañero estás buscando sumar a tu vida?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "PERRO", title: "Un Perro", desc: "Paseos, juegos y lealtad incondicional", icon: "🐶" },
                  { id: "GATO", title: "Un Gato", desc: "Ronroneos, independencia y cariño dulce", icon: "🐱" },
                  { id: "CUALQUIERA", title: "Cualquiera", desc: "Lo que importa es conectar con el indicado", icon: "🐾" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAnswers({ ...answers, species: item.id })}
                    className={`p-5 rounded-2xl border-2 text-center transition-all ${
                      answers.species === item.id
                        ? "border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20"
                        : "border-slate-200 hover:border-orange-200 bg-white"
                    }`}
                  >
                    <span className="text-3xl block mb-2">{item.icon}</span>
                    <strong className="block text-sm text-slate-900">{item.title}</strong>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-1">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 2: Nivel de Energía y Rutina */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-900 text-center">
                ¿Cómo describirías tu rutina y nivel de energía en casa?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "TRANQUILO",
                    title: "Tranquilo / Calmo",
                    desc: "Mucho sillón, descanso, paseos suaves y vida relajada",
                    icon: "🛋️",
                  },
                  {
                    id: "MODERADO",
                    title: "Equilibrado",
                    desc: "Paseos diarios habituales, momentos de juego y siestas",
                    icon: "🚶",
                  },
                  {
                    id: "ACTIVO",
                    title: "Activo / Enérgico",
                    desc: "Salidas a correr, excursiones, parque y mucho juego",
                    icon: "⚡",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAnswers({ ...answers, energyLevel: item.id })}
                    className={`p-5 rounded-2xl border-2 text-center transition-all ${
                      answers.energyLevel === item.id
                        ? "border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20"
                        : "border-slate-200 hover:border-amber-200 bg-white"
                    }`}
                  >
                    <span className="text-3xl block mb-2">{item.icon}</span>
                    <strong className="block text-sm text-slate-900">{item.title}</strong>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-1">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 3: Hogar y Tamaño */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-900 text-center">
                ¿Dónde vivirá la mascota y qué tamaño prefieres?
              </h2>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">Tipo de espacio:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "DEPTO", label: "Departamento", icon: "🏢" },
                    { id: "CASA", label: "Casa con patio", icon: "🏡" },
                    { id: "CAMPO", label: "Quinta o campo", icon: "🌳" },
                  ].map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setAnswers({ ...answers, housing: h.id })}
                      className={`p-3 rounded-xl border text-center transition-all text-xs font-semibold ${
                        answers.housing === h.id
                          ? "border-orange-500 bg-orange-50 text-orange-900 font-bold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="block text-base">{h.icon}</span>
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Preferencia de tamaño:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "PEQUENO", label: "Pequeño" },
                    { id: "MEDIANO", label: "Mediano" },
                    { id: "GRANDE", label: "Grande" },
                    { id: "CUALQUIERA", label: "Cualquiera" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAnswers({ ...answers, preferredSize: s.id })}
                      className={`p-2.5 rounded-xl border text-center transition-all text-xs ${
                        answers.preferredSize === s.id
                          ? "border-orange-500 bg-orange-50 text-orange-900 font-bold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Paso 4: Convivencia y Familia */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-900 text-center">
                ¿Con quién convivirá en el hogar?
              </h2>
              <p className="text-xs text-slate-500 text-center -mt-2">
                Selecciona todos los que apliquen para filtrar animales con temperamento adecuado:
              </p>

              <div className="space-y-2.5">
                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-orange-50/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={answers.hasKids}
                    onChange={(e) => setAnswers({ ...answers, hasKids: e.target.checked })}
                    className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                  />
                  <div>
                    <strong className="text-xs text-slate-900 block">Viven niños pequeños o bebés</strong>
                    <span className="text-[11px] text-slate-500">Mascotas pacientes, dóciles y juguetonas</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-orange-50/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={answers.hasDogs}
                    onChange={(e) => setAnswers({ ...answers, hasDogs: e.target.checked })}
                    className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                  />
                  <div>
                    <strong className="text-xs text-slate-900 block">Ya tengo otro perro en casa</strong>
                    <span className="text-[11px] text-slate-500">Animales sociables con pares caninos</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-orange-50/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={answers.hasCats}
                    onChange={(e) => setAnswers({ ...answers, hasCats: e.target.checked })}
                    className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                  />
                  <div>
                    <strong className="text-xs text-slate-900 block">Ya tengo otro gato en casa</strong>
                    <span className="text-[11px] text-slate-500">Mascotas que conviven pacíficamente con felinos</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navegación entre pasos */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Anterior
              </button>
            ) : <div />}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Siguiente <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCompleted(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/25 transition-all"
              >
                <Sparkles className="w-4 h-4" /> Ver Mis Mascotas Compatibles
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Resultados de Compatibilidad */
        <div className="space-y-6">
          <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ¡Test Finalizado con Éxito!
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Encontramos {matchedPets.length} mascotas ideales para tu perfil
              </h2>
              <p className="text-xs text-slate-600">
                Ordenadas por porcentaje de afinidad con tu rutina y estilo de vida.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Rehacer el Test
            </button>
          </div>

          {matchedPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedPets.map(({ pet, percentage }) => (
                <div key={pet.id} className="relative flex flex-col">
                  {/* Badge de Porcentaje de Compatibilidad */}
                  <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-white" />
                    {percentage}% Match
                  </div>

                  <PetCard pet={pet} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Heart className="w-12 h-12 text-rose-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No encontramos coincidencias exactas para este filtro
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Prueba a flexibilizar la especie o el tamaño en el test para descubrir más compañeros que buscan hogar.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl"
              >
                Modificar Respuestas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
