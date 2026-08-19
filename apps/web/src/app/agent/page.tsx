"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type SearchResult = {
  id: string;
  version_id: string;
  section_number: string | null;
  subsection: string | null;
  letter: string | null;
  title: string | null;
  text: string;
  vector_distance: number;
};

type SearchResponse = {
  query: string;
  on_date: string;
  jurisdiction: string | null;
  limit: number;
  results: SearchResult[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AgentPage() {
  const [question, setQuestion] = useState("");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(`${API_URL}/api/v1/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: question.trim(),
          limit: 10,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Vyhľadávanie zlyhalo.");
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nepodarilo sa spojiť s backendom."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-semibold tracking-tight">
            ⚖ LEGAL AI <span className="text-slate-500">2026</span>
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Späť
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm font-medium text-slate-500">
          AI LEGAL AGENT
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Právne vyhľadávanie
        </h1>

        <p className="mt-4 max-w-2xl text-slate-400">
          Vyhľadajte relevantné časti právnych predpisov.
        </p>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Napríklad: Aká je výpovedná lehota pri pracovnom pomere?"
              rows={5}
              className="w-full resize-none bg-transparent p-4 outline-none placeholder:text-slate-600"
            />

            <div className="flex justify-end border-t border-white/10 pt-3">
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Vyhľadávam..." : "Analyzovať"}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {data && (
          <section className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Výsledky
              </h2>

              <span className="text-sm text-slate-500">
                {data.results.length} výsledkov
              </span>
            </div>

            {data.results.length === 0 ? (
              <div className="rounded-xl border border-white/10 p-6 text-slate-400">
                Nenašli sa žiadne relevantné právne ustanovenia.
              </div>
            ) : (
              <div className="space-y-4">
                {data.results.map((result) => (
                  <article
                    key={result.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          § {result.section_number || "—"}
                          {result.subsection
                            ? ` ods. ${result.subsection}`
                            : ""}
                          {result.letter
                            ? ` písm. ${result.letter}`
                            : ""}
                        </p>

                        {result.title && (
                          <h3 className="mt-2 font-medium text-slate-300">
                            {result.title}
                          </h3>
                        )}
                      </div>

                      <span className="text-xs text-slate-600">
                        {result.vector_distance.toFixed(4)}
                      </span>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-400">
                      {result.text}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
