import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: filePathArray } = await params;
  
  // Reconstrói o caminho dentro da pasta storage
  const filePath = path.join(process.cwd(), "storage", ...filePathArray);

  try {
    const fileBuffer = await fs.readFile(filePath);
    
    // Identificação básica de tipo MIME pela extensão
    const ext = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";
    
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".svg") contentType = "image/svg+xml";

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable", // Cache agressivo para performance
      },
    });
  } catch (e) {
    return new Response("Arquivo não encontrado", { status: 404 });
  }
}
