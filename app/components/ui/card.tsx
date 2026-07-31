import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`border-ink/10 dark:border-ink-dark/15 rounded-sm border p-6 ${className}`}
      {...props}
    />
  );
}
