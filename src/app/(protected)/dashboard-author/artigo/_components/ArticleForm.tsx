/** biome-ignore-all lint/suspicious/noImplicitAnyLet: <explanation> */
'use client'

import { Eye, Plus, Save, Send, Tag, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
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
import { updateArticleAction } from '../_actions/update-article'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
)

interface ArticleFormProps {
  categories: { id: string; name: string }[]
  initialData?: {
    id: string
    title: string
    subtitle: string | null
    content: string
    categoryId: string | null
    coverImage: string | null
    tags: string[]
    status: string
    images?: string[]
  }
}

const HOME_POSITIONS = [
  { value: 'home-principal', label: 'Principal (Home)' },
  { value: 'home-destaque-1', label: 'Destaque 1' },
  { value: 'home-destaque-2', label: 'Destaque 2' },
  { value: 'home-destaque-3', label: 'Destaque 3' },
  { value: 'home-geral-1', label: 'Geral 1' },
  { value: 'home-geral-2', label: 'Geral 2' },
]

export function ArticleForm({ categories, initialData }: ArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [content, setContent] = useState<string | undefined>(
    initialData?.content || '',
  )
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    initialData?.images || [],
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    categoryId: initialData?.categoryId || '',
    coverImage: initialData?.coverImage || '',
  })

  const [homePosition, setHomePosition] = useState<string>(
    initialData?.tags.find((t) => HOME_POSITIONS.some((p) => p.value === t)) ||
      '',
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

  const copyToClipboard = (url: string) => {
    const markdownImage = `![Descrição da imagem](${url})`
    navigator.clipboard.writeText(markdownImage)
    toast.success('Código Markdown copiado! Cole no texto.')
  }

  // Gera ID único para pasta da matéria
  const getArticleFolderId = () => {
    if (initialData?.id) return initialData.id
    // Gera um ID único baseado no timestamp para novas matérias
    return `novo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    let uploaded = 0
    const articleId = getArticleFolderId()

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
    if (!formData.title) return toast.error('O título é obrigatório.')
    if (!content || content.length < 50)
      return toast.error('O conteúdo deve ter pelomeno 50 caracteres.')
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
        content: content || '',
        tags: finalTags,
        status,
      }
      let result
      if (initialData?.id) {
        result = await updateArticleAction(initialData.id, payload)
      } else {
        result = await createArticleAction(payload)
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

  const handlePreview = () => {
    if (!formData.title) return toast.error('O título é obrigatório.')
    if (!content || content.length < 50)
      return toast.error('O conteúdo deve ter pelo menos 50 caracteres.')
    if (!formData.categoryId) return toast.error('Selecione uma categoria.')

    router.push('/dashboard-author/artigo/preview/new')
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
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height={450}
              className="!rounded-none border-narrativa-cinza-linha bg-white"
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
              onClick={handlePreview}
              variant="outline"
              className="w-full rounded-none h-10 text-[0.7rem] font-bold uppercase tracking-widest border-narrativa-cinza-linha text-narrativa-preto"
            >
              <Eye className="w-4 h-4 mr-2" /> Visualizar
            </Button>

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
              <div className="aspect-video w-full mt-3 border border-narrativa-cinza-linha overflow-hidden relative">
                <Image
                  src={formData.coverImage}
                  alt="Capa"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {uploadedImages.length > 0 && (
            <div className="space-y-2 border-t border-black/5 pt-4">
              <Label className="text-[0.65rem] font-black uppercase tracking-widest text-black/50">
                Imagens Enviadas
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {uploadedImages.map((url) => (
                  <button
                    key={url}
                    type="button"
                    className="relative aspect-video border border-narrativa-cinza-linha overflow-hidden group cursor-pointer"
                    onClick={() => {
                      console.log('clicou na imagem', url)
                      copyToClipboard(url)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        copyToClipboard(url)
                      }
                    }}
                  >
                    <Image
                      src={url}
                      alt="Imagem enviada"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[0.5rem] font-bold uppercase">
                        Copiar
                      </span>
                    </div>
                  </button>
                ))}
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
                    className="rounded-none text-[0.6rem] font-bold uppercase bg-black/5 hover:bg-narrativa-vermelho hover:text-white transition-colors py-1 px-2 flex items-center gap-1"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => prev.filter((tag) => tag !== t))
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
