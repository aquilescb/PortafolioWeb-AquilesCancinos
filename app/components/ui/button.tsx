import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark hover:opacity-90",
  secondary:
    "border border-ink/20 dark:border-ink-dark/25 hover:border-ink/40 dark:hover:border-ink-dark/45",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium transition-[opacity,border-color] duration-200 motion-reduce:transition-none ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
