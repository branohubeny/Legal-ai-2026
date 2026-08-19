"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type SearchResult = {
  id: string;
  version_id: string;
  section_number?: string | null;
  subsection?: string | null;
  letter?: string | null;
  title?: string | null;
  text?: string | null;
  vector_distance?: number;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          limit: 10,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Vyhľadávanie zlyhalo.");
      }

      setResults(data.results ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nepodarilo sa vykonať vyhľadávanie."
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

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            LEGAL SEARCH
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Vyhľadávanie v právnych predpisoch
          </h1>

          <p className="mt-4 leading-7 text-slate-400">
            Vyhľadajte relevantné ustanovenia podľa obsahu právnej otázky.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mt-10">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:flex-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Napr. výpovedná lehota pri pracovnom pomere"
              className="min-h-12 flex-1 bg-transparent px-4 outline-none placeholder:text-slate-600"
            />

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-xl bg-white px-7 py-3 font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Hľadám..." : "Vyhľadať"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-10 space-y-4">
          {results.map((result) => (
            <article
              key={result.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-white px-3 py-1 text-sm font-semibold text-slate-950">
                  § {result.section_number ?? "—"}
                </span>

                {result.title && (
                  <h2 className="font-semibold">{result.title}</h2>
                )}
              </div>

              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-400">
                {result.text || "Bez textu."}
              </p>

              {result.vector_distance !== undefined && (
                <div className="mt-5 text-xs text-slate-600">
                  Vector distance: {result.vector_distance.toFixed(4)}
                </div>
              )}
            </article>
          ))}

          {!loading && !error && query && results.length === 0 && (
            <div className="rounded-2xl border border-white/10 p-8 text-center text-slate-500">
              Žiadne výsledky.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
