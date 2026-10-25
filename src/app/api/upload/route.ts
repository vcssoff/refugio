import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se enviaron archivos" }, { status: 400 });
    }

    const hasVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const randomName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

      if (hasVercelBlob) {
        try {
          // Subida a Vercel Blob (Producción con Blob conectado)
          const blob = await put(`pets/${randomName}`, buffer, {
            access: "public",
            contentType: file.type || "image/webp",
          });
          uploadedUrls.push(blob.url);
          continue;
        } catch (blobErr) {
          console.error("Error al subir a Vercel Blob, usando fallback:", blobErr);
        }
      }

      // Si no hay Vercel Blob o falló:
      // Intentamos guardar en public/uploads (entorno local con permisos de escritura)
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, randomName);
        await fs.writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${randomName}`);
      } catch (fsErr) {
        // En Vercel Serverless el sistema de archivos es de solo lectura.
        // Fallback a Base64 Data URL para que NUNCA se rompa una foto
        const mimeType = file.type || "image/webp";
        const base64Data = buffer.toString("base64");
        uploadedUrls.push(`data:${mimeType};base64,${base64Data}`);
      }
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Error en /api/upload:", error);
    return NextResponse.json(
      { error: "Error al procesar la subida de imágenes" },
      { status: 500 }
    );
  }
}
