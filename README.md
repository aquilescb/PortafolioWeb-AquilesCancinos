# Portfolio — Aquiles Cancinos

[Español](#español) · [English](#english)

---

## Español

Portfolio profesional bilingüe construido como un registro vivo de mi trayectoria
en informática: proyectos y casos de estudio, formación, certificaciones, hitos y
prensa.

Es un sitio **completamente estático**: no hay backend, base de datos ni CMS. El
contenido vive en el repositorio, tipado con TypeScript y validado con Zod, y se
pre-renderiza a HTML en el build.

### Stack

React 19 · TypeScript · Vite · React Router 8 (framework mode) · Tailwind CSS 4 ·
Zod · MDX · Vitest · React Testing Library

### Requisitos

Node 24 (ver [`.nvmrc`](.nvmrc)).

### Puesta en marcha

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
```

### Scripts

| Script                 | Descripción                               |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Servidor de desarrollo con HMR            |
| `npm run build`        | Build de producción, genera HTML estático |
| `npm run preview`      | Sirve el build estático localmente        |
| `npm run typecheck`    | Genera tipos de rutas y ejecuta `tsc`     |
| `npm run lint`         | ESLint                                    |
| `npm run format:check` | Verifica el formato con Prettier          |
| `npm run test`         | Tests con Vitest                          |

### Documentación

- [`CLAUDE.md`](CLAUDE.md) — reglas permanentes del proyecto
- [`docs/adr/`](docs/adr/) — decisiones de arquitectura

---

## English

Bilingual professional portfolio built as a living record of my work in software:
projects and case studies, education, certifications, milestones and press.

It is a **fully static** site: no backend, no database, no CMS. Content lives in
the repository, typed with TypeScript and validated with Zod, and is pre-rendered
to HTML at build time.

### Stack

React 19 · TypeScript · Vite · React Router 8 (framework mode) · Tailwind CSS 4 ·
Zod · MDX · Vitest · React Testing Library

### Requirements

Node 24 (see [`.nvmrc`](.nvmrc)).

### Getting started

```bash
npm install
npm run dev        # development server at http://localhost:5173
```

### Scripts

| Script                 | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Development server with HMR         |
| `npm run build`        | Production build, emits static HTML |
| `npm run preview`      | Serve the static build locally      |
| `npm run typecheck`    | Generate route types and run `tsc`  |
| `npm run lint`         | ESLint                              |
| `npm run format:check` | Verify formatting with Prettier     |
| `npm run test`         | Run tests with Vitest               |

### Documentation

- [`CLAUDE.md`](CLAUDE.md) — permanent project rules
- [`docs/adr/`](docs/adr/) — architecture decision records
