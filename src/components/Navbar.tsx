"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  PawPrint,
  Heart,
  Compass,
  PlusCircle,
  Bell,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Sparkles,
  FileText,
  MapPin,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isVerifiedShelter = (session?.user as any)?.isVerifiedShelter;
  const canModerate = userRole === "ADMIN" || userRole === "REFUGIO" || Boolean(isVerifiedShelter);

  const navLinks = [
    { href: "/adopciones", label: "Adopciones", icon: Heart },
    { href: "/perdidos", label: "Perdidos & Encontrados", icon: Compass },
    { href: "/mascota-ideal", label: "Mi Mascota Ideal", icon: Sparkles, highlight: true },
    { href: "/mi-formulario", label: "Mi Formulario", icon: FileText },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fdfcf9]/95 backdrop-blur-md border-b border-[#eee7dd] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Refugio Patitas - Tonos Cálidos Pasteles */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-rose-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <PawPrint className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-[#2d2420] group-hover:text-orange-600 transition-colors">
                Refugio <span className="text-orange-600">Patitas</span>
              </span>
              <span className="text-[10px] font-bold text-amber-700 -mt-1 tracking-wide">
                Amor en cuatro patas • Uruguay
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    link.highlight
                      ? "text-orange-900 bg-orange-100/70 hover:bg-orange-100 border border-orange-200"
                      : active
                      ? "text-orange-700 bg-orange-50 border border-orange-200/60"
                      : "text-[#4a3f35] hover:text-orange-700 hover:bg-[#f6eee4]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${link.highlight ? "text-orange-600" : ""}`} />
                  {link.label}
                </Link>
              );
            })}

            {canModerate && (
              <Link
                href="/admin/solicitudes"
                className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  pathname === "/admin/solicitudes"
                    ? "text-rose-800 bg-rose-50 border border-rose-200"
                    : "text-rose-700 hover:text-rose-900 hover:bg-rose-50"
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Solicitudes</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              Publicar Mascota
            </Link>

            {session?.user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#e4dcce]">
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-[#f6eee4] transition-colors text-[#3e342f] text-xs font-bold"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{session.user.name || "Mi Cuenta"}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Cerrar Sesión"
                  className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#4a3f35] hover:text-orange-700 hover:bg-[#f6eee4] rounded-xl transition-colors border border-[#e4dcce]"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Ingresar
              </Link>
            )}
          </div>

          {/* Mobile menu toggle & Quick action */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/publicar"
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 touch-manipulation"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar</span>
            </Link>
            
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl bg-[#f5eee3] border border-[#e2d8c9] text-[#3e342f] flex items-center justify-center hover:bg-[#eee3d4] active:scale-95 transition-all touch-manipulation cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-stone-800" /> : <Menu className="w-5 h-5 text-stone-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#eee7dd] bg-[#fbf9f5] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold touch-manipulation active:scale-98 ${
                  active
                    ? "text-orange-700 bg-orange-100/60 border border-orange-200"
                    : "text-[#3e342f] hover:bg-[#f4ebe0] active:bg-[#ede1d3]"
                }`}
              >
                <Icon className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <Link
            href="/perdidos?view=map"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#3e342f] hover:bg-[#f4ebe0] active:bg-[#ede1d3] touch-manipulation"
          >
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Mapa con Radio de 300m</span>
          </Link>

          {canModerate && (
            <Link
              href="/admin/solicitudes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-800 bg-rose-50 border border-rose-200 touch-manipulation"
            >
              <Bell className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Bandeja de Solicitudes (Admin)</span>
            </Link>
          )}

          <div className="pt-3 border-t border-[#eee7dd]">
            {session?.user ? (
              <div className="space-y-2">
                <Link
                  href="/perfil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#3e342f] bg-white rounded-xl border border-[#eee7dd] touch-manipulation"
                >
                  <UserIcon className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Mi Cuenta ({session.user.name || session.user.email})</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-xs font-bold text-rose-700 bg-rose-50/70 hover:bg-rose-100 rounded-xl cursor-pointer touch-manipulation"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 text-center font-bold text-orange-900 bg-orange-100/70 hover:bg-orange-100 border border-orange-200 rounded-xl text-xs touch-manipulation shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>Iniciar Sesión / Registrarse</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
