'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { salvarEmail } from '@/app/(public)/_actions/newsletter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NewsletterWidgetProps {
  variant?: 'sidebar' | 'inline'
  buttonLabel?: string
}

export function NewsletterWidget({
  variant = 'sidebar',
  buttonLabel = 'Assinar gratuitamente',
}: NewsletterWidgetProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Email inválido')
      return
    }

    setLoading(true)
    const result = await salvarEmail(email)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      setSubmitted(true)
      setEmail('')
      toast.success('Email salvo! Você receberá nossas matérias.')
      setTimeout(() => {
        setSubmitted(false)
        setLoading(false)
      }, 4000)
    }
  }

  return (
    <div>
      <Input
        type="email"
        placeholder="seu@email.com"
        aria-label="Seu endereço de e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitted}
        className={`
          w-full rounded-none border-narrativa-cinza-linha px-4 py-3 text-[0.85rem] font-sans mb-2
          focus:border-narrativa-preto
          ${variant === 'inline' ? 'bg-white' : ''}
        `}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit()
          }
        }}
      />
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={submitted || loading}
        className={`
          w-full rounded-none text-[0.68rem] font-bold tracking-[0.16em] uppercase py-5
          ${submitted ? 'bg-[#2a7a2a]' : 'bg-narrativa-preto hover:bg-narrativa-vermelho'}
          text-narrativa-branco
        `}
      >
        {loading ? 'Salvando...' : submitted ? '✓ Inscrito!' : buttonLabel}
      </Button>
    </div>
  )
}
