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
  ShieldAlert,
  Menu,
  X,
  User as UserIcon,
  LogOut,
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
    { href: "/perdidos", label: "Perdidos y Encontrados", icon: Compass },
    { href: "/perdidos?view=map", label: "Mapa 300m", icon: MapPin },
  ];

  const isActive = (href: string) => {
    if (href === "/perdidos?view=map") {
      return pathname === "/perdidos" && typeof window !== "undefined" && window.location.search.includes("view=map");
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <PawPrint className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                Refugio
              </span>
              <span className="text-[10px] font-semibold text-teal-600 -mt-1 tracking-wide">
                Adopción & Rescate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "text-teal-700 bg-teal-50"
                      : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}

            {canModerate && (
              <Link
                href="/moderacion"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  pathname === "/moderacion"
                    ? "text-amber-700 bg-amber-50"
                    : "text-amber-600 hover:text-amber-700 hover:bg-amber-50/60"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Moderación
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-teal-600/30 hover:shadow-md transition-all active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              Publicar Mascota
            </Link>

            {session?.user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-colors text-slate-700 text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{session.user.name || "Mi Cuenta"}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Cerrar Sesión"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                Ingresar
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/publicar"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Publicar
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-semibold ${
                  active
                    ? "text-teal-700 bg-teal-50"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-5 h-5 text-teal-600" />
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/moderacion"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-semibold text-amber-700 bg-amber-50/60"
          >
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            Panel de Moderación
          </Link>

          <div className="pt-3 border-t border-slate-100">
            {session?.user ? (
              <div className="space-y-2">
                <Link
                  href="/perfil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  <UserIcon className="w-4 h-4 text-teal-600" />
                  Mi Cuenta ({session.user.name || session.user.email})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-center font-semibold text-teal-700 bg-teal-50 rounded-xl"
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
