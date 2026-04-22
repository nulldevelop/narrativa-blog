import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  // 1. Verificar Autenticação
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const articleId = formData.get("articleId") as string || "temp";

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // 2. Validar se é realmente uma imagem
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "O arquivo enviado não é uma imagem" }, { status: 400 });
    }

    // 3. Preparar diretório de destino
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Caminho: storage/materia/[id]/imagens
    const storagePath = path.join(process.cwd(), "storage", "materia", articleId, "imagens");
    
    // Cria as pastas se não existirem
    await fs.mkdir(storagePath, { recursive: true });

    // Nome único para evitar conflitos
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(storagePath, fileName);

    // 4. Salvar no Disco
    await fs.writeFile(filePath, buffer);

    // Retorna a URL que será servida pela nossa API de mídia
    const url = `/api/media/materia/${articleId}/imagens/${fileName}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Falha ao processar upload" }, { status: 500 });
  }
}
