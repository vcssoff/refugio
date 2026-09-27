import React from "react";
import Link from "next/link";
import { PawPrint, Heart, Shield, MapPin, Mail, Sparkles, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <PawPrint className="w-5 h-5 fill-white" />
              </div>
              <span className="font-black text-xl text-white">Refugio Patitas</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comunidad dedicada a encontrar hogares amorosos para animales rescatados, coordinar visitas previas y reunir familias con sus mascotas perdidas mediante geolocalización de 300 metros.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <Shield className="w-4 h-4" />
              <span>Publicaciones admitidas por administradores</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-4">
              Navegación
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/adopciones" className="hover:text-orange-300 transition-colors">
                  🐾 Mascotas en Adopción
                </Link>
              </li>
              <li>
                <Link href="/mascota-ideal" className="hover:text-orange-300 transition-colors font-semibold text-orange-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Test &quot;Mi Mascota Ideal&quot;
                </Link>
              </li>
              <li>
                <Link href="/mi-formulario" className="hover:text-orange-300 transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Mi Formulario de Adopción
                </Link>
              </li>
              <li>
                <Link href="/perdidos" className="hover:text-orange-300 transition-colors">
                  🚨 Animales Perdidos y Encontrados
                </Link>
              </li>
              <li>
                <Link href="/perdidos?view=map" className="hover:text-orange-300 transition-colors">
                  📍 Mapa con Radio de 300m
                </Link>
              </li>
            </ul>
          </div>

          {/* Protocolo de Emergencia */}
          <div>
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-4">
              Consejos de Adopción
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-orange-400 font-bold">1.</span>
                <span>Haz el test de &quot;Mi Mascota Ideal&quot; para evaluar afinidad y energía.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-orange-400 font-bold">2.</span>
                <span>Agenda una Visita Previa para conocer a la mascota en persona.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-orange-400 font-bold">3.</span>
                <span>Mantén tu formulario de adoptante actualizado en tu perfil.</span>
              </li>
            </ul>
          </div>

          {/* Compromiso y Contacto */}
          <div>
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-4">
              Sede y Contacto
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              ¿Quieres colaborar o ser voluntario en <strong>Refugio Patitas</strong>? Escríbenos para sumarte a la red de rescate.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-orange-400 shrink-0" />
              <span>contacto@refugiopatitas.org</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Refugio Patitas. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>para salvar vidas de cuatro patas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
