import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-narrativa-preto flex flex-col items-center justify-center p-6">
      <div className="mb-10">
        <Link href="/">
          <div className="flex items-center gap-3">
             <Image 
                src="/imgs/logo.png" 
                alt="Narrativa Logo" 
                width={180} 
                height={45} 
                className="brightness-0 invert"
                style={{ height: 'auto' }}
             />
          </div>
        </Link>
      </div>
      
      <div className="w-full max-w-[440px] bg-white p-10 lg:p-14 shadow-2xl relative overflow-hidden">
        {/* Detalhe estético no topo do card */}
        <div className="absolute top-0 left-0 w-full h-1 bg-narrativa-vermelho" />
        
        {children}
      </div>
      
      <div className="mt-8 text-white/30 text-[0.65rem] tracking-[0.15em] uppercase font-bold">
        © {new Date().getFullYear()} Narrativa — Matéria Política
      </div>
    </div>
  )
}
