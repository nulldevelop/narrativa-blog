"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { createArticleAction, updateArticleAction } from "../_actions";
import { X, Plus, Save, Send, Image as ImageIcon, FileText, Tag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface ArticleFormProps {
  categories: { id: string; name: string }[];
  initialData?: {
    id: string;
    title: string;
    subtitle: string | null;
    content: string;
    categoryId: string | null;
    coverImage: string | null;
    tags: string[];
    status: string;
  };
}

export function ArticleForm({ categories, initialData }: ArticleFormProps) {
  console.log("🛠️ [CLIENT] ArticleForm Renderizado", initialData ? "(Edição)" : "(Novo)");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | undefined>(initialData?.content || "**Inicie sua narrativa aqui...**");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    categoryId: initialData?.categoryId || "",
    coverImage: initialData?.coverImage || "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      const data = new FormData();
      data.append("file", file);
      data.append("articleId", initialData?.id || "new");

      try {
        const res = await fetch("/api/upload/article", {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        if (result.url) {
          uploadedUrls.push(result.url);
          if (i === 0 && !formData.coverImage) {
             setFormData(prev => ({ ...prev, coverImage: result.url }));
          }
        }
      } catch (err) {
        toast.error(`Erro ao subir ${file.name}`);
      }
    }

    setUploadedImages(prev => [...prev, ...uploadedUrls]);
    setUploading(false);
    toast.success(`${uploadedUrls.length} imagem(ns) enviada(s)!`);
  };

  const copyToClipboard = (url: string) => {
    const markdownImage = `![Descrição da imagem](${url})`;
    navigator.clipboard.writeText(markdownImage);
    toast.success("Código Markdown copiado! Cole no texto.");
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagName: string) => {
    setTags((prev) => prev.filter((t) => t !== tagName));
  };

  const toggleTag = (tagName: string) => {
    if (tags.includes(tagName)) {
      handleRemoveTag(tagName);
    } else {
      setTags((prev) => [...prev, tagName]);
    }
  };

  const handleSubmit = async (status: "draft" | "published", isPreview = false) => {
    if (!formData.title) return toast.error("O título é obrigatório.");
    if (!content || content.length < 50) return toast.error("O conteúdo deve ter pelo menos 50 caracteres.");
    if (!formData.categoryId) return toast.error("Selecione uma categoria.");

    setLoading(true);
    try {
      const payload = {
        ...formData,
        content: content || "",
        tags,
        status,
      };
      
      let result;
      if (initialData?.id) {
        result = await updateArticleAction(initialData.id, payload);
      } else {
        result = await createArticleAction(payload);
      }

      if (result.success) {
        if (isPreview) {
          router.push(`/dashboard-author/artigo/preview/${result.id || initialData?.id}`);
        } else {
          toast.success(status === "published" ? "Post publicado!" : "Rascunho salvo!");
          router.push("/dashboard-author/artigo");
        }
      } else {
        toast.error(result.error || "Erro ao salvar post.");
      }
    } catch (error: any) {
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
        
        <div className="space-y-8 bg-white border border-slate-200 p-8 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Título do Post
              </Label>
              <Input
                placeholder="Ex: O movimento silencioso nos bastidores do poder..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-2xl font-bold h-16 rounded-none border-slate-300 focus:border-narrativa-preto focus-visible:ring-0 px-4 placeholder:text-slate-300 bg-white text-black opacity-100"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">
                Subtítulo / Resumo
              </Label>
              <Textarea
                placeholder="Uma breve introdução que instigue a leitura..."
                value={formData.subtitle || ""}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="text-lg font-medium min-h-[100px] rounded-none border-slate-300 focus:border-narrativa-preto focus-visible:ring-0 px-4 py-3 placeholder:text-slate-300 bg-white text-black opacity-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">
              Corpo do Post (Markdown)
            </Label>
            <div className="border border-slate-300" data-color-mode="light">
              <MDEditor
                value={content}
                onChange={setContent}
                height={600}
                preview="edit"
                className="rounded-none"
              />
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-6 sticky top-24">
          <div className="bg-narrativa-preto p-6 shadow-lg">
             <h3 className="text-[0.65rem] font-black tracking-[0.2em] uppercase text-white/50 mb-6 flex items-center gap-2">
                Controle Editorial
             </h3>
             <div className="flex flex-col gap-3">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => handleSubmit("draft", true)}
                  className="w-full rounded-none border-white/20 bg-white/5 text-white hover:bg-white/10 h-12 text-[0.7rem] font-bold tracking-widest uppercase opacity-100"
                >
                  <Eye className="w-4 h-4 mr-2" /> Visualizar Post
                </Button>

                <Button 
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmit("published")}
                  className="w-full rounded-none bg-narrativa-vermelho hover:bg-red-700 h-12 text-[0.75rem] font-bold tracking-widest uppercase text-white opacity-100"
                >
                  <Send className="w-4 h-4 mr-2" /> {initialData?.id ? "Atualizar Post" : "Publicar Agora"}
                </Button>
                <Button 
                  type="button"
                  disabled={loading}
                  variant="outline"
                  onClick={() => handleSubmit("draft")}
                  className="w-full rounded-none border-white/20 bg-transparent text-white hover:bg-white/10 h-12 text-[0.7rem] font-bold tracking-widest uppercase opacity-100"
                >
                  <Save className="w-4 h-4 mr-2" /> Salvar Rascunho
                </Button>
             </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Categoria</Label>
              <Select 
                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                defaultValue={formData.categoryId || ""}
              >
                <SelectTrigger className="rounded-none border-slate-300 h-11 font-bold text-slate-700 bg-white opacity-100">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-none bg-white opacity-100 border-slate-200">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="font-bold text-slate-700">{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Imagem de Capa</Label>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="URL ou suba um arquivo..."
                    value={formData.coverImage || ""}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="pl-10 rounded-none border-slate-300 h-11 text-xs bg-white text-black opacity-100"
                  />
                </div>
                <div className="relative w-full">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <Label
                    htmlFor="file-upload"
                    className={`flex items-center justify-center w-full h-10 border border-dashed border-slate-300 bg-slate-50 text-[0.6rem] font-bold uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {uploading ? 'Subindo...' : 'Fazer Upload (Múltiplos)'}
                  </Label>
                </div>
              </div>
              {formData.coverImage && (
                <div className="aspect-video w-full mt-3 border border-slate-200 overflow-hidden bg-slate-100 relative group">
                   <img src={formData.coverImage} alt="Capa" className="w-full h-full object-cover" />
                   <div className="absolute top-2 right-2 bg-narrativa-vermelho text-white text-[0.5rem] font-black px-2 py-1 uppercase">Capa</div>
                </div>
              )}
            </div>

            <div className="space-y-3 border-b border-slate-100 pb-6">
              <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Posicionamento na Home</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'home-principal', label: 'Destaque Topo' },
                  { id: 'home-destaque-1', label: 'Lateral 1' },
                  { id: 'home-destaque-2', label: 'Lateral 2' },
                  { id: 'home-destaque-3', label: 'Lateral 3' },
                  { id: 'home-geral-1', label: 'Geral Grande 1' },
                  { id: 'home-geral-2', label: 'Geral Grande 2' },
                ].map((pos) => (
                  <Button
                    key={pos.id}
                    type="button"
                    variant="outline"
                    onClick={() => toggleTag(pos.id)}
                    className={`rounded-none h-8 text-[0.6rem] font-bold uppercase tracking-tighter border-slate-200 hover:bg-narrativa-vermelho hover:text-white transition-all ${tags.includes(pos.id) ? 'bg-narrativa-preto text-white' : 'bg-white'}`}
                  >
                    {pos.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Tag className="w-3 h-3" /> Outras Tags
              </Label>
              <div className="flex gap-1">
                <Input
                  placeholder="Adicionar tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  className="rounded-none border-slate-300 h-10 text-xs bg-white text-black opacity-100"
                />
                <Button 
                  type="button"
                  onClick={handleAddTag} 
                  variant="secondary" 
                  className="rounded-none h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {tags.map((t) => (
                  <Badge key={t} className="rounded-none text-[0.6rem] font-bold uppercase bg-slate-200 text-slate-700 hover:bg-narrativa-vermelho hover:text-white transition-colors py-1 px-2 border-none flex items-center gap-1">
                    {t} 
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveTag(t);
                      }}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-2.5 h-2.5 cursor-pointer" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
