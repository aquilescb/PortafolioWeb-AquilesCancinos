import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium transition-[opacity,border-color] duration-200 motion-reduce:transition-none";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark hover:opacity-90",
  secondary:
    "border border-ink/20 dark:border-ink-dark/25 hover:border-ink/40 dark:hover:border-ink-dark/45",
};

// Shared with `Link` for cases that need button styling on a real navigation
// link (e.g. a hero CTA) — a `<button>` would be the wrong element there.
export function buttonClassName(variant: ButtonVariant = "primary"): string {
  return `${BASE_CLASSES} ${variantClasses[variant]}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`${buttonClassName(variant)} ${className}`} {...props} />
  );
}
