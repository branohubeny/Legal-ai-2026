import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            ⚖ LEGAL AI <span className="text-slate-500">2026</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/agent" className="hover:text-white">
              AI Agent
            </Link>
            <Link href="/documents" className="hover:text-white">
              Dokumenty
            </Link>
            <Link href="/search" className="hover:text-white">
              Vyhľadávanie
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-4xl">
          <p className="text-sm font-medium tracking-[0.2em] text-slate-500">
            LEGAL INTELLIGENCE PLATFORM
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-7xl">
            Právo.
            <br />
            <span className="text-slate-500">Vyhľadávanie.</span>
            <br />
            AI.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">
            LEGAL AI 2026 je inteligentný právny systém pre vyhľadávanie,
            analýzu a prácu s právnymi predpismi a ich časovou platnosťou.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/agent"
              className="rounded-xl bg-white px-7 py-4 font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Spustiť AI Agenta →
            </Link>

            <Link
              href="/search"
              className="rounded-xl border border-white/10 px-7 py-4 font-semibold transition hover:bg-white/5"
            >
              Vyhľadať v zákonoch
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10">
        <div className="mx-auto grid max-w-7xl gap-px bg-white/10 md:grid-cols-3">
          <Feature
            title="AI Legal Agent"
            text="Položte právnu otázku a získajte odpoveď založenú na relevantných právnych zdrojoch."
            href="/agent"
          />

          <Feature
            title="Temporal Legal Engine"
            text="Rozlišovanie platného, historického a budúceho znenia právnych predpisov."
            href="/search"
          />

          <Feature
            title="Hybrid Search"
            text="Kombinácia významového, keyword a vektorového vyhľadávania s filtrovaním."
            href="/search"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm text-slate-600">SYSTEM STATUS</p>

        <div className="mt-5 flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="text-sm text-slate-400">
            LEGAL AI platform online
          </span>
        </div>
      </section>
    </main>
  );
}

function Feature({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-slate-950 p-8 transition hover:bg-slate-900"
    >
      <h2 className="text-xl font-semibold">{title}</h2>

      <p className="mt-4 leading-7 text-slate-500 group-hover:text-slate-400">
        {text}
      </p>

      <span className="mt-8 inline-block text-sm text-slate-600 group-hover:text-white">
        Otvoriť →
      </span>
    </Link>
  );
}
