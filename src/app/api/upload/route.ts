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

    // Si es local y no hay Blob token, aseguramos la carpeta public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!hasVercelBlob) {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const randomName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

      if (hasVercelBlob) {
        // Subida a Vercel Blob (Producción)
        const blob = await put(`pets/${randomName}`, buffer, {
          access: "public",
          contentType: file.type || "image/webp",
        });
        uploadedUrls.push(blob.url);
      } else {
        // Almacenamiento local en public/uploads (Desarrollo)
        const filePath = path.join(uploadDir, randomName);
        await fs.writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${randomName}`);
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
