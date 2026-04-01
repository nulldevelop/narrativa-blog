import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-[1.8rem] font-black tracking-[-0.02em] text-narrativa-preto mb-2">
          Entrar
        </h1>
        <p className="text-[0.9rem] text-narrativa-cinza-texto font-light">
          Acesse sua conta para acompanhar análises e receber conteúdo exclusivo.
        </p>
      </div>

      <form className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[0.7rem] tracking-[0.12em] uppercase font-bold text-narrativa-cinza-texto"
          >
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="rounded-none border-narrativa-cinza-linha px-4 py-5 text-[0.9rem] focus:border-narrativa-preto transition-colors"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-[0.7rem] tracking-[0.12em] uppercase font-bold text-narrativa-cinza-texto"
            >
              Senha
            </Label>
            <Link
              href="#"
              className="text-[0.68rem] tracking-[0.08em] text-narrativa-vermelho hover:text-narrativa-preto transition-colors font-semibold"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="rounded-none border-narrativa-cinza-linha px-4 py-5 text-[0.9rem] focus:border-narrativa-preto transition-colors"
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-none bg-narrativa-preto hover:bg-narrativa-vermelho text-narrativa-branco text-[0.72rem] font-bold tracking-[0.14em] uppercase py-6 transition-colors"
        >
          Entrar
        </Button>
      </form>

    </div>
  );
}
