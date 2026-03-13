interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
  loadingText?: string;
}

export function Button({
  variant = "primary",
  loading,
  loadingText,
  children,
  disabled,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";

  function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isPrimary) {
      e.currentTarget.style.borderColor = "var(--earth)";
      e.currentTarget.style.background = "var(--cream)";
    }
    onMouseEnter?.(e);
  }
  function handleMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isPrimary) {
      e.currentTarget.style.borderColor = "var(--stone)";
      e.currentTarget.style.background = "var(--sand)";
    }
    onMouseLeave?.(e);
  }

  return (
    <button
      disabled={loading || disabled}
      className={`w-full flex items-center justify-center gap-2.5 rounded-lg py-2.5 text-[0.9rem] font-semibold tracking-[0.02em] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${className ?? ""}`}
      style={{
        ...(isPrimary
          ? {
              background: "var(--ink)",
              color: "var(--cream)",
              boxShadow: loading
                ? "none"
                : "0 1px 3px rgba(27,26,24,0.2), 0 4px 16px rgba(27,26,24,0.1)",
            }
          : {
              background: "var(--sand)",
              border: "1.5px solid var(--stone)",
              color: "var(--ink)",
            }),
        fontFamily: "var(--font-display)",
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {loadingText ?? "Loading…"}
        </>
      ) : (
        children
      )}
    </button>
  );
}
