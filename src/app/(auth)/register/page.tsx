"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });

    if (error) {
      console.error("Erro no registro:", error);
      toast.error(error.message || "Erro ao criar conta (Verifique se a senha tem pelo menos 8 caracteres)");
      setLoading(false);
    } else {
      toast.success("Conta criada com sucesso!");
      router.push("/login");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-[1.8rem] font-black tracking-[-0.02em] text-narrativa-preto mb-2">
          Criar Conta
        </h1>
        <p className="text-[0.9rem] text-narrativa-cinza-texto font-light">
          Preencha os dados abaixo para se tornar um autor na Narrativa.
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-[0.7rem] tracking-[0.12em] uppercase font-bold text-narrativa-cinza-texto"
          >
            Nome Completo
          </Label>
          <Input
            id="name"
            type="text"
            required
            placeholder="Seu nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="rounded-none border-narrativa-cinza-linha px-4 py-5 text-[0.9rem] focus:border-narrativa-preto transition-colors"
          />
        </div>

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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="rounded-none border-narrativa-cinza-linha px-4 py-5 text-[0.9rem] focus:border-narrativa-preto transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-[0.7rem] tracking-[0.12em] uppercase font-bold text-narrativa-cinza-texto"
          >
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="rounded-none border-narrativa-cinza-linha px-4 py-5 text-[0.9rem] focus:border-narrativa-preto transition-colors"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-none bg-narrativa-preto hover:bg-narrativa-vermelho text-narrativa-branco text-[0.72rem] font-bold tracking-[0.14em] uppercase py-6 transition-colors"
        >
          {loading ? "Criando conta..." : "Registrar"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-[0.8rem] text-narrativa-cinza-texto">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-narrativa-vermelho font-bold hover:underline"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
