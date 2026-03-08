function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 ${className}`.trim()}
      aria-hidden
      {...props}
    />
  );
}

export default Skeleton;
