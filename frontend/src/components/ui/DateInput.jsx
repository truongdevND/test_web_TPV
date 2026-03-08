import Input from "./Input";

function DateInput({
  id,
  name,
  label,
  error,
  required,
  value,
  onChange,
  disabled,
  min,
  max,
  className = "",
  ...props
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Input
      id={id || name}
      name={name}
      type="date"
      label={label}
      error={error}
      required={required}
      value={value}
      onChange={onChange}
      disabled={disabled}
      min={min}
      max={max ?? today}
      className={className}
      {...props}
    />
  );
}

export default DateInput;
