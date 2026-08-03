import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/i18n/use-translation";

interface ContactEmailProps {
  user: string;
  domain: string;
}

const COPIED_RESET_MS = 2000;
const noSubscription = () => () => {};

// True only once the client has hydrated. `useSyncExternalStore` returns its
// server snapshot (`false`) during prerendering and its client snapshot
// (`true`) after mount, without a `setState`-in-effect that would trigger an
// extra render pass.
function useIsHydrated(): boolean {
  return useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
}

// Lightweight obfuscation against naive scrapers (plan §17, decision 4). Two
// things have to both hold for this to work, not just the rendered label:
// - The visible text reads "user [at] domain", and the real `mailto:` href
//   is only set client-side, after hydration.
// - The caller passes `user`/`domain` split apart, not a joined `email`
//   string: with `ssr:false` prerender, a route's *entire* loader return
//   value is serialized into the page for hydration regardless of what the
//   component renders, so a pre-joined field would leak the plain address
//   into the static HTML even though the DOM output never shows it.
// The joined address only ever exists as a local variable here, inside
// client code — never in props, state, or loader data.
export function ContactEmail({ user, domain }: ContactEmailProps) {
  const t = useTranslation();
  const isHydrated = useIsHydrated();
  const [copied, setCopied] = useState(false);
  const email = `${user}@${domain}`;

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
  }

  const label = `${user} [at] ${domain.replace(".", " [dot] ")}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={isHydrated ? `mailto:${email}` : undefined}
        className="text-accent dark:text-accent-dark underline decoration-1 underline-offset-2 hover:decoration-2"
      >
        {label}
      </a>
      <Button type="button" variant="secondary" onClick={handleCopy}>
        {copied ? t.contact.emailCopied : t.contact.copyEmail}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t.contact.emailCopied : ""}
      </span>
    </div>
  );
}
