import { createFileRoute } from "@tanstack/react-router";
import { useState, useTransition } from "react";
import { QUESTIONS } from "@/lib/questions";
import { recommend, type Answers, type Title, PLATFORM_LABEL } from "@/lib/catalog";
import { PosterFallback } from "@/components/PosterFallback";
import { enrichWithPosters } from "@/lib/wikipedia";

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
  const [, startTransition] = useTransition();

  const start = () => {
    setAnswers({});
    setStep(0);
    setPhase("quiz");
  };

  const handlePick = (key: keyof Answers, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setTimeout(() => {
      if (step + 1 < QUESTIONS.length) {
        setStep(step + 1);
      } else {
        setPhase("loading");
        startTransition(async () => {
          const finalAnswers = next as Answers;
          const top5 = recommend(finalAnswers);
          const enriched = await enrichWithPosters(top5);
          setResults(enriched);
          setPhase("results");
        });
      }
    }, 300);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const reset = () => {
    setPhase("landing");
    setStep(0);
    setAnswers({});
    setResults([]);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {phase === "landing" && <Landing onStart={start} />}
      {phase === "quiz" && (
        <Quiz step={step} answers={answers} onPick={handlePick} onBack={back} />
      )}
      {phase === "loading" && <Loading />}
      {phase === "results" && <Results results={results} onReset={reset} />}
    </main>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Crimson radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(139,26,26,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Decorative top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-20" />

      <div className="relative max-w-2xl animate-q-in">
        <p
          className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-gold opacity-80"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          Tonight's Screening
        </p>
        <h1
          className="text-balance text-5xl font-bold leading-[1.1] tracking-wide text-gold-shimmer sm:text-6xl md:text-7xl"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          What Should I Watch Tonight?
        </h1>
        <p className="mt-6 text-balance text-lg italic text-foreground/60 sm:text-xl">
          Answer 8 questions. Receive your perfect screening.
        </p>
        <button
          onClick={onStart}
          className="group mt-10 inline-flex items-center gap-3 border border-gold/50 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_30px_rgba(201,168,76,0.15)] active:scale-[0.98]"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          Begin
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </button>
      </div>

      {/* Corner ornaments */}
      <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-gold/20" />
      <div className="pointer-events-none absolute right-6 top-6 h-8 w-8 border-r border-t border-gold/20" />
      <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b border-l border-gold/20" />
      <div className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b border-r border-gold/20" />
    </section>
  );
}

function Quiz({
  step,
  answers,
  onPick,
  onBack,
}: {
  step: number;
  answers: Partial<Answers>;
  onPick: (key: keyof Answers, value: string) => void;
  onBack: () => void;
}) {
  const q = QUESTIONS[step];
  const progress = (step / QUESTIONS.length) * 100;
  const selected = answers[q.key];

  return (
    <section className="min-h-screen">
      {/* Progress bar */}
      <div className="fixed inset-x-0 top-0 z-10 h-[2px] bg-border">
        <div
          className="progress-cinematic h-full transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 pb-16 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={step === 0}
            className="text-sm tracking-wider text-muted-foreground transition-opacity hover:text-gold disabled:pointer-events-none disabled:opacity-0"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            ← Back
          </button>
          <span
            className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground tabular-nums"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            {step + 1} / {QUESTIONS.length}
          </span>
        </div>

        {/* Question */}
        <div key={step} className="flex flex-1 flex-col justify-center animate-q-in">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-crimson opacity-70"
             style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
            Question {step + 1}
          </p>
          <h2
            className="text-balance text-3xl font-bold leading-tight tracking-wide text-foreground sm:text-4xl md:text-5xl"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            {q.title}
          </h2>
          <p className="mt-3 text-base italic text-muted-foreground sm:text-lg">
            {q.subtitle}
          </p>

          {/* Options */}
          <div className="mt-10 flex flex-wrap gap-3">
            {q.options.map((opt, i) => {
              const active = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onPick(q.key, opt.value)}
                  style={{ animationDelay: `${i * 0.04}s` }}
                  className={[
                    "animate-q-in rounded-none border px-5 py-3 text-base transition-all duration-200",
                    active
                      ? "border-gold bg-gold text-primary-foreground shadow-[0_0_20px_rgba(201,168,76,0.25)]"
                      : "border-border bg-card text-foreground hover:border-gold/60 hover:bg-gold/5 hover:text-gold",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Loading() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Projector beam */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[70vh] w-48 origin-top"
        style={{
          background: "linear-gradient(180deg, rgba(201,168,76,0.12) 0%, transparent 100%)",
          animation: "beam-sweep 3s ease-in-out infinite",
          clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
        }}
      />

      {/* Film strip */}
      <div className="mb-12 flex overflow-hidden" style={{ maxWidth: "320px" }}>
        <div className="animate-film flex gap-1.5 shrink-0">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="flex h-20 w-14 shrink-0 flex-col justify-between rounded-sm border border-border bg-card p-1"
            >
              <div className="flex gap-0.5">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="h-1.5 w-2 rounded-[1px] bg-muted" />
                ))}
              </div>
              <div className="mx-1 flex-1 rounded-[1px] bg-muted/30" />
              <div className="flex gap-0.5">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="h-1.5 w-2 rounded-[1px] bg-muted" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p
        className="text-xl font-semibold uppercase tracking-[0.3em] text-gold"
        style={{ fontFamily: "'Cinzel', Georgia, serif" }}
      >
        Curating your screening…
      </p>
      <div className="mt-5 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-gold animate-soft-pulse" />
        <span className="h-2 w-2 rounded-full bg-gold animate-soft-pulse" style={{ animationDelay: "0.2s" }} />
        <span className="h-2 w-2 rounded-full bg-gold animate-soft-pulse" style={{ animationDelay: "0.4s" }} />
      </div>
    </section>
  );
}

function Results({ results, onReset }: { results: Title[]; onReset: () => void }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 animate-q-in">
      {/* Decorative top rule */}
      <div className="mb-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
        <header className="text-center">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-gold opacity-70"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Your Curated Picks
          </p>
          <h2
            className="text-balance text-3xl font-bold tracking-wide text-foreground sm:text-4xl"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Tonight's Screening List
          </h2>
        </header>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {results.map((t, i) => (
          <ResultCard key={t.id} t={t} rank={i + 1} index={i} />
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <button
          onClick={onReset}
          className="border border-border bg-card px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-all duration-200 hover:border-gold/50 hover:text-gold"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          ↺ New Screening
        </button>
        <p className="text-xs text-muted-foreground/50">
          Poster images sourced from{" "}
          <a
            href="https://www.wikipedia.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-gold/70"
          >
            Wikipedia
          </a>{" "}
          under{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-gold/70"
          >
            CC BY-SA 4.0
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function ResultCard({ t, rank, index }: { t: Title; rank: number; index: number }) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = t.posterPath && !imgError ? t.posterPath : null;
  const watchUrl = t.imdb
    ? `https://www.imdb.com/title/${t.imdb}/`
    : t.tmdbId
      ? `https://www.themoviedb.org/movie/${t.tmdbId}`
      : "#";

  return (
    <article
      className="card-glow group flex overflow-hidden border border-border bg-card animate-card-rise"
      style={{ animationDelay: `${index * 0.09}s` }}
    >
      {/* Poster */}
      <div className="w-28 shrink-0 sm:w-36">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${t.title} poster`}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <PosterFallback title={t.title} color={t.color} />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Rank + rating row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-crimson"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              #{rank} {t.format === "movie" ? "Film" : "Series"}
            </p>
            <h3
              className="mt-0.5 text-base font-bold leading-snug tracking-wide text-foreground sm:text-lg"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              {t.title}{" "}
              <span
                className="text-sm font-normal text-muted-foreground"
                style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
              >
                ({t.year})
              </span>
            </h3>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-bold tabular-nums text-gold">
            ★ {t.rating.toFixed(1)}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {t.genres.slice(0, 3).map((g) => (
            <span
              key={g}
              className="border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              {g}
            </span>
          ))}
          <span className="border border-crimson/40 bg-crimson/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground/70"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
            {PLATFORM_LABEL[t.platforms[0]] ?? "Available"}
          </span>
        </div>

        {/* Why */}
        <p className="mt-3 line-clamp-3 text-sm italic text-foreground/70">
          <span className="not-italic text-muted-foreground">Why you'll love it: </span>
          {t.why}
        </p>

        {/* CTA */}
        <div className="mt-auto pt-4">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold transition-all hover:gap-2.5"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Watch Now →
          </a>
        </div>
      </div>
    </article>
  );
}
