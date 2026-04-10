import Link from "next/link";

interface PaginationProps {
  current: number;
  total: number;
}

export function Pagination({ current, total }: PaginationProps) {
  return (
    <nav className="flex justify-center items-center gap-1.5 py-12" aria-label="Paginação">
      {/* Previous page link */}
      {current > 1 && (
        <Link
          href={`?page=${current - 1}#posts`}
          aria-label="Página anterior"
          className="flex items-center justify-center w-10 h-10 text-[0.8rem] font-bold border border-narrativa-cinza-linha hover:bg-narrativa-preto hover:text-narrativa-branco hover:border-narrativa-preto transition-all"
        >
          ‹
        </Link>
      )}

      {/* Page number links */}
      {Array.from({ length: total }, (_, i) => i + 1).map((page) =>
        page === current ? (
          <span
            key={page}
            className="flex items-center justify-center w-10 h-10 text-[0.8rem] font-bold bg-narrativa-vermelho text-narrativa-branco border border-narrativa-vermelho"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={`?page=${page}#posts`}
            className="flex items-center justify-center w-10 h-10 text-[0.8rem] font-bold border border-narrativa-cinza-linha hover:bg-narrativa-preto hover:text-narrativa-branco hover:border-narrativa-preto transition-all"
          >
            {page}
          </Link>
        )
      )}

      {/* Next page link */}
      {current < total && (
        <Link
          href={`?page=${current + 1}#posts`}
          aria-label="Próxima página"
          className="flex items-center justify-center w-10 h-10 text-[0.8rem] font-bold border border-narrativa-cinza-linha hover:bg-narrativa-preto hover:text-narrativa-branco hover:border-narrativa-preto transition-all"
        >
          ›
        </Link>
      )}
    </nav>
  );
}
