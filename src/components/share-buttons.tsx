"use client"


import { useEffect, useState } from "react"
import { toast } from "sonner"

// We use an inline SVG for WhatsApp since Lucide doesn't have a specific WhatsApp icon,
// or we can use the MessageCircle for WhatsApp if we want to be pure lucide.
// Usually Lucide has no Whatsapp. I'll use a custom SVG for whatsapp for better UX, or just use tabler-icons since they have @tabler/icons-react in package.json!
// Let's use @tabler/icons-react which has IconBrandWhatsapp, IconBrandFacebook, IconBrandX, IconBrandLinkedin, IconLink

import {
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandX,
  IconBrandLinkedin,
  IconLink
} from "@tabler/icons-react"

export function ShareButtons({
  title,
  slug,
  className = "",
  theme = "light"
}: {
  title: string
  slug: string
  className?: string
  theme?: "light" | "dark"
}) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    setUrl(`${window.location.origin}/artigo/${slug}`)
  }, [slug])

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(url)
    toast.success("Link copiado para a área de transferência!")
  }

  // Prevent event propagation so clicking the buttons doesn't trigger the Link wrapper in cards
  const stopProp = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (!url) return null

  const baseTextColor = theme === "dark" ? "text-white/40" : "text-narrativa-cinza-texto"
  const hoverCopyColor = theme === "dark" ? "hover:text-white" : "hover:text-narrativa-preto"

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={stopProp}
        className={`${baseTextColor} hover:text-[#25D366] transition-colors`}
        aria-label="Compartilhar no WhatsApp"
      >
        <IconBrandWhatsapp size={18} stroke={1.5} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={stopProp}
        className={`${baseTextColor} hover:text-[#1877F2] transition-colors`}
        aria-label="Compartilhar no Facebook"
      >
        <IconBrandFacebook size={18} stroke={1.5} />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={stopProp}
        className={`${baseTextColor} hover:text-[#1DA1F2] transition-colors`}
        aria-label="Compartilhar no X (Twitter)"
      >
        <IconBrandX size={18} stroke={1.5} />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={stopProp}
        className={`${baseTextColor} hover:text-[#0A66C2] transition-colors`}
        aria-label="Compartilhar no LinkedIn"
      >
        <IconBrandLinkedin size={18} stroke={1.5} />
      </a>
      <button
        onClick={copyLink}
        className={`${baseTextColor} ${hoverCopyColor} transition-colors`}
        aria-label="Copiar link"
      >
        <IconLink size={18} stroke={1.5} />
      </button>
    </div>
  )
}
