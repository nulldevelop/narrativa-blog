import Link from 'next/link'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-narrativa-preto flex flex-col items-center justify-center p-6">
      <div className="mb-10">
        <Link href="/" className="flex flex-col gap-[0.2rem] leading-none">
          <span className="font-heading text-[2.2rem] font-black tracking-[0.08em] text-white uppercase">
            NARRATIVA<span className="text-narrativa-vermelho">.</span>
          </span>
          <span className="text-[0.7rem] tracking-[0.25em] uppercase text-white/40 font-light">
            política, poder e <span className="text-narrativa-vermelho">versão</span>
          </span>
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
