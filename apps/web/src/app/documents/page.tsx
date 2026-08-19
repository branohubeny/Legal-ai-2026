import Link from "next/link";

const documents = [
  {
    name: "Zákonník práce",
    number: "311/2001 Z. z.",
    status: "Platný",
  },
  {
    name: "Občiansky zákonník",
    number: "40/1964 Zb.",
    status: "Platný",
  },
  {
    name: "Trestný zákon",
    number: "300/2005 Z. z.",
    status: "Platný",
  },
];

export default function DocumentsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-semibold">
            ⚖ LEGAL AI <span className="text-slate-500">2026</span>
          </Link>

          <nav className="flex gap-5 text-sm text-slate-400">
            <Link href="/search" className="hover:text-white">
              Vyhľadávanie
            </Link>
            <Link href="/agent" className="hover:text-white">
              AI Agent
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-sm tracking-widest text-slate-500">
          LEGAL DATABASE
        </p>

        <h1 className="mt-3 text-4xl font-semibold">
          Právne dokumenty
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-slate-400">
          Databáza právnych predpisov, ich verzií a jednotlivých ustanovení.
        </p>

        <div className="mt-10 grid gap-4">
          {documents.map((document) => (
            <article
              key={document.number}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.05]"
            >
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    {document.name}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {document.number}
                  </p>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300">
                  ● {document.status}
                </span>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href="/search"
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                >
                  Vyhľadať ustanovenia
                </Link>

                <Link
                  href="/agent"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
                >
                  Opýtať sa AI
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
