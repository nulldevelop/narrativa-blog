interface SeparatorSectionProps {
  text: string;
}

export function SeparatorSection({ text }: SeparatorSectionProps) {
  return (
    <div className="flex items-center gap-4 pt-10 mb-10">
      <span className="flex-1 h-px bg-narrativa-vermelho" />
      <span className="text-[0.62rem] tracking-[0.25em] uppercase text-narrativa-vermelho font-bold">
        {text}
      </span>
      <span className="flex-1 h-px bg-narrativa-vermelho" />
    </div>
  );
}
