function Pagination({ page, totalPages, totalRecords, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalRecords);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 bg-slate-50/50 border-t border-slate-200">
      <span className="text-sm text-slate-500">
        Hiển thị <span className="font-medium text-slate-700">{startRecord}</span>
        {" – "}
        <span className="font-medium text-slate-700">{endRecord}</span>
        {" / "}
        <span className="font-medium text-slate-700">{totalRecords}</span> bản ghi
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Trước
        </button>
        <span className="min-w-[80px] text-center text-sm font-medium text-slate-600">
          Trang {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          Sau
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Pagination;
