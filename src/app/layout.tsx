import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Refugio Patitas - Adopción Responsable, Visitas y Búsqueda Comunitaria",
  description:
    "Descubre a tu compañero ideal con nuestro test de afinidad, agenda visitas previas y reporta mascotas perdidas en el mapa interactivo de 300 metros. Comunidad Refugio Patitas.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fffdfa] text-stone-900 font-sans">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
