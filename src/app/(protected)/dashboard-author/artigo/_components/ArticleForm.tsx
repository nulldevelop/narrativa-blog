/** biome-ignore-all lint/suspicious/noImplicitAnyLet: dev */
'use client'

import { Plus, Save, Send, Tag, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { MyEditor, type SunEditorRef } from '@/components/sun-editor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createArticleAction } from '../_actions/create-article'
import { deleteImageAction } from '../_actions/delete-image'
import { updateArticleAction } from '../_actions/update-article'

interface ArticleFormProps {
  categories: { id: string; name: string }[]
  initialData?: {
    id: string
    title: string
    subtitle: string | null
    content: string
    categoryId: string | null
    coverImage: string | null
    coverImageCredit: string | null
    tags: string[]
    homePosition?: string
    status: string
    images?: string[]
    gallery?: string | null
  }
}

interface GalleryImage {
  url: string
  credit?: string
}

const HOME_POSITIONS = [
  { value: 'home-principal', label: 'Principal (Home)' },
  { value: 'home-destaque-1', label: 'Destaque 1' },
  { value: 'home-destaque-2', label: 'Destaque 2' },
  { value: 'home-destaque-3', label: 'Destaque 3' },
  { value: 'home-geral-1', label: 'Geral 1' },
  { value: 'home-geral-2', label: 'Geral 2' },
  { value: 'home-listagem', label: 'Listagem' },
]

export function ArticleForm({ categories, initialData }: ArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [content, setContent] = useState<string>(initialData?.content || '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    initialData?.images || [],
  )
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
    initialData?.gallery ? JSON.parse(initialData.gallery) : [],
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<SunEditorRef>(null)

  // Gera um UUID permanente para novas matérias, evitando path temporário 'novo-*'
  const [articleFolderId] = useState(() => {
    if (initialData?.id) return initialData.id
    return crypto.randomUUID()
  })

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    categoryId: initialData?.categoryId || '',
    coverImage: initialData?.coverImage || '',
    coverImageCredit: initialData?.coverImageCredit || '',
  })

  const [homePosition, setHomePosition] = useState<string>(
    initialData?.homePosition ||
    initialData?.tags.find((t) => HOME_POSITIONS.some((p) => p.value === t)) ||
    ''
  )

  const handleAddTag = () => {
    const tagName = tagInput.trim()
    if (!tagName || tags.includes(tagName)) {
      setTagInput('')
      return
    }
    setTags((prev) => [...prev, tagName])
    setTagInput('')
  }

  const handleDeleteImage = async (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return

    try {
      const result = await deleteImageAction(url)
      if (result.success) {
        setUploadedImages((prev) => prev.filter((img) => img !== url))
        setGalleryImages((prev) => prev.filter((img) => img.url !== url))
        if (formData.coverImage === url) {
          setFormData({ ...formData, coverImage: '' })
        }
        toast.success('Imagem excluída!')
      } else {
        toast.error(result.error || 'Erro ao excluir imagem')
      }
    } catch (_error) {
      toast.error('Erro ao excluir imagem')
    }
  }

  const handleInsertImage = (url: string) => {
    editorRef.current?.insertImage(url)
    toast.success('Imagem inserida!')
  }

  const toggleGalleryImage = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    setGalleryImages((prev) =>
      prev.some((img) => img.url === url)
        ? prev.filter((img) => img.url !== url)
        : [...prev, { url, credit: '' }],
    )
  }

  const updateImageCredit = (url: string, credit: string) => {
    setGalleryImages((prev) =>
      prev.map((img) => (img.url === url ? { ...img, credit } : img)),
    )
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    let uploaded = 0
    const articleId = articleFolderId

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) continue

      const data = new FormData()
      data.append('file', file)
      data.append('articleId', articleId)

      try {
        const res = await fetch('/api/upload/article', {
          method: 'POST',
          body: data,
        })

        const result = await res.json()

        if (result.url) {
          setUploadedImages((prev: string[]) => [...prev, result.url])
          // A galeria fica oculta por padrão: as imagens só entram nela
          // quando o autor clicar em "Add na Galeria" (fotos extras além da capa).

          if (i === 0 && !formData.coverImage) {
            setFormData({ ...formData, coverImage: result.url })
          }
          uploaded++
        }
      } catch (err) {
        console.error('Erro ao enviar:', err)
      }
    }

    toast.success(`${uploaded} imagem(ns) enviada(s)!`)
    setUploading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (
    status: 'draft' | 'published',
    saveFirst = true,
  ) => {
    // Lê o HTML direto do editor (inclui imagens na posição correta, formato de saída),
    // em vez de depender apenas do estado sincronizado via onChange.
    const editorContent = editorRef.current?.getContent() || content

    if (!formData.title) return toast.error('O título é obrigatório.')
    if (!editorContent || editorContent.length < 20)
      return toast.error('O conteúdo é muito curto.')
    if (!formData.categoryId) return toast.error('Selecione uma categoria.')

    if (!saveFirst && initialData?.id) {
      router.push(`/dashboard-author/artigo/preview/${initialData.id}`)
      return
    }

    if (!saveFirst) {
      toast.error('Salve primeiro para visualizar.')
      return
    }

    setLoading(true)
    try {
      const tagsWithoutHomePosition = tags.filter(
        (t) => !HOME_POSITIONS.some((p) => p.value === t),
      )
      const finalTags = homePosition
        ? [...tagsWithoutHomePosition, homePosition]
        : tagsWithoutHomePosition
      const payload = {
        ...formData,
        content: editorContent || '',
        tags: finalTags,
        status,
        gallery: JSON.stringify(galleryImages),
      }
      let result
      if (initialData?.id) {
        result = await updateArticleAction(initialData.id, payload)
      } else {
        result = await createArticleAction(payload, articleFolderId)
      }

      if (result.success) {
        toast.success(
          status === 'published' ? 'Matéria publicada!' : 'Rascunho salvo!',
        )
        router.push('/dashboard-author/artigo')
        router.refresh()
      } else {
        toast.error(result.error || 'Erro ao salvar')
      }
    } catch (_error) {
      toast.error('Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <Label className="text-[0.65rem] font-black uppercase tracking-widest text-black/50">
            Título
          </Label>
          <Input
            placeholder="Título da matéria..."
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="rounded-none border-narrativa-cinza-linha h-12 text-lg font-bold"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[0.65rem] font-black uppercase tracking-widest text-black/50">
            Subtítulo
          </Label>
          <Input
            placeholder="Subtítulo (opcional)..."
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            className="rounded-none border-narrativa-cinza-linha h-10"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[0.65rem] font-black uppercase tracking-widest text-black/50">
            Conteúdo
          </Label>
          <div data-color-mode="light" className="prose-narrativa max-w-none">
            <MyEditor
              ref={editorRef}
              content={content}
              onChange={(val) => setContent(val)}
              articleId={articleFolderId}
              onImageUploaded={(url) =>
                setUploadedImages((prev) => prev.includes(url) ? prev : [...prev, url])
              }
            />
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="bg-white border border-black/5 p-6 shadow-sm space-y-6">
          <h3 className="text-[0.65rem] font-black tracking-[0.2em] uppercase text-black/50">
            Publicação
          </h3>

          <div className="space-y-3">
            <Button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('published')}
              className="w-full rounded-none h-12 text-[0.75rem] font-bold uppercase tracking-widest bg-narrativa-vermelho hover:bg-red-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />{' '}
              {initialData?.id ? 'Atualizar' : 'Publicar Agora'}
            </Button>

            <Button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('draft')}
              variant="outline"
              className="w-full rounded-none h-10 text-[0.7rem] font-bold uppercase tracking-widest border-narrativa-cinza-linha text-narrativa-preto hover:bg-narrativa-preto hover:text-white"
            >
              <Save className="w-4 h-4 mr-2" /> Salvar Rascunho
            </Button>
          </div>
        </div>

        <div className="bg-white border border-black/5 p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <Label className="text-[0.65rem] font-black uppercase tracking-widest text-black/50">
              Categoria
            </Label>
            <Select
              onValueChange={(val) =>
                setFormData({ ...formData, categoryId: val })
              }
              defaultValue={formData.categoryId || ''}
            >
              <SelectTrigger className="w-full rounded-none border-narrativa-cinza-linha h-11 font-bold">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="rounded-none bg-white border-narrativa-cinza-linha">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="font-bold">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[0.65rem] font-black uppercase tracking-widest text-black/50">
              Imagem de Capa
            </Label>
            <div className="space-y-2">
              <input
                type="file"
                id="file-upload-input"
                ref={fileInputRef}
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() =>
                  document.getElementById('file-upload-input')?.click()
                }
                className="w-full rounded-none h-10 text-[0.65rem] font-bold uppercase tracking-widest border-narrativa-cinza-linha"
              >
                {uploading ? 'Enviando...' : 'Fazer Upload de Imagem'}
              </Button>
            </div>

            {formData.coverImage && (
              <div className="aspect-video w-full mt-3 border border-narrativa-cinza-linha overflow-hidden relative group">
                <Image
                  src={formData.coverImage}
                  alt="Capa"
                  fill
                  sizes="(max-width: 768px) 100vw, 340px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => handleDeleteImage(e, formData.coverImage)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {formData.coverImage && (
              <div className="space-y-1 mt-2">
                <Label className="text-[0.6rem] font-bold uppercase text-black/40">
                  Créditos da Imagem
                </Label>
                <Input
                  placeholder="Ex: Foto: João Silva / Agência"
                  value={formData.coverImageCredit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coverImageCredit: e.target.value,
                    })
                  }
                  className="rounded-none border-narrativa-cinza-linha h-8 text-[0.7rem]"
                />
              </div>
            )}
          </div>

          {uploadedImages.length > 0 && (
            <div className="space-y-4 border-t border-black/5 pt-4">
              <Label className="text-[0.65rem] font-black uppercase tracking-widest text-black/50">
                Imagens Enviadas & Galeria
              </Label>
              <div className="flex flex-col gap-4">
                {uploadedImages.map((url) => {
                  const galleryItem = galleryImages.find(
                    (img) => img.url === url,
                  )
                  const isInGallery = !!galleryItem
                  return (
                    <div
                      key={url}
                      className="border border-narrativa-cinza-linha p-3 space-y-3"
                    >
                      <div className="flex gap-4 items-start">
                        <button
                          type="button"
                          className="relative w-24 aspect-video border border-narrativa-cinza-linha overflow-hidden group cursor-pointer shrink-0"
                          onClick={() => handleInsertImage(url)}
                          aria-label="Inserir imagem no texto"
                        >
                          <Image
                            src={url}
                            alt="Imagem enviada"
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[0.4rem] font-bold uppercase">Inserir</span>
                          </div>
                        </button>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={(e) => toggleGalleryImage(e, url)}
                              className={`text-[0.6rem] font-bold uppercase px-2 py-1 transition-colors ${
                                isInGallery
                                  ? 'bg-narrativa-vermelho text-white'
                                  : 'bg-narrativa-cinza-claro text-narrativa-cinza-texto hover:bg-narrativa-preto hover:text-white'
                              }`}
                            >
                              {isInGallery ? 'Na Galeria' : 'Add na Galeria'}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteImage(e, url)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {isInGallery && (
                            <div className="space-y-1">
                              <Label className="text-[0.55rem] font-bold uppercase text-black/40">
                                Crédito (Galeria)
                              </Label>
                              <Input
                                placeholder="Foto: Nome do Autor"
                                value={galleryItem.credit || ''}
                                onChange={(e) =>
                                  updateImageCredit(url, e.target.value)
                                }
                                className="rounded-none border-narrativa-cinza-linha h-7 text-[0.65rem]"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-3 border-t border-black/5 pt-6">
            <Label className="text-[0.65rem] font-black uppercase tracking-widest text-black/50">
              Posição na Home
            </Label>
            <Select
              onValueChange={(val) => setHomePosition(val)}
              defaultValue={homePosition}
            >
              <SelectTrigger className="w-full rounded-none border-narrativa-cinza-linha h-11 font-bold">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="rounded-none bg-white border-narrativa-cinza-linha">
                {HOME_POSITIONS.map((pos) => (
                  <SelectItem
                    key={pos.value}
                    value={pos.value}
                    className="font-bold"
                  >
                    {pos.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 border-t border-black/5 pt-6">
            <Label className="text-[0.65rem] font-black uppercase tracking-widest text-black/50 flex items-center gap-2">
              <Tag className="w-3 h-3" /> Tags
            </Label>
            <div className="flex gap-1">
              <Input
                placeholder="Adicionar tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                }
                className="rounded-none border-narrativa-cinza-linha h-10"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="rounded-none h-10 bg-narrativa-preto"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tags
                .filter((t) => !HOME_POSITIONS.some((p) => p.value === t))
                .map((t) => (
                  <Badge
                    key={t}
                    className="rounded-none text-[0.6rem] font-bold uppercase bg-black/5 text-black/70 hover:bg-narrativa-vermelho hover:text-white transition-colors py-1 px-2 flex items-center gap-1"
                  >
                    {t}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setTags((prev) => prev.filter((tag) => tag !== t))
                      }
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
