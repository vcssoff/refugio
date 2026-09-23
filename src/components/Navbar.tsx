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
import ThemeToggle from "./ThemeToggle";

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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-orange-100/80 dark:border-stone-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Rebrandeado: Refugio Patitas con colores cálidos */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <PawPrint className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-stone-100 group-hover:text-orange-600 transition-colors">
                Refugio <span className="text-orange-500">Patitas</span>
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 -mt-1 tracking-wide">
                Amor en cuatro patas
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    link.highlight
                      ? "text-orange-700 bg-orange-50/80 hover:bg-orange-100 border border-orange-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60"
                      : active
                      ? "text-orange-600 bg-orange-50 dark:bg-stone-800 dark:text-orange-400"
                      : "text-slate-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/40 dark:hover:bg-stone-800/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${link.highlight ? "text-orange-500" : ""}`} />
                  {link.label}
                </Link>
              );
            })}

            {canModerate && (
              <Link
                href="/admin/solicitudes"
                className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  pathname === "/admin/solicitudes"
                    ? "text-rose-700 bg-rose-50 border border-rose-200"
                    : "text-rose-600 hover:text-rose-700 hover:bg-rose-50/60"
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg transition-all active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              Publicar Mascota
            </Link>

            {/* Theme Toggle (Modo Claro / Oscuro) */}
            <ThemeToggle />

            {session?.user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-stone-700">
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-orange-50/50 dark:hover:bg-stone-800 transition-colors text-slate-700 dark:text-stone-200 text-xs font-semibold"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{session.user.name || "Mi Cuenta"}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Cerrar Sesión"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-stone-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-stone-800 rounded-xl transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Ingresar
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Link
              href="/publicar"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Publicar
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-orange-50 transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-orange-100 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold ${
                  active
                    ? "text-orange-600 bg-orange-50 dark:bg-stone-800 dark:text-orange-400"
                    : "text-slate-700 dark:text-stone-200 hover:bg-slate-50 dark:hover:bg-stone-800/60"
                }`}
              >
                <Icon className="w-4 h-4 text-orange-500" />
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/perdidos?view=map"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-stone-200 hover:bg-slate-50 dark:hover:bg-stone-800/60"
          >
            <MapPin className="w-4 h-4 text-orange-500" />
            Mapa con Radio de 300m
          </Link>

          {canModerate && (
            <Link
              href="/admin/solicitudes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300"
            >
              <Bell className="w-4 h-4 text-rose-500" />
              Bandeja de Solicitudes (Admin)
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100">
            {session?.user ? (
              <div className="space-y-2">
                <Link
                  href="/perfil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700"
                >
                  <UserIcon className="w-4 h-4 text-orange-500" />
                  Mi Cuenta ({session.user.name || session.user.email})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-center font-bold text-orange-700 bg-orange-50 rounded-xl text-xs"
              >
                <UserIcon className="w-4 h-4" />
                Iniciar Sesión / Registrarse
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
