"use client";

import React, { useState } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { processImageToWebPSet, ProcessedWebpSet } from "@/lib/image-processor";

export interface UploadedPetImage {
  thumb: string;
  card: string;
  detail: string;
  original: string;
}

interface ImageUploaderWebPProps {
  onImagesUploaded: (images: UploadedPetImage[]) => void;
  maxImages?: number;
}

interface ItemToProcess {
  id: string;
  file: File;
  previewUrl: string;
  status: "processing" | "ready" | "uploading" | "done" | "error";
  processed?: ProcessedWebpSet;
  uploaded?: UploadedPetImage;
  progressMessage?: string;
}

export default function ImageUploaderWebP({
  onImagesUploaded,
  maxImages = 6,
}: ImageUploaderWebPProps) {
  const [items, setItems] = useState<ItemToProcess[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - items.length;
    const selectedList = Array.from(files).slice(0, remainingSlots);

    const newItems: ItemToProcess[] = selectedList.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      status: "processing",
      progressMessage: "Convirtiendo a WebP (320w, 640w, 1024w, 1600w)...",
    }));

    setItems((prev) => [...prev, ...newItems]);

    // Procesar cada imagen en cliente a WebP
    for (const item of newItems) {
      try {
        const processed = await processImageToWebPSet(item.file);
        setItems((current) =>
          current.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  status: "ready",
                  processed,
                  previewUrl: processed.previewUrl,
                  progressMessage: "WebP optimizado listo para subir",
                }
              : it
          )
        );
      } catch (err) {
        console.error("Error al procesar:", err);
        setItems((current) =>
          current.map((it) =>
            it.id === item.id
              ? { ...it, status: "error", progressMessage: "Error al convertir" }
              : it
          )
        );
      }
    }
  };

  const uploadReadyImages = async () => {
    const readyItems = items.filter((it) => it.status === "ready" && it.processed && !it.uploaded);
    if (readyItems.length === 0) return;

    setIsUploading(true);

    const newUploadedList: UploadedPetImage[] = [];

    for (const item of readyItems) {
      if (!item.processed) continue;

      setItems((curr) =>
        curr.map((it) =>
          it.id === item.id ? { ...it, status: "uploading", progressMessage: "Subiendo..." } : it
        )
      );

      try {
        const formData = new FormData();
        formData.append("files", item.processed.thumb, "thumb.webp");
        formData.append("files", item.processed.card, "card.webp");
        formData.append("files", item.processed.detail, "detail.webp");
        formData.append("files", item.processed.original, "original.webp");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Error en el servidor al guardar imágenes");

        const data = await res.json();
        const [thumb, card, detail, original] = data.urls;

        const uploadedItem: UploadedPetImage = { thumb, card, detail, original };
        newUploadedList.push(uploadedItem);

        setItems((curr) =>
          curr.map((it) =>
            it.id === item.id
              ? { ...it, status: "done", uploaded: uploadedItem, progressMessage: "Guardado" }
              : it
          )
        );
      } catch (err) {
        console.error("Error al subir:", err);
        setItems((curr) =>
          curr.map((it) =>
            it.id === item.id
              ? { ...it, status: "error", progressMessage: "Error al subir" }
              : it
          )
        );
      }
    }

    setIsUploading(false);

    // Notificar al formulario padre todas las imágenes subidas exitosamente
    const allUploaded = items
      .map((it) => it.uploaded)
      .filter((u): u is UploadedPetImage => Boolean(u))
      .concat(newUploadedList);

    onImagesUploaded(allUploaded);
  };

  const removeItem = (id: string) => {
    setItems((curr) => {
      const filtered = curr.filter((it) => it.id !== id);
      const remainingUploaded = filtered
        .map((it) => it.uploaded)
        .filter((u): u is UploadedPetImage => Boolean(u));
      onImagesUploaded(remainingUploaded);
      return filtered;
    });
  };

  return (
    <div className="space-y-4">
      {/* Zona de Drop & Selección */}
      <div className="relative border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-2xl p-6 text-center bg-teal-50/40 transition-colors">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          multiple
          disabled={items.length >= maxImages}
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Haz clic o arrastra fotos de la mascota
          </p>
          <p className="text-xs text-slate-500">
            Se optimizarán automáticamente a formato <strong className="text-teal-700">WebP</strong> en 4 tamaños (320px, 640px, 1024px, 1600px). Hasta {maxImages} fotos.
          </p>
        </div>
      </div>

      {/* Grid de Previsualización */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col"
              >
                <div className="relative w-full aspect-square bg-slate-100">
                  <img
                    src={item.previewUrl}
                    alt="Previsualización"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {item.status === "done" && (
                    <div className="absolute bottom-1.5 left-1.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> WebP Listo
                    </div>
                  )}
                </div>

                <div className="p-2 text-[11px] text-slate-600 border-t border-slate-100 flex items-center justify-between">
                  <span className="truncate max-w-[120px] font-medium">{item.file.name}</span>
                  {item.status === "processing" && (
                    <Loader2 className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                  )}
                  {item.status === "uploading" && (
                    <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botón para subir imágenes listas */}
          {items.some((it) => it.status === "ready" && !it.uploaded) && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={uploadReadyImages}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando imágenes WebP...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    Confirmar y Guardar Fotos WebP
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
