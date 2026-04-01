import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Narrativa — política, poder e versão",
  description:
    "Análise política com profundidade. O que está por trás do discurso público.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
