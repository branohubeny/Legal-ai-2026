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

export default function AgentPage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = question.trim();

    if (!query) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

      const result = await fetch(`${apiUrl}/api/v1/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          limit: 10,
        }),
      });

      if (!result.ok) {
        const data = await result.json().catch(() => null);

        throw new Error(
          data?.detail ?? `API chyba: ${result.status}`
        );
      }

      const data: SearchResponse = await result.json();

      setResponse(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nepodarilo sa spojiť s LEGAL AI backendom."
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
            ← Späť na úvod
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-medium text-slate-500">
            AI LEGAL AGENT
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Opýtajte sa na právo.
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Položte právnu otázku. LEGAL AI vyhľadá relevantné právne
            ustanovenia v databáze.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Napríklad: Aká je výpovedná lehota pri pracovnom pomere?"
              rows={6}
              className="w-full resize-none bg-transparent p-4 text-base text-white outline-none placeholder:text-slate-600"
            />

            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span className="px-3 text-xs text-slate-600">
                LEGAL AI 2026
              </span>

              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Vyhľadávam..." : "Analyzovať"}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
            <p className="text-sm font-medium text-red-300">
              Chyba spojenia
            </p>
            <p className="mt-2 text-sm leading-6 text-red-200/80">
              {error}
            </p>
          </div>
        )}

        {response && (
          <div className="mt-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">LEGAL AI</p>
                <p className="text-xs text-slate-500">
                  Výsledky právneho vyhľadávania
                </p>
              </div>

              <span className="text-xs text-slate-500">
                {response.results.length} výsledkov
              </span>
            </div>

            {response.results.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-slate-300">
                  Nenašli sa žiadne relevantné právne ustanovenia.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {response.results.map((result) => (
                  <article
                    key={result.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                  >
                    <div className="mb-3">
                      <p className="text-sm font-medium text-white">
                        {result.section_number
                          ? `§ ${result.section_number}`
                          : "Právne ustanovenie"}
                        {result.subsection
                          ? ` ods. ${result.subsection}`
                          : ""}
                        {result.letter ? ` písm. ${result.letter}` : ""}
                      </p>

                      {result.title && (
                        <p className="mt-1 text-xs text-slate-500">
                          {result.title}
                        </p>
                      )}
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                      {result.text}
                    </p>

                    <div className="mt-4 border-t border-white/10 pt-3 text-xs text-slate-600">
                      Vector distance:{" "}
                      {result.vector_distance.toFixed(4)}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm font-medium">§ Aktuálne právo</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Platné znenie právnych predpisov.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm font-medium">↶ História</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Historické znenia a časová platnosť.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm font-medium">⌕ Search</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Vyhľadávanie v právnej databáze.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
