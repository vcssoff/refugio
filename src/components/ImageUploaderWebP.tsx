"use client";

import React, { useState } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon, CheckCircle2, Crop } from "lucide-react";
import { processImageToWebPSet, ProcessedWebpSet } from "@/lib/image-processor";
import ImageFrameAdjusterModal from "./ImageFrameAdjusterModal";

export interface UploadedPetImage {
  thumb: string;
  card: string;
  detail: string;
  original: string;
}

interface ImageUploaderWebPProps {
  onImagesUploaded: (images: UploadedPetImage[]) => void;
  maxImages?: number;
  initialImages?: UploadedPetImage[];
}

interface ItemToProcess {
  id: string;
  file?: File;
  previewUrl: string;
  status: "processing" | "ready" | "uploading" | "done" | "error";
  processed?: ProcessedWebpSet;
  uploaded?: UploadedPetImage;
  progressMessage?: string;
  isExisting?: boolean;
}

export default function ImageUploaderWebP({
  onImagesUploaded,
  maxImages = 6,
  initialImages = [],
}: ImageUploaderWebPProps) {
  // Inicializar con imágenes existentes si se proveen (modo edición)
  const [items, setItems] = useState<ItemToProcess[]>(() =>
    initialImages.map((img, i) => ({
      id: `existing-${i}-${Math.random().toString(36).substring(7)}`,
      previewUrl: img.card || img.detail || img.original || img.thumb,
      status: "done",
      uploaded: img,
      progressMessage: "Guardado",
      isExisting: true,
    }))
  );

  const [isUploading, setIsUploading] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<ItemToProcess | null>(null);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - items.length;
    const selectedList = Array.from(files).slice(0, remainingSlots);

    const newItems: ItemToProcess[] = selectedList.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      status: "processing",
      progressMessage: "Convirtiendo a WebP...",
    }));

    setItems((prev) => [...prev, ...newItems]);

    // Procesar cada imagen en cliente a WebP
    for (const item of newItems) {
      if (!item.file) continue;
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

  const handleApplyCrop = (cropSet: ProcessedWebpSet) => {
    if (!adjustingItem) return;

    setItems((curr) => {
      const updated = curr.map((it) =>
        it.id === adjustingItem.id
          ? {
              ...it,
              status: "ready" as const,
              processed: cropSet,
              previewUrl: cropSet.previewUrl,
              uploaded: undefined, // Requiere re-subir con el nuevo encuadre
              progressMessage: "Encuadre aplicado",
            }
          : it
      );

      // Notificar lista actualizada sin la que se está reencuadrando hasta que se confirme
      const validUploaded = updated
        .map((it) => it.uploaded)
        .filter((u): u is UploadedPetImage => Boolean(u));
      onImagesUploaded(validUploaded);

      return updated;
    });

    setAdjustingItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Zona de Drop & Selección */}
      <div className="relative border-2 border-dashed border-[#e2d5c4] hover:border-orange-400 rounded-2xl p-6 text-center bg-[#fbf8f3] hover:bg-[#faf4ec] transition-colors">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          multiple
          disabled={items.length >= maxImages}
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-[#2d2420]">
            Haz clic o arrastra fotos de la mascota
          </p>
          <p className="text-xs text-[#63554b]">
            Se optimizarán automáticamente a formato <strong className="text-orange-700">WebP</strong>. Podrás <strong className="text-orange-600">encuadrar y centrar la cara</strong> con 1 clic. Hasta {maxImages} fotos.
          </p>
        </div>
      </div>

      {/* Grid de Previsualización con botón de Encuadre */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-2xl overflow-hidden border border-[#e8ded1] bg-white shadow-xs flex flex-col hover:border-orange-300 transition-all"
              >
                <div className="relative w-full aspect-4/3 bg-[#f6eee4]">
                  <img
                    src={item.previewUrl}
                    alt="Previsualización"
                    className="w-full h-full object-cover"
                  />

                  {/* Botón Borrar */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors z-10 cursor-pointer shadow-xs"
                    title="Eliminar foto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Botón de Encuadrar Cara */}
                  <button
                    type="button"
                    onClick={() => setAdjustingItem(item)}
                    className="absolute bottom-1.5 right-1.5 px-2.5 py-1 bg-black/75 hover:bg-orange-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md transition-colors backdrop-blur-xs cursor-pointer z-10 active:scale-95"
                    title="Ajustar encuadre / centrar la cara"
                  >
                    <Crop className="w-3 h-3 text-orange-400 group-hover:text-white" />
                    <span>Encuadrar Cara</span>
                  </button>

                  {item.status === "done" && (
                    <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3 h-3" /> Lista
                    </div>
                  )}
                </div>

                <div className="p-2 text-[11px] text-[#4a3f35] border-t border-[#f0e6da] flex items-center justify-between bg-[#fdfcf9]">
                  <span className="truncate max-w-[120px] font-medium">
                    {item.file?.name || "Foto guardada"}
                  </span>
                  {item.status === "processing" && (
                    <Loader2 className="w-3.5 h-3.5 text-orange-600 animate-spin" />
                  )}
                  {item.status === "uploading" && (
                    <Loader2 className="w-3.5 h-3.5 text-orange-600 animate-spin" />
                  )}
                  {item.status === "ready" && !item.uploaded && (
                    <span className="text-[10px] text-amber-700 font-bold">Por confirmar</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botón para subir imágenes listas */}
          {items.some((it) => it.status === "ready" && !it.uploaded) && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={uploadReadyImages}
                disabled={isUploading}
                className="min-h-[42px] inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
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

      {/* Modal interactivo de encuadre */}
      {adjustingItem && (
        <ImageFrameAdjusterModal
          isOpen={Boolean(adjustingItem)}
          onClose={() => setAdjustingItem(null)}
          imageSrc={adjustingItem.file ? URL.createObjectURL(adjustingItem.file) : adjustingItem.previewUrl}
          imageName={adjustingItem.file?.name || "Foto"}
          onApplyCrop={handleApplyCrop}
        />
      )}
    </div>
  );
}

