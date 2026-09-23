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
  ArrowRight,
  Sparkles,
  Calendar,
  FileText,
  AlertTriangle,
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

    const urgentPets = await prisma.pet.findMany({
      where: {
        type: "ADOPCION",
        status: "PUBLICADO",
        OR: [
          { isUrgent: true },
          { ageGroup: "SENIOR" },
          { healthCondition: { not: null } },
        ],
      },
      include: {
        images: true,
        user: true,
      },
      take: 3,
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

    return { adoptionPets, urgentPets, lostPets, totalAdoptions };
  } catch (error) {
    console.error("Error al cargar datos en Home:", error);
    return { adoptionPets: [], urgentPets: [], lostPets: [], totalAdoptions: 0 };
  }
}

export default async function HomePage() {
  const { adoptionPets, urgentPets, lostPets, totalAdoptions } = await getFeaturedPets();

  return (
    <div className="space-y-16 pb-16 bg-[#fbf8f4]">
      {/* Hero Section Cálido Beige y Crema */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8eee0] via-[#fbf5eb] to-[#fbf8f4] pt-12 pb-20 border-b border-[#eee4d6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#e8dfd2] text-amber-950 text-xs font-bold tracking-wide uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              Bienvenidos a Refugio Patitas
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#2d2420] tracking-tight leading-tight">
              Cada huella merece un hogar, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-rose-500">
                cada familia un reencuentro.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5a4c41] leading-relaxed max-w-2xl mx-auto">
              Conectamos animales rescatados en Uruguay con familias compatibles, coordinamos <strong>visitas previas con turnos</strong> y activamos alertas de mascotas perdidas con mapa de <strong>radio de 300 metros</strong>.
            </p>

            {/* Botones de Acción Rápida */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                href="/mascota-ideal"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-400 hover:from-orange-600 hover:to-rose-500 text-white font-black rounded-2xl shadow-sm transition-all text-sm active:scale-95 touch-manipulation cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Test "Mi Mascota Ideal"</span>
              </Link>
              <Link
                href="/adopciones"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#f6eee4] text-[#2d2420] font-bold rounded-2xl border border-[#ded5c7] shadow-xs transition-all text-sm active:scale-95 touch-manipulation cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Ver Adopciones</span>
              </Link>
              <Link
                href="/perdidos"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#fcf0ee] text-[#2d2420] font-bold rounded-2xl border border-rose-200 shadow-xs transition-all text-sm active:scale-95 touch-manipulation cursor-pointer"
              >
                <Compass className="w-4 h-4 text-rose-600" />
                <span>Perdidos (Radio 300m)</span>
              </Link>
            </div>

            {/* Accesos rápidos secundarios */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-bold text-[#6b5849]">
              <Link href="/mi-formulario" className="hover:text-orange-700 flex items-center gap-1.5 transition-colors">
                <FileText className="w-3.5 h-3.5 text-orange-600" />
                <span>Mi Formulario de Adoptante</span>
              </Link>
              <span className="text-stone-300">•</span>
              <Link href="/publicar" className="hover:text-orange-700 flex items-center gap-1.5 transition-colors">
                <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Publicar Mascota para Admisión</span>
              </Link>
            </div>

            {/* Métricas Cálidas */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-center border-t border-[#eee2d3] mt-8">
              <div>
                <span className="block text-2xl font-black text-orange-700">
                  {Math.max(totalAdoptions, 120)}+
                </span>
                <span className="text-xs text-[#63554b] font-medium">Patitas en Adopción</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-amber-700">300m</span>
                <span className="text-xs text-[#63554b] font-medium">Radio de Búsqueda Local</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-2xl font-black text-rose-700">100%</span>
                <span className="text-xs text-[#63554b] font-medium">Admitido por Admin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Destacado: Test Mi Mascota Ideal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-400 rounded-3xl p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Nuevo en Refugio Patitas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              ¿No sabes qué mascota se adapta mejor a tu vida?
            </h2>
            <p className="text-orange-50 text-xs sm:text-sm max-w-xl">
              Haz nuestro test de afinidad en 1 minuto. Evaluamos tu tiempo libre, tipo de casa, presencia de niños y rutina para mostrarte tus matches ideales.
            </p>
          </div>

          <Link
            href="/mascota-ideal"
            className="min-h-[46px] inline-flex items-center px-6 py-3.5 bg-white hover:bg-orange-50 text-orange-700 font-black rounded-2xl text-xs uppercase tracking-wider shadow-sm transition-all shrink-0 active:scale-95 touch-manipulation cursor-pointer"
          >
            Comenzar Test Gratis →
          </Link>
        </div>
      </section>

      {/* Alertas Urgentes: Mascotas Perdidas y Encontradas */}
      {lostPets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#fef5f4] border border-[#f5ded9] rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  Alertas Comunitarias Activas
                </div>
                <h2 className="text-2xl font-black text-[#2d2420]">
                  Mascotas Perdidas y Encontradas Recientemente
                </h2>
                <p className="text-[#63554b] text-xs">
                  Revisa si reconoces a alguno de estos animales en tu barrio o visualízalos en el mapa con radio de 300 metros.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/perdidos?view=map"
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 touch-manipulation cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ver en Mapa (300m)</span>
                </Link>
                <Link
                  href="/perdidos"
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 hover:underline px-2 py-2"
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

      {/* Sección Dorada: Adopciones Urgentes y Viejitos (Pastel Beige) */}
      {urgentPets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#fbf4ea] via-[#fdf7ee] to-[#fcf3f0] border border-[#e8ddce] rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
                  Patitas Doradas • Casos Especiales y Urgentes
                </div>
                <h2 className="text-2xl font-black text-[#2d2420] flex items-center gap-2">
                  <span>Adopciones Urgentes y Viejitos</span>
                  <span className="text-xl">👴💖</span>
                </h2>
                <p className="text-[#63554b] text-xs sm:text-sm">
                  Peluditos senior o con condiciones especiales que necesitan con mayor urgencia el calor de un hogar lleno de amor.
                </p>
              </div>

              <Link
                href="/adopciones"
                className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 touch-manipulation cursor-pointer shrink-0"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Ver todos los casos urgentes</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {urgentPets.map((pet) => (
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
            <div className="flex items-center gap-2 text-orange-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Heart className="w-3.5 h-3.5 fill-orange-500" />
              Adopción Responsable
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2d2420]">
              Esperan por una familia que los ame
            </h2>
            <p className="text-[#63554b] text-xs sm:text-sm">
              Agenda una visita previa para conocerlos en persona en la sede de Refugio Patitas.
            </p>
          </div>

          <Link
            href="/adopciones"
            className="min-h-[42px] inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#f6eee4] hover:bg-[#ede3d5] text-orange-950 text-xs font-bold rounded-xl border border-[#ded5c7] transition-all active:scale-95 touch-manipulation cursor-pointer"
          >
            <span>Explorar todas las adopciones</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {adoptionPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adoptionPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#eee6dc] space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#fbf5ec] text-orange-600 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#2d2420]">Sé el primero en publicar una mascota</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Ayuda a un animal abandonado. La publicación será admitida rápidamente por los administradores.
            </p>
            <Link
              href="/publicar"
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-orange-600 active:scale-95 touch-manipulation cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Publicar Mascota Ahora
            </Link>
          </div>
        )}
      </section>

      {/* Pilares de Refugio Patitas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#eee6dc] shadow-xs flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#2d2420] text-base">Visitas Previas con Turno</h3>
            <p className="text-xs text-[#63554b] leading-relaxed">
              Selecciona el día y horario que mejor te convenga para conocer e interactuar con la mascota antes de formalizar la adopción.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#eee6dc] shadow-xs flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#2d2420] text-base">Formulario Reutilizable</h3>
            <p className="text-xs text-[#63554b] leading-relaxed">
              Guarda tus datos de vivienda y estilo de vida una vez. Puedes rehacer o editar tu formulario en cualquier momento desde tu perfil.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#eee6dc] shadow-xs flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#2d2420] text-base">Admisión y Seguridad Total</h3>
            <p className="text-xs text-[#63554b] leading-relaxed">
              Cada publicación recibida es validada por los administradores de Refugio Patitas en su bandeja de solicitudes para evitar fraudes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
