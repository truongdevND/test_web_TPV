const variants = {
  primary:
    "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
  secondary:
    "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-indigo-500/20",
  outline:
    "text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:ring-indigo-500/30",
  ghost:
    "text-slate-700 bg-transparent hover:bg-slate-100 focus:ring-slate-400/30",
  danger:
    "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2",
};

function Button({
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  icon,
  iconPosition = "start",
  children,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors";
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  const iconEl = icon ? (
    <span className="shrink-0 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:shrink-0">{icon}</span>
  ) : null;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {iconPosition === "end" ? (
        <>
          {children}
          {iconEl}
        </>
      ) : (
        <>
          {iconEl}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
