import type { Metadata } from 'next'
import { Inter, Literata } from 'next/font/google'
import { Toaster } from 'sonner'
import './styles/globals.css'

const heading = Literata({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const body = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Narrativa — política, poder e versão',
  description:
    'Matéria política com profundidade. O que está por trás do discurso público.',
  icons: {
    icon: '/imgs/N.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${heading.variable} ${body.variable}`}
    >
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
