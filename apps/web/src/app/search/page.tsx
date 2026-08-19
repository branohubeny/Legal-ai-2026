"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Result = {
  id: string;
  version_id: string;
  section_number: string | null;
  subsection: string | null;
  letter: string | null;
  title: string | null;
  text: string;
  vector_distance: number;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(event: FormEvent) {
    event.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query.trim(),
            limit: 10,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Vyhľadávanie zlyhalo.");
      }

      setResults(data.results || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nepodarilo sa pripojiť k API."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-semibold">
            ⚖ LEGAL AI <span className="text-slate-500">2026</span>
          </Link>

          <Link
            href="/agent"
            className="text-sm text-slate-400 hover:text-white"
          >
            AI Agent →
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-sm tracking-widest text-slate-500">
          LEGAL SEARCH ENGINE
        </p>

        <h1 className="mt-3 text-4xl font-semibold">
          Vyhľadávanie v právnych predpisoch
        </h1>

        <form onSubmit={search} className="mt-10">
          <div className="flex gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Zadajte právnu otázku alebo výraz..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 outline-none placeholder:text-slate-600 focus:border-white/30"
            />

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-xl bg-white px-7 font-semibold text-slate-950 disabled:opacity-40"
            >
              {loading ? "Hľadám..." : "Hľadať"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-10 space-y-4">
          {results.map((result) => (
            <article
              key={result.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">
                    § {result.section_number || "—"}
                    {result.subsection &&
                      ` ods. ${result.subsection}`}
                    {result.letter &&
                      ` písm. ${result.letter}`}
                  </div>

                  {result.title && (
                    <h2 className="mt-2 text-lg font-medium">
                      {result.title}
                    </h2>
                  )}
                </div>

                <span className="text-xs text-slate-600">
                  distance {result.vector_distance.toFixed(4)}
                </span>
              </div>

              <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-400">
                {result.text}
              </p>
            </article>
          ))}

          {!loading && query && results.length === 0 && !error && (
            <div className="rounded-xl border border-white/10 p-8 text-center text-slate-500">
              Žiadne výsledky.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
