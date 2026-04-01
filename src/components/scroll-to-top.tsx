"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
      className={`
        fixed bottom-8 right-8 w-11 h-11 bg-narrativa-preto text-narrativa-branco
        border border-white/15 flex items-center justify-center cursor-pointer
        transition-all duration-300 hover:bg-narrativa-vermelho hover:border-narrativa-vermelho
        text-base z-50
        ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      ↑
    </button>
  );
}
