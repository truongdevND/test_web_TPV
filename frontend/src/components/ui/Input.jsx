const inputBase =
  "w-full px-3 py-2 border rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 border-slate-200 disabled:bg-slate-100 disabled:text-slate-500";

function Input({
  id,
  name,
  type = "text",
  label,
  error,
  required,
  placeholder,
  value,
  onChange,
  disabled,
  className = "",
  ...props
}) {
  const inputId = id || name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`${inputBase} ${className}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
