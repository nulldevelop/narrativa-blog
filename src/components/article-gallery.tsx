'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  url: string
  credit?: string
}

interface ArticleGalleryProps {
  images: GalleryImage[]
}

const MAX_VISIBLE = 8

export function ArticleGallery({ images }: ArticleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const total = images?.length ?? 0
  const isOpen = selectedIndex !== null

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null)
    document.body.style.overflow = 'auto'
  }, [])

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? prev : (prev + 1) % total))
  }, [total])

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? prev : (prev - 1 + total) % total,
    )
  }, [total])

  // Navegação pelo teclado: ← → trocam de foto, Esc fecha
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'Escape') closeLightbox()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goNext, goPrev, closeLightbox])

  if (!images || images.length === 0) return null

  const hasOverflow = images.length > MAX_VISIBLE
  // Quando há mais fotos que o limite, mostramos 7 e reservamos a 8ª célula
  // para o botão "+N". Caso contrário, mostramos todas as imagens visíveis.
  const visibleImages = hasOverflow
    ? images.slice(0, MAX_VISIBLE - 1)
    : images.slice(0, MAX_VISIBLE)
  const remainingCount = images.length - (MAX_VISIBLE - 1)
  const overflowImage = images[MAX_VISIBLE - 1]

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    goNext()
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    goPrev()
  }

  return (
    <div className="mt-6">
      <h3 className="text-[0.65rem] font-black tracking-[0.2em] uppercase text-narrativa-vermelho mb-6 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-narrativa-cinza-linha">
        Galeria de Fotos
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleImages.map((img, index) => (
          <div key={img.url} className="space-y-2">
            <div
              className="relative aspect-square cursor-pointer overflow-hidden border border-narrativa-cinza-linha hover:opacity-90 transition-opacity"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={img.url}
                alt={`Foto da galeria ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
            {img.credit && (
              <p className="text-[0.55rem] text-narrativa-cinza-texto uppercase tracking-widest italic truncate px-1">
                {img.credit}
              </p>
            )}
          </div>
        ))}

        {hasOverflow && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => openLightbox(MAX_VISIBLE - 1)}
              className="group relative aspect-square w-full cursor-pointer overflow-hidden border border-narrativa-cinza-linha"
            >
              <Image
                src={overflowImage.url}
                alt={`Mais ${remainingCount} fotos da galeria`}
                fill
                className="object-cover scale-105 blur-sm transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <span className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white transition-colors group-hover:bg-black/60">
                <span className="text-2xl font-black leading-none">+{remainingCount}</span>
                <span className="mt-1 text-[0.55rem] font-medium uppercase tracking-[0.2em] text-white/80">
                  fotos
                </span>
              </span>
            </button>
          </div>
        )}
      </div>

      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          <button 
            type="button"
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-[110]"
            onClick={closeLightbox}
          >
            <X className="w-8 h-8" />
          </button>

          <button 
            type="button"
            className="absolute left-4 md:left-8 text-white/40 hover:text-white transition-colors z-[110]"
            onClick={prevImage}
          >
            <ChevronLeft className="w-10 h-10 md:w-16 md:h-16" />
          </button>

          <button 
            type="button"
            className="absolute right-4 md:right-8 text-white/40 hover:text-white transition-colors z-[110]"
            onClick={nextImage}
          >
            <ChevronRight className="w-10 h-10 md:w-16 md:h-16" />
          </button>

          <div className="relative w-full h-full max-w-5xl max-h-[85vh] flex flex-col items-center justify-center gap-4">
            <div className="relative w-full flex-1">
              <Image
                src={images[selectedIndex].url}
                alt={`Foto da galeria ${selectedIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            {images[selectedIndex].credit && (
              <p className="text-white/60 text-[0.65rem] uppercase tracking-[0.2em] font-medium italic">
                {images[selectedIndex].credit}
              </p>
            )}
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 text-center text-white/40 text-[0.7rem] uppercase tracking-widest">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}
