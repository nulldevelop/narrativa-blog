import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import { Toaster } from 'sonner'
import './styles/globals.css'

const heading = Merriweather({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const inter = Inter({
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
      className={`${heading.variable} ${inter.variable}`}
    >
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
