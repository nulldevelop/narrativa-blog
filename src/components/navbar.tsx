"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/#posts", label: "Matérias" },
  { href: "/#bastidores", label: "Bastidores" },
  { href: "/colunistas", label: "Colunistas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        navRef.current &&
        !navRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="bg-narrativa-preto border-b-[3px] border-narrativa-vermelho sticky top-0 z-100">
      <div className="flex items-center justify-between px-[clamp(1.5rem,5vw,4rem)] py-[0.8rem] max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/imgs/logo.png"
            alt="Narrativa — política, poder e versão"
            width={320}
            height={80}
            className="h-20 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav
          ref={navRef}
          className={`
            flex items-center gap-8
            max-md:hidden
          `}
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("#")[0]) &&
                  link.href !== "/";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  text-[0.72rem] tracking-[0.14em] uppercase font-bold transition-colors
                  ${isActive ? "text-narrativa-vermelho" : "text-narrativa-vermelho hover:text-white"}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          ref={btnRef}
          type="button"
          className="md:hidden flex flex-col gap-[5px] cursor-pointer p-1 bg-transparent border-none"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span
            className="block w-6 h-0.5 bg-white transition-all duration-300"
            style={
              open
                ? { transform: "translateY(7px) rotate(45deg)" }
                : undefined
            }
          />
          <span
            className="block w-6 h-0.5 bg-white transition-all duration-300"
            style={
              open ? { opacity: 0, transform: "scaleX(0)" } : undefined
            }
          />
          <span
            className="block w-6 h-0.5 bg-white transition-all duration-300"
            style={
              open
                ? { transform: "translateY(-7px) rotate(-45deg)" }
                : undefined
            }
          />
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <nav className="md:hidden flex flex-col border-t border-white/[0.08] bg-[#0f0f0f] z-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-[clamp(1.5rem,5vw,4rem)] py-4 text-[0.72rem] tracking-[0.14em] uppercase font-bold text-narrativa-vermelho hover:text-white border-b border-white/[0.06] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
