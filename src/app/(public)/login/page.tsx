"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message || "Erro ao fazer login");
      setLoading(false);
    } else {
      toast.success("Login realizado com sucesso!");
      router.push("/");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-[1.8rem] font-black tracking-[-0.02em] text-narrativa-preto mb-2">
          Entrar
        </h1>
        <p className="text-[0.9rem] text-narrativa-cinza-texto font-light">
          Acesse sua conta para acompanhar matérias e receber conteúdo exclusivo.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
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
            required
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-none border-narrativa-cinza-linha px-4 py-5 text-[0.9rem] focus:border-narrativa-preto transition-colors"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-none bg-narrativa-preto hover:bg-narrativa-vermelho text-narrativa-branco text-[0.72rem] font-bold tracking-[0.14em] uppercase py-6 transition-colors"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-[0.8rem] text-narrativa-cinza-texto">
          Ainda não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-narrativa-vermelho font-bold hover:underline"
          >
            Crie uma conta
          </Link>
        </p>
      </div>
    </div>
  );
}

