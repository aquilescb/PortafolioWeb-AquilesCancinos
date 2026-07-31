import type { Route } from "./+types/home";

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

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">
        Aquiles Cancinos
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Portfolio en construcción.
      </p>
    </main>
  );
}
