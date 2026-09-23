"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { PawPrint, Lock, Mail, User, ShieldCheck, Loader2, Sparkles, Building2 } from "lucide-react";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isShelter, setIsShelter] = useState(false);
  const [shelterName, setShelterName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCredentialsAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (mode === "register") {
        const regRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            name,
            isShelter,
            shelterName: isShelter ? shelterName : null,
          }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          throw new Error(regData.error || "Error al crear la cuenta");
        }
      }

      // Iniciar sesión con NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Ocurrió un error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoPass: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: demoEmail,
        password: demoPass,
      });

      if (result?.error) {
        throw new Error("La cuenta demo aún no está creada. Inicializa los datos de prueba.");
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Error al iniciar sesión de prueba");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/25">
          <PawPrint className="w-6 h-6 fill-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          {mode === "login" ? "Bienvenido a Refugio" : "Crear Cuenta en Refugio"}
        </h1>
        <p className="text-xs text-slate-500">
          {mode === "login"
            ? "Inicia sesión para gestionar publicaciones o adoptar"
            : "Súmate como adoptante o registra tu refugio de rescate"}
        </p>
      </div>

      {/* Tabs Login / Registro */}
      <div className="bg-slate-100 p-1 rounded-2xl flex">
        <button
          onClick={() => {
            setMode("login");
            setErrorMessage("");
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === "login"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => {
            setMode("register");
            setErrorMessage("");
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === "register"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Crear Cuenta
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
          {errorMessage}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleCredentialsAuth} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre o Apodo *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Sofía Castillo"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {mode === "register" && (
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isShelter}
                onChange={(e) => setIsShelter(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                Soy un Refugio, ONG o Rescatista Independiente
              </span>
            </label>

            {isShelter && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de la Organización o Refugio *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={shelterName}
                    onChange={(e) => setShelterName(e.target.value)}
                    placeholder="Ej. Refugio Huellitas Felices"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : mode === "login" ? (
            "Ingresar"
          ) : (
            "Crear Cuenta"
          )}
        </button>

        {/* Separador Google */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400">o continuar con</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.27 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>
          Google
        </button>
      </form>

      {/* Cuentas Rápidas de Prueba (Dev/Demo Helper) */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Acceso Rápido para Pruebas (1 Clic)</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Prueba de inmediato los diferentes roles sin tener que registrarte manualmente:
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickDemo("admin@refugio.com", "admin123")}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-teal-500 text-slate-800 font-semibold text-left transition-colors"
          >
            🛡️ Administrador
            <span className="block text-[10px] text-slate-400 font-normal">Moderación total</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("refugio@huellas.org", "refugio123")}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-800 font-semibold text-left transition-colors"
          >
            🐾 Refugio Verificado
            <span className="block text-[10px] text-slate-400 font-normal">Aprobación comunitaria</span>
          </button>
        </div>
      </div>
    </div>
  );
}
