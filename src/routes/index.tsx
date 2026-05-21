import { createFileRoute } from "@tanstack/react-router";
import { useState, useTransition } from "react";
import { QUESTIONS } from "@/lib/questions";
import { recommend, type Answers, type Title, PLATFORM_LABEL } from "@/lib/catalog";
import { PosterFallback } from "@/components/PosterFallback";
import { enrichWithPosters } from "@/lib/wikipedia";
import { fetchStreamingAvailability } from "@/lib/watchmode";
import { getSarcasticLine, getMoodSummary } from "@/lib/snark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "What Should I Watch Tonight?" },
      { name: "description", content: "Answer 8 quick questions and get 5 perfect movie or show picks for tonight." },
      { property: "og:title", content: "What Should I Watch Tonight?" },
      { property: "og:description", content: "Answer 8 quick questions. Get 5 perfect picks." },
    ],
  }),
  component: App,
});

type Phase = "landing" | "quiz" | "loading" | "results";

export function App() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [results, setResults] = useState<Title[]>([]);
  const [snark, setSnark] = useState<string | null>(null);
  const [moodSummary, setMoodSummary] = useState<string[]>([]);
  const [, startTransition] = useTransition();

  const start = () => { setAnswers({}); setStep(0); setSnark(null); setMoodSummary([]); setPhase("quiz"); };

  const handlePick = (key: keyof Answers, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    const isFinal = step + 1 >= QUESTIONS.length;
    setSnark(getSarcasticLine(key, value));
    if (isFinal) setMoodSummary(getMoodSummary(next as Answers));
    setTimeout(() => {
      setSnark(null);
      setMoodSummary([]);
      if (!isFinal) {
        setStep(step + 1);
      } else {
        setPhase("loading");
        startTransition(async () => {
          const top5 = recommend(next as Answers);
          const [enriched, streamingMap] = await Promise.all([
            enrichWithPosters(top5),
            fetchStreamingAvailability({
              data: top5.map((t) => ({ id: t.id, title: t.title, year: t.year, format: t.format })),
            }).catch(() => ({} as Record<string, string[]>)),
          ]);
          const withStreaming = enriched.map((t) =>
            streamingMap[t.id]?.length ? { ...t, streamingPlatforms: streamingMap[t.id] } : t,
          );
          setResults(withStreaming);
          setPhase("results");
        });
      }
    }, isFinal ? 2500 : 1400);
  };

  const back = () => { if (step > 0) { setSnark(null); setMoodSummary([]); setStep(step - 1); } };
  const reset = () => { setPhase("landing"); setStep(0); setAnswers({}); setResults([]); setSnark(null); setMoodSummary([]); };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {phase === "landing" && <Landing onStart={start} />}
      {phase === "quiz" && <Quiz step={step} answers={answers} onPick={handlePick} onBack={back} snark={snark} moodSummary={moodSummary} />}
      {phase === "loading" && <Loading />}
      {phase === "results" && <Results results={results} onReset={reset} />}
    </main>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Ambient blobs */}
      <div
        className="animate-blob pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #c800df, transparent 70%)" }}
      />
      <div
        className="animate-blob pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #e60076, transparent 70%)", animationDelay: "3s" }}
      />

      <div className="relative max-w-2xl animate-q-in">
        <span
          className="mb-4 inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          style={{ fontFamily: "'Overpass Mono', monospace" }}
        >
          Tonight's Pick
        </span>

        <h1 className="text-balance text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          What should I{" "}
          <span className="text-gradient animate-gradient-x">watch tonight?</span>
        </h1>

        <p className="mt-5 text-balance text-lg font-light text-muted-foreground sm:text-xl">
          Answer 8 questions. Get 5 perfect picks.
        </p>

        <button
          onClick={onStart}
          className="group mt-10 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #c800df, #e60076)" }}
        >
          Let's go
          <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}

function Quiz({
  step, answers, onPick, onBack, snark, moodSummary,
}: {
  step: number;
  answers: Partial<Answers>;
  onPick: (key: keyof Answers, value: string) => void;
  onBack: () => void;
  snark: string | null;
  moodSummary: string[];
}) {
  const q = QUESTIONS[step];
  const progress = (step / QUESTIONS.length) * 100;
  const selected = answers[q.key];

  return (
    <section className="min-h-screen">
      {/* Progress bar */}
      <div className="fixed inset-x-0 top-0 z-10 h-1 bg-muted">
        <div
          className="progress-contemporary h-full transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 pb-16 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={step === 0}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-0"
          >
            ← Back
          </button>
          <span
            className="text-xs font-medium tabular-nums text-muted-foreground"
            style={{ fontFamily: "'Overpass Mono', monospace" }}
          >
            {step + 1} / {QUESTIONS.length}
          </span>
        </div>

        {/* Question */}
        <div key={step} className="flex flex-1 flex-col justify-center animate-q-in">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ fontFamily: "'Overpass Mono', monospace", color: "#c800df" }}
          >
            Question {step + 1}
          </p>
          <h2 className="text-balance text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            {q.title}
          </h2>
          <p className="mt-2 text-base font-light text-muted-foreground">{q.subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {q.options.map((opt, i) => {
              const active = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onPick(q.key, opt.value)}
                  style={{ animationDelay: `${i * 0.04}s` }}
                  className={[
                    "animate-q-in rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-150",
                    active
                      ? "border-transparent text-white shadow-md"
                      : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted",
                  ].join(" ")}
                  {...(active
                    ? { style: { animationDelay: `${i * 0.04}s`, background: "linear-gradient(135deg, #c800df, #e60076)", border: "transparent" } }
                    : { style: { animationDelay: `${i * 0.04}s` } })}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Sarcastic comment */}
          {snark && (
            <div className="mt-6 animate-q-in">
              <p
                className="text-sm italic text-muted-foreground"
                style={{ fontFamily: "'Overpass Mono', monospace" }}
              >
                {snark}
              </p>

              {/* Mood summary — final question only */}
              {moodSummary.length > 0 && (
                <div className="mt-5 rounded-xl border border-border bg-muted/60 p-4 animate-q-in">
                  <p
                    className="mb-2 text-[10px] font-bold uppercase tracking-widest"
                    style={{ fontFamily: "'Overpass Mono', monospace", color: "#c800df" }}
                  >
                    Tonight's vibe
                  </p>
                  {moodSummary.map((line, i) => (
                    <p key={i} className="text-sm text-foreground leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Loading() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      {/* Spinning ring */}
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div
          className="animate-spin-ring absolute inset-0 rounded-full border-4 border-transparent"
          style={{ borderTopColor: "#c800df" }}
        />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-foreground">Finding your picks…</p>
        <p className="mt-1 text-sm font-light text-muted-foreground">Matching your vibe to the perfect watch</p>
      </div>
    </section>
  );
}

function Results({ results, onReset }: { results: Title[]; onReset: () => void }) {
  const [hero, ...rest] = results;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 animate-q-in sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <span
          className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          style={{ fontFamily: "'Overpass Mono', monospace" }}
        >
          Your picks for tonight
        </span>
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          Here's what to <span className="text-gradient">watch</span> 🎬
        </h2>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Hero card — spans full width */}
        {hero && (
          <div className="sm:col-span-2 animate-card-rise" style={{ animationDelay: "0s" }}>
            <HeroCard t={hero} rank={1} />
          </div>
        )}
        {/* Supporting cards */}
        {rest.map((t, i) => (
          <div key={t.id} className="animate-card-rise" style={{ animationDelay: `${(i + 1) * 0.08}s` }}>
            <ResultCard t={t} rank={i + 2} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          onClick={onReset}
          className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition-all hover:border-primary/40 hover:bg-muted"
        >
          ↺ Start over
        </button>
        <p className="text-xs text-muted-foreground/60">
          Poster images from{" "}
          <a href="https://www.wikipedia.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground">
            Wikipedia
          </a>{" "}
          (CC BY-SA 4.0)
        </p>
      </div>
    </section>
  );
}

/* Hero card — large horizontal layout */
function HeroCard({ t, rank }: { t: Title; rank: number }) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = t.posterPath && !imgError ? t.posterPath : null;
  const watchUrl = t.imdb ? `https://www.imdb.com/title/${t.imdb}/` : t.tmdbId ? `https://www.themoviedb.org/movie/${t.tmdbId}` : "#";

  return (
    <article className="card-lift flex overflow-hidden rounded-2xl border border-border bg-card">
      {/* Poster */}
      <div className="w-36 shrink-0 sm:w-52">
        {posterUrl
          ? <img src={posterUrl} alt={`${t.title} poster`} className="h-full w-full object-cover" onError={() => setImgError(true)} loading="lazy" />
          : <PosterFallback title={t.title} color={t.color} />
        }
      </div>
      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ fontFamily: "'Overpass Mono', monospace", color: "#c800df" }}
              >
                #{rank} Pick · {t.format === "movie" ? "Film" : "Series"}
              </span>
              <h3 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
                {t.title}{" "}
                <span className="text-base font-normal text-muted-foreground">({t.year})</span>
              </h3>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-bold tabular-nums">
              ★ {t.rating.toFixed(1)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {t.genres.slice(0, 3).map((g) => (
              <span key={g} className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {g}
              </span>
            ))}
            {(t.streamingPlatforms?.length
              ? t.streamingPlatforms.slice(0, 2)
              : [PLATFORM_LABEL[t.platforms[0]] ?? "Available"]
            ).map((p) => (
              <span
                key={p}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                style={{ background: "linear-gradient(135deg, #c800df, #e60076)" }}
              >
                {p}
              </span>
            ))}
          </div>

          <p className="mt-3 line-clamp-3 text-sm font-light text-muted-foreground">
            <span className="font-semibold text-foreground">Why you'll love it: </span>
            {t.why}
          </p>
        </div>

        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #c800df, #e60076)" }}
        >
          Watch now →
        </a>
      </div>
    </article>
  );
}

/* Supporting card — compact vertical layout */
function ResultCard({ t, rank }: { t: Title; rank: number }) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = t.posterPath && !imgError ? t.posterPath : null;
  const watchUrl = t.imdb ? `https://www.imdb.com/title/${t.imdb}/` : t.tmdbId ? `https://www.themoviedb.org/movie/${t.tmdbId}` : "#";

  return (
    <article className="card-lift flex overflow-hidden rounded-2xl border border-border bg-card">
      <div className="w-24 shrink-0 sm:w-28">
        {posterUrl
          ? <img src={posterUrl} alt={`${t.title} poster`} className="h-full w-full object-cover" onError={() => setImgError(true)} loading="lazy" />
          : <PosterFallback title={t.title} color={t.color} />
        }
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ fontFamily: "'Overpass Mono', monospace", color: "#c800df" }}
        >
          #{rank}
        </span>
        <h3 className="mt-0.5 text-base font-black leading-snug tracking-tight">
          {t.title}{" "}
          <span className="text-sm font-normal text-muted-foreground">({t.year})</span>
        </h3>

        <div className="mt-2 flex flex-wrap gap-1">
          {t.genres.slice(0, 2).map((g) => (
            <span key={g} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {g}
            </span>
          ))}
        </div>

        <p className="mt-2 line-clamp-2 text-xs font-light text-muted-foreground">{t.why}</p>

        <div className="mt-auto pt-3">
          <div className="flex flex-wrap gap-1 mb-2">
            {(t.streamingPlatforms?.length
              ? t.streamingPlatforms.slice(0, 1)
              : [PLATFORM_LABEL[t.platforms[0]] ?? "Available"]
            ).map((p) => (
              <span
                key={p}
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                style={{ background: "linear-gradient(135deg, #c800df, #e60076)" }}
              >
                {p}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tabular-nums text-muted-foreground">★ {t.rating.toFixed(1)}</span>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold transition-opacity hover:opacity-70"
              style={{ color: "#c800df" }}
            >
              Watch →
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
