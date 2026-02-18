export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 rounded-lg border border-[#3B170D]/30 text-[#3B170D] hover:bg-[#3B170D]/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition font-instrument-sans"
        aria-label="Previous page"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {start > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="w-10 h-10 rounded-lg border border-[#3B170D]/30 text-[#3B170D] hover:bg-[#3B170D]/10 transition font-instrument-sans"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-[#3B170D]/60">…</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-instrument-sans transition ${
              page === currentPage
                ? "bg-[#3B170D] text-[#FFF3EB] border border-[#3B170D]"
                : "border border-[#3B170D]/30 text-[#3B170D] hover:bg-[#3B170D]/10"
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-[#3B170D]/60">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 rounded-lg border border-[#3B170D]/30 text-[#3B170D] hover:bg-[#3B170D]/10 transition font-instrument-sans"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 rounded-lg border border-[#3B170D]/30 text-[#3B170D] hover:bg-[#3B170D]/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition font-instrument-sans"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
