import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { Prose } from "~/components/ui/prose";
import { Tag } from "~/components/ui/tag";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Aquiles Cancinos" },
    {
      name: "description",
      content:
        "Portfolio profesional de Aquiles Cancinos, desarrollador Full-Stack.",
    },
  ];
}

// Design-system preview for Phase 1. Real navigation, bilingual copy and
// project content replace this page in later phases.
export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-medium tracking-tight">Aquiles Cancinos</h1>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-3">
        Design system preview &mdash; page shell, typography, colour tokens and
        UI primitives for the editorial-technical direction.
      </p>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-medium tracking-tight">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary action</Button>
          <Button variant="secondary">Secondary action</Button>
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-medium tracking-tight">Tags</h2>
        <div className="flex flex-wrap gap-2">
          <Tag>React</Tag>
          <Tag>TypeScript</Tag>
          <Tag>PostgreSQL</Tag>
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-medium tracking-tight">Card</h2>
        <Card>
          <h3 className="font-display text-xl font-medium">Example card</h3>
          <p className="text-ink/70 dark:text-ink-dark/70 mt-2 text-sm">
            Hairline border, generous padding, no drop shadow.
          </p>
        </Card>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-medium tracking-tight">Prose</h2>
        <Prose>
          <p>
            Long-form text, such as a project case study, renders inside this
            reading measure with an accent-coloured{" "}
            <Link to="/">inline link</Link>.
          </p>
        </Prose>
      </section>
    </div>
  );
}
