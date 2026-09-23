"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";

interface MapSelectorProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelected: (location: { lat: number; lng: number; address?: string }) => void;
  height?: string;
}

export default function MapSelector({
  initialLat = -34.6037, // Buenos Aires por defecto, o personalizable
  initialLng = -58.3816,
  onLocationSelected,
  height = "380px",
}: MapSelectorProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const circleRef = useRef<any>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      // Fix para íconos estándar de Leaflet en Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 15);
        mapInstanceRef.current = map;

        // OpenStreetMap TileLayer (100% Gratuito, sin API Key)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Marcador inicial
        const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
        markerRef.current = marker;

        // Círculo exacto de radio de 300 metros
        const circle = L.circle([initialLat, initialLng], {
          radius: 300,
          color: "#0d9488", // teal-600
          fillColor: "#14b8a6", // teal-500
          fillOpacity: 0.18,
          weight: 2,
          dashArray: "4, 4",
        }).addTo(map);
        circleRef.current = circle;

        const updatePosition = (lat: number, lng: number) => {
          if (!isMounted) return;
          setCoords({ lat, lng });
          marker.setLatLng([lat, lng]);
          circle.setLatLng([lat, lng]);
          onLocationSelected({ lat, lng });
        };

        // Evento click en mapa
        map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
          updatePosition(e.latlng.lat, e.latlng.lng);
        });

        // Evento arrastrar marcador
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          updatePosition(pos.lat, pos.lng);
        });
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialLat, initialLng]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
          if (markerRef.current) markerRef.current.setLatLng([latitude, longitude]);
          if (circleRef.current) circleRef.current.setLatLng([latitude, longitude]);
        }
        onLocationSelected({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.warn("No se pudo obtener ubicación:", err);
      }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin className="w-4 h-4 text-teal-600" />
          <span>Haz clic en el mapa para situar la zona exacta (Radio de <strong>300m</strong>)</span>
        </div>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="inline-flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900 font-semibold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors"
        >
          <Navigation className="w-3 h-3" />
          Usar mi ubicación actual
        </button>
      </div>

      <div
        ref={mapContainerRef}
        style={{ height, width: "100%" }}
        className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0"
      />

      <div className="text-[11px] text-slate-400 flex items-center justify-between">
        <span>Coordenadas seleccionadas: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>
        <span>Mapa Libre & Gratuito (OpenStreetMap)</span>
      </div>
    </div>
  );
}
