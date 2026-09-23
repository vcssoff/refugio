import React from "react";
import Link from "next/link";
import { PawPrint, Heart, Shield, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white">
                <PawPrint className="w-5 h-5 fill-white" />
              </div>
              <span className="font-extrabold text-xl text-white">Refugio</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma comunitaria dedicada a encontrar hogares amorosos para animales rescatados y reunir familias con sus mascotas perdidas a través de geolocalización local.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <Shield className="w-4 h-4" />
              <span>Publicaciones moderadas y seguras</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4">
              Navegación
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/adopciones" className="hover:text-teal-400 transition-colors">
                  🐾 Mascotas en Adopción
                </Link>
              </li>
              <li>
                <Link href="/perdidos" className="hover:text-teal-400 transition-colors">
                  🚨 Animales Perdidos
                </Link>
              </li>
              <li>
                <Link href="/perdidos?view=map" className="hover:text-teal-400 transition-colors">
                  📍 Mapa con Radio de 300m
                </Link>
              </li>
              <li>
                <Link href="/publicar" className="hover:text-teal-400 transition-colors">
                  ➕ Publicar una Mascota
                </Link>
              </li>
              <li>
                <Link href="/moderacion" className="hover:text-teal-400 transition-colors">
                  🛡️ Panel de Moderación
                </Link>
              </li>
            </ul>
          </div>

          {/* Protocolo de Emergencia */}
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4">
              Guía de Emergencia
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-teal-400 font-bold">1.</span>
                <span>Publica de inmediato con fotos claras y fecha exacta.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-teal-400 font-bold">2.</span>
                <span>Explora el mapa en un radio inicial de 300 metros alrededor del último punto visto.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-teal-400 font-bold">3.</span>
                <span>Deja prendas con tu olor cerca de la zona donde se perdió.</span>
              </li>
            </ul>
          </div>

          {/* Compromiso y Contacto */}
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4">
              Contacto y Comunidad
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              ¿Eres un refugio o rescatista independiente? Contáctanos para verificar tu cuenta y gestionar adopciones directamente.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <span>contacto@refugio.org</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Refugio. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>para salvar vidas animales</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
