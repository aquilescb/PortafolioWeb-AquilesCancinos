import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";
import { SkipLink } from "./components/layout/skip-link";
import "./app.css";

export const links: Route.LinksFunction = () => [
  {
    rel: "preload",
    href: "/fonts/inter-variable.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/fraunces-variable.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

// Applies the stored or system theme before first paint so the page never
// flashes the wrong color scheme. Static, developer-authored string with no
// request-derived input, so injecting it verbatim is safe.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        <SkipLink />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-medium tracking-tight">{message}</h1>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-2">{details}</p>
      {stack && (
        <pre className="border-ink/10 dark:border-ink-dark/15 mt-6 w-full overflow-x-auto rounded-sm border p-4 text-sm">
          <code>{stack}</code>
        </pre>
      )}
    </div>
  );
}
