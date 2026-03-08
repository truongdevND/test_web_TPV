import Skeleton from "./Skeleton";

function Table({ children, className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full border-collapse text-sm [&_tbody_tr:last-child_td]:border-b-0 ${className}`.trim()}
      >
        {children}
      </table>
    </div>
  );
}

function TableHead({ children }) {
  return <thead>{children}</thead>;
}

function TableHeadCell({ children, className = "" }) {
  return (
    <th
      className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/80 border-b border-slate-200 ${className}`.trim()}
    >
      {children}
    </th>
  );
}

function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

function TableRow({ children, className = "" }) {
  return (
    <tr
      className={`group border-b border-slate-100 last:border-0 hover:bg-indigo-50/50 transition-colors ${className}`.trim()}
    >
      {children}
    </tr>
  );
}

function TableCell({ children, className = "" }) {
  return (
    <td className={`px-5 py-4 text-left text-slate-600 ${className}`.trim()}>
      {children}
    </td>
  );
}

function TableEmpty({ icon, title, description }) {
  return (
    <div className="py-16 px-6 text-center">
      {icon && (
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4 [&>svg]:h-6 [&>svg]:w-6">
          {icon}
        </div>
      )}
      {title && <p className="text-slate-500 font-medium">{title}</p>}
      {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
    </div>
  );
}

function TableSkeletonCell() {
  return (
    <td className="px-5 py-4">
      <Skeleton className="h-4 w-full max-w-[120px]" />
    </td>
  );
}

function TableSkeletonRow({ colCount = 7 }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: colCount }).map((_, i) => (
        <TableSkeletonCell key={i} />
      ))}
    </tr>
  );
}

Table.Head = TableHead;
Table.HeadCell = TableHeadCell;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.Empty = TableEmpty;
Table.SkeletonCell = TableSkeletonCell;
Table.SkeletonRow = TableSkeletonRow;

export default Table;
