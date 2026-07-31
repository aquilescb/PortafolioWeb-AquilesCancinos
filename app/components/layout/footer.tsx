export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-ink/10 dark:border-ink-dark/15 border-t">
      <div className="text-ink/60 dark:text-ink-dark/60 mx-auto max-w-3xl px-6 py-8 text-sm">
        <p>&copy; {year} Aquiles Cancinos</p>
      </div>
    </footer>
  );
}
