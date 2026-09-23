"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

export interface PetMapItem {
  id: string;
  title: string;
  type: string; // "PERDIDO" | "ENCONTRADO"
  species: string;
  latitude: number | null;
  longitude: number | null;
  city?: string | null;
  address?: string | null;
  imageUrl?: string | null;
}

interface MapExplorerProps {
  pets: PetMapItem[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  height?: string;
}

export default function MapExplorer({
  pets,
  centerLat = -34.6037,
  centerLng = -58.3816,
  zoom = 13,
  height = "520px",
}: MapExplorerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initExplorerMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      // Fix icon URLs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], zoom);
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const validPets = pets.filter((p) => p.latitude !== null && p.longitude !== null);

        if (validPets.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const bounds: any[] = [];

          validPets.forEach((pet) => {
            const lat = pet.latitude!;
            const lng = pet.longitude!;
            bounds.push([lat, lng]);

            const isLost = pet.type === "PERDIDO";
            const strokeColor = isLost ? "#e11d48" : "#d97706";
            const fillColor = isLost ? "#f43f5e" : "#f59e0b";
            const badgeBg = isLost ? "#ffe4e6" : "#fef3c7";
            const badgeText = isLost ? "#9f1239" : "#92400e";
            const typeLabel = isLost ? "PERDIDO" : "ENCONTRADO";

            // Círculo exacto de 300 metros
            L.circle([lat, lng], {
              radius: 300,
              color: strokeColor,
              fillColor: fillColor,
              fillOpacity: 0.16,
              weight: 2,
              dashArray: "3, 3",
            }).addTo(map);

            // Marcador
            const marker = L.marker([lat, lng]).addTo(map);

            // Popup interactivo
            const popupContent = `
              <div style="font-family: system-ui, sans-serif; min-width: 180px; max-width: 220px;">
                ${
                  pet.imageUrl
                    ? `<div style="width: 100%; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
                        <img src="${pet.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
                       </div>`
                    : ""
                }
                <div style="display: inline-block; background-color: ${badgeBg}; color: ${badgeText}; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">
                  ${typeLabel} (Radio 300m)
                </div>
                <h4 style="margin: 2px 0 6px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${pet.title}</h4>
                <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">${pet.city || pet.address || "Zona reportada"}</p>
                <a href="/mascota/${pet.id}" style="display: block; text-align: center; background-color: #0d9488; color: white; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">
                  Ver ficha completa
                </a>
              </div>
            `;
            marker.bindPopup(popupContent);
          });

          if (bounds.length > 1) {
            map.fitBounds(bounds, { padding: [40, 40] });
          } else if (bounds.length === 1) {
            map.setView(bounds[0], 15);
          }
        }
      }
    }

    initExplorerMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pets, centerLat, centerLng, zoom]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      <div
        ref={mapContainerRef}
        style={{ height, width: "100%" }}
        className="z-0"
      />
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs flex items-center gap-3 z-10">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block border border-rose-600" />
          Mascota Perdida (300m)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-amber-600" />
          Mascota Encontrada (300m)
        </span>
      </div>
    </div>
  );
}
