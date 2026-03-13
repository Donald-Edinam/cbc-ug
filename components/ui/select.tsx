import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, placeholder, options, onFocus, onBlur, value, className, ...props }, ref) => {
    function handleFocus(e: React.FocusEvent<HTMLSelectElement>) {
      e.currentTarget.style.borderColor = "var(--claude-tan)";
      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(217,124,93,0.12)";
      onFocus?.(e);
    }
    function handleBlur(e: React.FocusEvent<HTMLSelectElement>) {
      e.currentTarget.style.borderColor = "var(--stone)";
      e.currentTarget.style.boxShadow = "none";
      onBlur?.(e);
    }

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={id}
            className="text-[0.72rem] font-semibold uppercase tracking-widest"
            style={{ color: "var(--bark)", fontFamily: "var(--font-display)" }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            value={value}
            className={`w-full rounded px-3.5 py-2.5 pr-9 text-[0.93rem] outline-none transition-all duration-200 appearance-none cursor-pointer ${className ?? ""}`}
            style={{
              background: "var(--sand)",
              border: "1.5px solid var(--stone)",
              color: value ? "var(--ink)" : "var(--earth)",
              fontFamily: "var(--font-body)",
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--earth)", fontSize: "0.6rem" }}
          >
            ▾
          </span>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
