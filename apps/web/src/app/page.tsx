import Link from "next/link";

const features = [
  {
    title: "AI Legal Agent",
    description: "Položte právnu otázku a získajte odpoveď založenú na právnych zdrojoch.",
    href: "/agent",
    icon: "⚖",
  },
  {
    title: "Právne vyhľadávanie",
    description: "Vyhľadávajte v právnych predpisoch pomocou hybridného vyhľadávania.",
    href: "/search",
    icon: "⌕",
  },
  {
    title: "Právne dokumenty",
    description: "Prehľad zákonov, paragrafov, verzií a právnych zdrojov.",
    href: "/documents",
    icon: "§",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            ⚖ LEGAL AI <span className="text-slate-500">2026</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-400 sm:flex">
            <Link href="/agent" className="transition hover:text-white">
              AI Agent
            </Link>
            <Link href="/search" className="transition hover:text-white">
              Vyhľadávanie
            </Link>
            <Link href="/documents" className="transition hover:text-white">
              Dokumenty
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Legal Intelligence Platform
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
            Právo.
            <br />
            <span className="text-slate-500">Vyhľadávanie.</span>
            <br />
            AI.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">
            LEGAL AI 2026 je právny AI systém určený na vyhľadávanie,
            analýzu a prácu s právnymi predpismi a ich historickými zneniami.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/agent"
              className="rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Spustiť AI Agenta →
            </Link>

            <Link
              href="/search"
              className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-semibold transition hover:bg-white/5"
            >
              Vyhľadávať v práve
            </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg text-slate-950">
                {feature.icon}
              </div>

              <h2 className="mt-6 text-lg font-semibold">
                {feature.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>

              <div className="mt-6 text-sm text-slate-400 transition group-hover:text-white">
                Otvoriť →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8 text-xs text-slate-600">
          LEGAL AI 2026 · AI právny výskumný a asistenčný systém
        </div>
      </footer>
    </main>
  );
}
