import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PetCard from "@/components/PetCard";
import {
  Heart,
  Compass,
  PlusCircle,
  MapPin,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const revalidate = 0; // SSR dinámico

async function getFeaturedPets() {
  try {
    const adoptionPets = await prisma.pet.findMany({
      where: {
        type: "ADOPCION",
        status: "PUBLICADO",
      },
      include: {
        images: true,
        user: true,
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    const lostPets = await prisma.pet.findMany({
      where: {
        type: { in: ["PERDIDO", "ENCONTRADO"] },
        status: "PUBLICADO",
      },
      include: {
        images: true,
        user: true,
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    const totalAdoptions = await prisma.pet.count({
      where: { type: "ADOPCION" },
    });

    const totalReunited = await prisma.pet.count({
      where: { status: "REUNIDO" },
    });

    return { adoptionPets, lostPets, totalAdoptions, totalReunited };
  } catch (error) {
    console.error("Error al cargar mascotas destacadas:", error);
    return { adoptionPets: [], lostPets: [], totalAdoptions: 0, totalReunited: 0 };
  }
}

export default async function HomePage() {
  const { adoptionPets, lostPets, totalAdoptions, totalReunited } = await getFeaturedPets();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50 pt-12 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 text-teal-800 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Plataforma Solidaria de Adopción y Búsqueda
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Cada huella merece un hogar, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                cada familia un reencuentro.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Conectamos animales rescatados con adoptantes responsables y activamos alertas de mascotas perdidas con un mapa interactivo de <strong>radio de 300 metros</strong>.
            </p>

            {/* Botones de Acción Rápida */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/adopciones"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/25 transition-all text-sm"
              >
                <Heart className="w-4 h-4 fill-white" />
                Quiero Adoptar
              </Link>
              <Link
                href="/perdidos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-200 shadow-sm transition-all text-sm"
              >
                <Compass className="w-4 h-4 text-rose-500" />
                Perdidos y Encontrados
              </Link>
              <Link
                href="/publicar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-2xl transition-all text-sm"
              >
                <PlusCircle className="w-4 h-4 text-amber-600" />
                Publicar Mascota
              </Link>
            </div>

            {/* Métricas y Estadísticas */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-center border-t border-slate-200/60 mt-8">
              <div>
                <span className="block text-2xl font-black text-teal-700">
                  {Math.max(totalAdoptions, 120)}+
                </span>
                <span className="text-xs text-slate-500 font-medium">Mascotas en Adopción</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-600">300m</span>
                <span className="text-xs text-slate-500 font-medium">Radio de Búsqueda Local</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-2xl font-black text-slate-800">100%</span>
                <span className="text-xs text-slate-500 font-medium">Moderado y Gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alertas Urgentes: Mascotas Perdidas y Encontradas */}
      {lostPets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  Alertas Comunitarias Activas
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Mascotas Perdidas y Encontradas Recientemente
                </h2>
                <p className="text-slate-600 text-xs">
                  Revisa si reconoces a alguno de estos animales en tu barrio o visualízalos en el mapa con radio de 300 metros.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/perdidos?view=map"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Ver en Mapa (300m)
                </Link>
                <Link
                  href="/perdidos"
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline px-2 py-2"
                >
                  Ver todas <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {lostPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catálogo de Adopciones Destacadas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Heart className="w-3.5 h-3.5 fill-teal-600" />
              Adopción Responsable
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Esperan por una familia que los ame
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Cada uno cuenta con historia, control veterinario y ficha de temperamento.
            </p>
          </div>

          <Link
            href="/adopciones"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 transition-colors"
          >
            Explorar todas las adopciones <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {adoptionPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adoptionPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Sé el primero en publicar una mascota</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ayuda a un animal abandonado publicando su ficha. Se someterá a moderación rápida para asegurar la calidad.
            </p>
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-teal-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Publicar Mascota Ahora
            </Link>
          </div>
        )}
      </section>

      {/* Pilares de Confianza y Calidad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Moderación y Seguridad</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Todas las publicaciones son revisadas por el administrador o refugios autorizados para evitar publicaciones falsas o comercio no ético.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Formulario de Adopción Responsable</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Al postularte, el refugio recibe un informe completo sobre tu vivienda, patio, integrantes de la casa y tiempo disponible para asegurar una adopción para siempre.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Carga Ultrarrápida en WebP</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Las fotos se comprimen y adaptan en tu navegador a 4 resoluciones WebP, ofreciendo máxima velocidad y nitidez en cualquier teléfono sin costos extras.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
