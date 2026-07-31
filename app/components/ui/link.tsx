import type { ComponentProps } from "react";
import { Link as RouterLink } from "react-router";

type LinkProps = ComponentProps<typeof RouterLink>;

// Inline text link with the accent underline used throughout prose and
// navigation. Distinct from Button, which renders as a filled or outlined
// control rather than underlined text.
export function Link({ className = "", ...props }: LinkProps) {
  return (
    <RouterLink
      className={`text-accent dark:text-accent-dark underline decoration-1 underline-offset-2 hover:decoration-2 ${className}`}
      {...props}
    />
  );
}
