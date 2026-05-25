'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  url: string
  credit?: string
}

interface ArticleGalleryProps {
  images: GalleryImage[]
}

export function ArticleGallery({ images }: ArticleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
    document.body.style.overflow = 'auto'
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
  }

  return (
    <div className="mt-12">
      <h3 className="text-[0.65rem] font-black tracking-[0.2em] uppercase text-narrativa-vermelho mb-6 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-narrativa-cinza-linha">
        Galeria de Fotos
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
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
