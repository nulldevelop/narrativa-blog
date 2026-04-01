"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewsletterWidgetProps {
  variant?: "sidebar" | "inline";
  buttonLabel?: string;
}

export function NewsletterWidget({
  variant = "sidebar",
  buttonLabel = "Assinar gratuitamente",
}: NewsletterWidgetProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  function handleSubmit() {
    if (email.includes("@") && email.includes(".")) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
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
          ${error ? "border-narrativa-vermelho" : ""}
          ${variant === "inline" ? "bg-white" : ""}
        `}
      />
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={submitted}
        className={`
          w-full rounded-none text-[0.68rem] font-bold tracking-[0.16em] uppercase py-5
          ${submitted ? "bg-[#2a7a2a]" : "bg-narrativa-preto hover:bg-narrativa-vermelho"}
          text-narrativa-branco
        `}
      >
        {submitted ? "✓ Inscrito!" : buttonLabel}
      </Button>
    </div>
  );
}
