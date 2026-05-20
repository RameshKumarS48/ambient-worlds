import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QUESTIONS } from "@/lib/questions";
import { recommend, type Answers, type Title, PLATFORM_LABEL } from "@/lib/catalog";
import { PosterFallback } from "@/components/PosterFallback";

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

function App() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [results, setResults] = useState<Title[]>([]);

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
        setTimeout(() => {
          setResults(recommend(next as Answers));
          setPhase("results");
        }, 1500);
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
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="max-w-2xl animate-q-in">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          🍿 Tonight's pick
        </p>
        <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          What should I watch tonight?
        </h1>
        <p className="mt-6 text-balance text-lg text-muted-foreground sm:text-xl">
          Answer 8 quick questions. Get 5 perfect picks.
        </p>
        <button
          onClick={onStart}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] active:scale-100"
        >
          Let's Find Something
          <span aria-hidden>→</span>
        </button>
      </div>
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
  const progress = ((step) / QUESTIONS.length) * 100;
  const selected = answers[q.key];

  return (
    <section className="min-h-screen">
      <div className="fixed inset-x-0 top-0 z-10 h-1 bg-muted">
        <div
          className="h-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 pb-16 pt-10">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <button
            onClick={onBack}
            disabled={step === 0}
            className="rounded-md px-2 py-1 transition-opacity hover:opacity-100 disabled:opacity-0"
          >
            ← Back
          </button>
          <span className="tabular-nums">
            {step + 1} / {QUESTIONS.length}
          </span>
        </div>

        <div key={step} className="flex flex-1 flex-col justify-center animate-q-in">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {q.title}
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">{q.subtitle}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            {q.options.map((opt) => {
              const active = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onPick(q.key, opt.value)}
                  className={[
                    "rounded-full border px-5 py-3 text-base font-medium transition-all duration-200",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5",
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
    <section className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-primary animate-soft-pulse" />
        <span className="h-3 w-3 rounded-full bg-primary animate-soft-pulse" style={{ animationDelay: "0.15s" }} />
        <span className="h-3 w-3 rounded-full bg-primary animate-soft-pulse" style={{ animationDelay: "0.3s" }} />
      </div>
      <p className="mt-6 text-lg text-muted-foreground">Finding your perfect watch…</p>
    </section>
  );
}

function Results({ results, onReset }: { results: Title[]; onReset: () => void }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 animate-q-in">
      <header className="mb-10 text-center">
        <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Here's what to watch tonight 🍿
        </h2>
        <p className="mt-3 text-muted-foreground">Your top 5 picks, ranked.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {results.map((t, i) => (
          <ResultCard key={t.id} t={t} rank={i + 1} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={onReset}
          className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          ↺ Start Over
        </button>
      </div>
    </section>
  );
}

function ResultCard({ t, rank }: { t: Title; rank: number }) {
  return (
    <article className="group flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="w-32 shrink-0 sm:w-40">
        <PosterFallback title={t.title} color={t.color} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              #{rank} {t.format === "movie" ? "Movie" : "Series"}
            </p>
            <h3 className="mt-1 text-lg font-semibold leading-tight">
              {t.title} <span className="font-normal text-muted-foreground">({t.year})</span>
            </h3>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-foreground/[0.06] px-2.5 py-1 text-xs font-semibold tabular-nums">
            ⭐ {t.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {t.genres.slice(0, 3).map((g) => (
            <span key={g} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {g}
            </span>
          ))}
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {PLATFORM_LABEL[t.platforms[0]] ?? "Available"}
          </span>
        </div>

        <p className="mt-3 line-clamp-3 text-sm text-foreground/80">
          <em className="text-muted-foreground">Why you'll love it: </em>
          {t.why}
        </p>

        <div className="mt-auto pt-4">
          <a
            href={`https://www.imdb.com/title/${t.imdb}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Start Watching →
          </a>
        </div>
      </div>
    </article>
  );
}

