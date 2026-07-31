import type { HTMLAttributes } from "react";

type TagProps = HTMLAttributes<HTMLSpanElement>;

export function Tag({ className = "", ...props }: TagProps) {
  return (
    <span
      className={`border-ink/15 text-ink/70 dark:border-ink-dark/20 dark:text-ink-dark/70 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${className}`}
      {...props}
    />
  );
}
