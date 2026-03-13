import { forwardRef, type ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, suffix, className, onFocus, onBlur, ...props }, ref) => {
    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      e.currentTarget.style.borderColor = "var(--claude-tan)";
      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(217,124,93,0.12)";
      onFocus?.(e);
    }
    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
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
          <input
            ref={ref}
            id={id}
            className={`w-full rounded px-3.5 py-2.5 text-[0.93rem] outline-none transition-all duration-200 ${suffix ? "pr-10" : ""} ${className ?? ""}`}
            style={{
              background: "var(--sand)",
              border: "1.5px solid var(--stone)",
              color: "var(--ink)",
              fontFamily: "var(--font-body)",
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
