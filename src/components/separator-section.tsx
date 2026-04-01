interface SeparatorSectionProps {
  text: string;
}

export function SeparatorSection({ text }: SeparatorSectionProps) {
  return (
    <div className="flex items-center gap-4 pt-10 mb-10">
      <span className="flex-1 h-px bg-narrativa-cinza-linha" />
      <span className="text-[0.62rem] tracking-[0.25em] uppercase text-[#bbb]">
        {text}
      </span>
      <span className="flex-1 h-px bg-narrativa-cinza-linha" />
    </div>
  );
}
