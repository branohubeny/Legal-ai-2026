import Link from "next/link";

export default function DocumentsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-semibold">
            ⚖ LEGAL AI <span className="text-slate-500">2026</span>
          </Link>

          <Link href="/agent" className="text-sm text-slate-400 hover:text-white">
            AI Agent →
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          LEGAL DATABASE
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Právne dokumenty
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-slate-400">
          Databáza právnych predpisov, ich verzií, paragrafov a zdrojov.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["§", "Zákony", "Právne predpisy a ich aktuálne znenia."],
            ["↶", "Historické znenia", "Znenia účinné v minulosti."],
            ["→", "Budúce znenia", "Pripravované a budúce účinnosti."],
            ["⌕", "Sekcie", "Jednotlivé paragrafy a ustanovenia."],
            ["↗", "Zdroje", "Oficiálne zdroje právnych dokumentov."],
            ["⟳", "Amendments", "Zmeny a novely právnych predpisov."],
          ].map(([icon, title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
                {icon}
              </div>

              <h2 className="mt-6 font-semibold">{title}</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
