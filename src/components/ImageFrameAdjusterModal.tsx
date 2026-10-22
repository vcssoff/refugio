"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Check,
  RefreshCw,
  Sparkles,
  Smile,
  Maximize2,
} from "lucide-react";
import { ProcessedWebpSet, TARGET_WIDTHS } from "@/lib/image-processor";

interface ImageFrameAdjusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string; // Object URL o URL de imagen
  imageName?: string;
  onApplyCrop: (processed: ProcessedWebpSet) => void;
}

export default function ImageFrameAdjusterModal({
  isOpen,
  onClose,
  imageSrc,
  imageName = "Foto de la mascota",
  onApplyCrop,
}: ImageFrameAdjusterModalProps) {
  // Parámetros de transformación
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0); // -100 a +100 (%)
  const [offsetY, setOffsetY] = useState(0); // -100 a +100 (%)
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Cargar imagen en memoria
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageObjRef.current = img;
      // Resetear controles al abrir una nueva imagen
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      setRotation(0);
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc]);

  // Dibujar previsualización en el canvas de 4:3
  const drawPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Fondo neutro cálido
    ctx.fillStyle = "#f6eee4";
    ctx.fillRect(0, 0, w, h);

    // Mover al centro del canvas
    ctx.translate(w / 2, h / 2);

    // Rotación
    ctx.rotate((rotation * Math.PI) / 180);

    // Escala base para cubrir el marco 4:3 (aspect fill / cover)
    const isRotated90 = rotation % 180 !== 0;
    const sourceW = isRotated90 ? img.height : img.width;
    const sourceH = isRotated90 ? img.width : img.height;

    const scaleBase = Math.max(w / sourceW, h / sourceH);
    const finalScale = scaleBase * zoom;

    // Desplazamiento manual en píxeles relativos al canvas
    // Si la imagen está rotada, debemos proyectar el offset al espacio local
    const panPixelX = (offsetX / 100) * (w / 2);
    const panPixelY = (offsetY / 100) * (h / 2);

    ctx.translate(panPixelX, panPixelY);

    // Dibujar imagen centrada
    ctx.drawImage(
      img,
      (-img.width * finalScale) / 2,
      (-img.height * finalScale) / 2,
      img.width * finalScale,
      img.height * finalScale
    );

    ctx.restore();

    // Guías de encuadre suaves (regla de los tercios)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(w / 3, 0);
    ctx.lineTo(w / 3, h);
    ctx.moveTo((2 * w) / 3, 0);
    ctx.lineTo((2 * w) / 3, h);

    ctx.moveTo(0, h / 3);
    ctx.lineTo(w, h / 3);
    ctx.moveTo(0, (2 * h) / 3);
    ctx.lineTo(w, (2 * h) / 3);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [zoom, offsetX, offsetY, rotation]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Manejo de arrastre con mouse o touch en el marco
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    // Ajustar sensibilidad según zoom
    const sensitivity = 0.5;
    setOffsetX((prev) => Math.max(-100, Math.min(100, prev + dx * sensitivity)));
    setOffsetY((prev) => Math.max(-100, Math.min(100, prev + dy * sensitivity)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    const sensitivity = 0.6;
    setOffsetX((prev) => Math.max(-100, Math.min(100, prev + dx * sensitivity)));
    setOffsetY((prev) => Math.max(-100, Math.min(100, prev + dy * sensitivity)));
  };

  // Presets rápidos de encuadre
  const applyPreset = (type: "face" | "center" | "body") => {
    if (type === "face") {
      // Subir el encuadre para enfocar la cara/cabeza
      setZoom(1.25);
      setOffsetY(35); // En canvas translate positivo mueve la imagen hacia abajo, mostrando la parte superior (cabeza)
      setOffsetX(0);
    } else if (type === "center") {
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
    } else if (type === "body") {
      setZoom(1.15);
      setOffsetY(-35); // Muestra la parte inferior (cuerpo)
      setOffsetX(0);
    }
  };

  // Generar las 4 versiones WebP aplicando el encuadre
  const handleApply = async () => {
    const img = imageObjRef.current;
    if (!img) return;

    setIsProcessing(true);

    try {
      const renderAtSize = async (targetWidth: number, quality: number): Promise<Blob> => {
        // Marco de proporción 4:3 estándar para las tarjetas y catálogo
        const targetHeight = Math.round((targetWidth * 3) / 4);

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("No se pudo obtener el contexto 2D");

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Mismo cálculo de transformación que en la previsualización
        ctx.fillStyle = "#f6eee4";
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        ctx.save();
        ctx.translate(targetWidth / 2, targetHeight / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        const isRotated90 = rotation % 180 !== 0;
        const sourceW = isRotated90 ? img.height : img.width;
        const sourceH = isRotated90 ? img.width : img.height;

        const scaleBase = Math.max(targetWidth / sourceW, targetHeight / sourceH);
        const finalScale = scaleBase * zoom;

        const panPixelX = (offsetX / 100) * (targetWidth / 2);
        const panPixelY = (offsetY / 100) * (targetHeight / 2);

        ctx.translate(panPixelX, panPixelY);

        ctx.drawImage(
          img,
          (-img.width * finalScale) / 2,
          (-img.height * finalScale) / 2,
          img.width * finalScale,
          img.height * finalScale
        );

        ctx.restore();

        return new Promise((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Error al exportar blob"));
            },
            "image/webp",
            quality
          );
        });
      };

      const thumbBlob = await renderAtSize(TARGET_WIDTHS.thumb, 0.82);
      const cardBlob = await renderAtSize(TARGET_WIDTHS.card, 0.85);
      const detailBlob = await renderAtSize(TARGET_WIDTHS.detail, 0.88);
      const originalBlob = await renderAtSize(TARGET_WIDTHS.original, 0.9);

      const previewUrl = URL.createObjectURL(cardBlob);

      onApplyCrop({
        thumb: thumbBlob,
        card: cardBlob,
        detail: detailBlob,
        original: originalBlob,
        previewUrl,
      });

      onClose();
    } catch (err) {
      console.error("Error al exportar encuadre:", err);
      alert("Error al procesar el encuadre de la imagen.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#ded5c7] flex flex-col max-h-[95vh]">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 border-b border-[#eee7dd] flex items-center justify-between bg-[#fbf8f3]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#2d2420]">
                Ajustar Encuadre de la Foto
              </h3>
              <p className="text-[11px] text-stone-500 truncate max-w-[220px] sm:max-w-xs">
                Acomoda la foto para que la carita se vea perfecta
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Área del marco interactivo */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {/* Marco 4:3 con Canvas interactivo */}
          <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border-2 border-orange-300 shadow-md bg-stone-900 flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
            <canvas
              ref={previewCanvasRef}
              width={640}
              height={480}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="w-full h-full object-contain"
            />

            {/* Indicador de ayuda táctil */}
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-lg pointer-events-none flex items-center gap-1 shadow-xs">
              <Move className="w-3 h-3 text-orange-400" />
              <span>Arrastra para mover</span>
            </div>
          </div>

          {/* Presets Rápidos de 1 Clic */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#634832] uppercase tracking-wide block">
              Ajuste Rápido con 1 Clic:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyPreset("face")}
                className="py-2 px-3 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-orange-950 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all touch-manipulation cursor-pointer"
              >
                <Smile className="w-3.5 h-3.5 text-orange-600" />
                <span>Enfocar Cara</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset("center")}
                className="py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all touch-manipulation cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-stone-600" />
                <span>Centrado</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset("body")}
                className="py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all touch-manipulation cursor-pointer"
              >
                <span>🐾 Cuerpo</span>
              </button>
            </div>
          </div>

          {/* Sliders Manuales de Zoom y Posición */}
          <div className="space-y-3 bg-[#fbf8f3] p-3.5 rounded-2xl border border-[#ede5d8]">
            {/* Control de Zoom */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#2d2420]">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-orange-600" />
                  Zoom (Agrandar / Alejar)
                </span>
                <span className="text-orange-700 font-black">{zoom.toFixed(1)}x</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(1)))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#ded5c7] flex items-center justify-center text-stone-700 hover:bg-stone-100 active:scale-95 cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(1)))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#ded5c7] flex items-center justify-center text-stone-700 hover:bg-stone-100 active:scale-95 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mover a los costados (Horizontal) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#2d2420]">
                <span>↔ Mover a los costados</span>
                <span className="text-stone-500 text-[11px]">{offsetX > 0 ? `+${Math.round(offsetX)}%` : `${Math.round(offsetX)}%`}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={offsetX}
                onChange={(e) => setOffsetX(parseInt(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Mover Arriba / Abajo (Vertical) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#2d2420]">
                <span>↕ Mover arriba o abajo</span>
                <span className="text-stone-500 text-[11px]">{offsetY > 0 ? `+${Math.round(offsetY)}%` : `${Math.round(offsetY)}%`}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={offsetY}
                onChange={(e) => setOffsetY(parseInt(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Botón Girar y Reset */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ded5c7] hover:bg-stone-50 text-stone-700 font-bold active:scale-95 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-orange-600" />
                <span>Girar 90° ({rotation}°)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setOffsetX(0);
                  setOffsetY(0);
                  setRotation(0);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-stone-500 hover:text-stone-800 font-medium active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pie con acciones */}
        <div className="p-4 bg-[#fbf8f3] border-t border-[#eee7dd] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#ded5c7] text-[#4a3f35] font-bold text-xs hover:bg-white active:scale-95 transition-all cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-400 hover:from-orange-600 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Guardando encuadre...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                Aplicar Encuadre
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
