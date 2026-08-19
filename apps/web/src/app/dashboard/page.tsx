import Link from "next/link";

const cards = [
  {
    title: "AI Legal Agent",
    description: "Položte právnu otázku a analyzujte ju pomocou AI.",
    href: "/agent",
    icon: "⚖",
  },
  {
    title: "Legal Search",
    description: "Vyhľadávajte v právnych predpisoch.",
    href: "/search",
    icon: "⌕",
  },
  {
    title: "Legal Documents",
    description: "Prehliadajte právne dokumenty a ich verzie.",
    href: "/documents",
    icon: "§",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-semibold">
            ⚖ LEGAL AI <span className="text-slate-500">2026</span>
          </Link>

          <span className="flex items-center gap-2 text-sm text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            System online
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="text-sm tracking-widest text-slate-500">
            LEGAL AI PLATFORM
          </p>

          <h1 className="mt-3 text-4xl font-semibold">
            Dashboard
          </h1>

          <p className="mt-3 text-slate-500">
            Centrum právneho výskumu a AI asistencie.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl text-slate-950">
                {card.icon}
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                {card.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-500 group-hover:text-slate-400">
                {card.description}
              </p>

              <div className="mt-8 text-sm text-slate-600 group-hover:text-white">
                Otvoriť →
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Backend API
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                FastAPI legal intelligence backend
              </p>
            </div>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300">
              ONLINE
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
