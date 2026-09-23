/**
 * Utilidad de procesamiento de imágenes 100% en el cliente (Browser Canvas API).
 * Convierte cualquier formato (JPG, PNG, HEIC) a WebP optimizado en 4 resoluciones:
 * - 320px  (Thumbnails / Avatares)
 * - 640px  (Tarjetas de listado en móviles y desktop)
 * - 1024px (Vista de detalle / galería en tablets y laptops)
 * - 1600px (Vista completa / pantallas de alta densidad)
 * 
 * Ventajas:
 * 1. 0 consumo de cuota de Vercel Image Optimization.
 * 2. Cargas ultra veloces (archivos que bajan de 6MB a ~30-70KB).
 * 3. Menor uso de ancho de banda y menor latencia para el usuario.
 */

export interface ProcessedWebpSet {
  thumb: Blob;
  card: Blob;
  detail: Blob;
  original: Blob;
  previewUrl: string; // Object URL para previsualización inmediata
}

export const TARGET_WIDTHS = {
  thumb: 320,
  card: 640,
  detail: 1024,
  original: 1600,
} as const;

export async function processImageToWebPSet(file: File): Promise<ProcessedWebpSet> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Error al leer el archivo de imagen"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Error al decodificar la imagen"));
      img.onload = async () => {
        try {
          const thumbBlob = await resizeToWebP(img, TARGET_WIDTHS.thumb, 0.80);
          const cardBlob = await resizeToWebP(img, TARGET_WIDTHS.card, 0.82);
          const detailBlob = await resizeToWebP(img, TARGET_WIDTHS.detail, 0.85);
          const originalBlob = await resizeToWebP(img, TARGET_WIDTHS.original, 0.88);

          const previewUrl = URL.createObjectURL(cardBlob);

          resolve({
            thumb: thumbBlob,
            card: cardBlob,
            detail: detailBlob,
            original: originalBlob,
            previewUrl,
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

function resizeToWebP(
  img: HTMLImageElement,
  targetWidth: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Si la imagen original es más pequeña que el target, usamos su ancho original para no pixelar
    const scale = Math.min(1, targetWidth / img.width);
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      return reject(new Error("No se pudo obtener el contexto 2D del Canvas"));
    }

    // Suavizado bicúbico para alta fidelidad fotográfica
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          // Fallback a JPEG si WebP no fuera soportado por el navegador antiguo
          canvas.toBlob(
            (fallbackBlob) => {
              if (fallbackBlob) resolve(fallbackBlob);
              else reject(new Error("Error al exportar el Blob de la imagen"));
            },
            "image/jpeg",
            quality
          );
        }
      },
      "image/webp",
      quality
    );
  });
}
