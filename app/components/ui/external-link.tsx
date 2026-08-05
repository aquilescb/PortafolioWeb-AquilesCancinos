import type { ComponentProps } from "react";
import { useTranslation } from "~/i18n/use-translation";

type ExternalLinkProps = ComponentProps<"a">;

// Real external navigation (GitHub, LinkedIn, a live demo): a plain <a>, not
// the internal `Link`, which resolves `to` against app routes and would
// mangle an absolute external URL. Opens in a new tab, with a visually
// hidden hint for screen reader users per WCAG 2.2 SC 3.2.5.
export function ExternalLink({
  className = "",
  children,
  ...props
}: ExternalLinkProps) {
  const t = useTranslation();

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={`text-accent dark:text-accent-dark underline decoration-1 underline-offset-2 hover:decoration-2 ${className}`}
      {...props}
    >
      {children}
      <span className="sr-only"> {t.common.opensInNewTab}</span>
    </a>
  );
}
