import Button from "../ui/Button";

const PrevIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const NextIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

function Pagination({ page, totalPages, totalRecords, pageSize, onPageChange, disabled = false }) {
  if (totalPages <= 1 && !disabled) return null;

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
        <Button
          type="button"
          variant="secondary"
          size="md"
          icon={<PrevIcon />}
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Trước
        </Button>
        <span className="min-w-[80px] text-center text-sm font-medium text-slate-600">
          Trang {page} / {totalPages}
        </span>
        <Button
          type="button"
          variant="secondary"
          size="md"
          icon={<NextIcon />}
          iconPosition="end"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
