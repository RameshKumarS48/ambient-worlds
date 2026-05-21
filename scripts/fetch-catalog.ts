/**
 * One-time catalog enrichment script.
 * Queries TMDB for top-rated movies and series per language and outputs
 * TypeScript-ready catalog entries to paste into src/lib/catalog.ts.
 *
 * Usage:
 *   TMDB_API_KEY=your_key bun run scripts/fetch-catalog.ts
 *
 * Get a free key at: https://www.themoviedb.org/settings/api (takes ~2 min)
 */

const API_KEY = process.env.TMDB_API_KEY;
if (!API_KEY) {
  console.error("Set TMDB_API_KEY env var. Get a free key at themoviedb.org/settings/api");
  process.exit(1);
}

const BASE = "https://api.themoviedb.org/3";

// Languages to enrich — code = TMDB original_language value, label = catalog language field
const LANGUAGES = [
  { code: "hi", label: "hindi" },
  { code: "ko", label: "korean" },
  { code: "ja", label: "japanese" },
  { code: "es", label: "european" },
  { code: "fr", label: "european" },
  { code: "de", label: "european" },
  { code: "it", label: "european" },
] as const;

// TMDB genre ID → catalog genre string
const GENRE_MAP: Record<number, string> = {
  28: "action", 12: "adventure", 16: "animation", 35: "comedy", 80: "crime",
  18: "drama", 10751: "family", 14: "fantasy", 27: "horror", 9648: "mystery",
  10749: "romance", 878: "sci-fi", 53: "thriller", 10759: "action",
  10765: "sci-fi", 10762: "family", 10763: "drama", 10766: "drama",
  10767: "comedy", 37: "drama", 10768: "drama",
};

// Genre → moods
const GENRE_TO_MOODS: Record<string, string[]> = {
  action:    ["excited", "tense"],
  adventure: ["excited", "epic"],
  animation: ["happy", "fun"],
  comedy:    ["fun", "happy"],
  crime:     ["tense", "dark"],
  drama:     ["emotional"],
  family:    ["happy", "heartwarming"],
  fantasy:   ["magical", "epic"],
  horror:    ["scared", "tense"],
  mystery:   ["tense", "mind-bending"],
  romance:   ["romantic"],
  "sci-fi":  ["mind-bending", "epic"],
  thriller:  ["tense"],
};

// Genre → card color
const GENRE_TO_COLOR: Record<string, string> = {
  action: "#7f1d1d", adventure: "#0369a1", animation: "#0f766e",
  comedy: "#ca8a04", crime: "#1f2937", drama: "#475569",
  family: "#166534", fantasy: "#6d28d9", horror: "#0c0a09",
  mystery: "#1e293b", romance: "#9d174d", "sci-fi": "#1e3a8a",
  thriller: "#292524",
};

function yearToEra(year: number): string {
  if (year < 2000) return "classic";
  if (year < 2010) return "2000s";
  if (year < 2020) return "2010s";
  return "recent";
}

function slug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12);
}

function genresFromIds(ids: number[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const id of ids) {
    const g = GENRE_MAP[id];
    if (g && !seen.has(g)) { seen.add(g); result.push(g); }
  }
  return result.slice(0, 3);
}

function moodsFromGenres(genres: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const g of genres) {
    for (const m of (GENRE_TO_MOODS[g] ?? [])) {
      if (!seen.has(m)) { seen.add(m); result.push(m); }
    }
  }
  return result.slice(0, 3);
}

function audienceFromGenres(genres: string[]): string[] {
  if (genres.includes("family") || genres.includes("animation")) return ["family", "solo", "partner"];
  if (genres.includes("horror") || genres.includes("crime") || genres.includes("thriller")) return ["solo", "partner"];
  if (genres.includes("romance")) return ["partner", "solo"];
  return ["solo", "partner", "friends"];
}

function colorFromGenres(genres: string[]): string {
  for (const g of genres) {
    if (GENRE_TO_COLOR[g]) return GENRE_TO_COLOR[g];
  }
  return "#1f2937";
}

function truncate(str: string, len = 100): string {
  if (!str) return "A must-watch in its genre.";
  const s = str.replace(/"/g, "'");
  return s.length <= len ? s : s.slice(0, len - 1) + "…";
}

async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", API_KEY!);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${path} → ${res.status}`);
  return res.json() as T;
}

type TMDBMovie = {
  id: number; title?: string; name?: string; original_language: string;
  release_date?: string; first_air_date?: string;
  genre_ids: number[]; vote_average: number; vote_count: number;
  overview: string;
};

async function discoverMovies(langCode: string): Promise<TMDBMovie[]> {
  const data = await tmdb<{ results: TMDBMovie[] }>("/discover/movie", {
    with_original_language: langCode,
    sort_by: "vote_average.desc",
    "vote_count.gte": "500",
    "vote_average.gte": "7.0",
    page: "1",
  });
  return data.results ?? [];
}

async function discoverTV(langCode: string): Promise<TMDBMovie[]> {
  const data = await tmdb<{ results: TMDBMovie[] }>("/discover/tv", {
    with_original_language: langCode,
    sort_by: "vote_average.desc",
    "vote_count.gte": "200",
    "vote_average.gte": "7.0",
    page: "1",
  });
  return data.results ?? [];
}

// Already in catalog — skip these to avoid duplicates
const EXISTING_IDS = new Set([
  "tt1187043","tt5074352","tt0986264","tt4260364","tt6077448","tt8355834",
  "tt11868916","tt9691466","tt11032374","tt10183992","tt9166890","tt14758992",
  "tt8108198","tt3767372","tt8108530","tt2178470",
  "tt6751668","tt10919420",
  "tt0245429","tt5311514",
  "tt6468322","tt0457430","tt5753856","tt0211915",
]);

// Attempt to get IMDB ID (one extra API call per title — batched slowly)
async function getImdb(tmdbId: number, type: "movie" | "tv"): Promise<string> {
  try {
    const data = await tmdb<{ imdb_id?: string }>(`/${type}/${tmdbId}/external_ids`);
    return data.imdb_id ?? "";
  } catch {
    return "";
  }
}

function formatEntry(
  t: TMDBMovie,
  type: "movie" | "series",
  langLabel: string,
  imdbId: string,
): string {
  const title = t.title ?? t.name ?? "Unknown";
  const dateStr = t.release_date ?? t.first_air_date ?? "2000-01-01";
  const year = parseInt(dateStr.slice(0, 4), 10);
  const genres = genresFromIds(t.genre_ids);
  const moods = moodsFromGenres(genres);
  const audience = audienceFromGenres(genres);
  const era = yearToEra(year);
  const color = colorFromGenres(genres);
  const why = truncate(t.overview);
  const id = slug(title) + year.toString().slice(2);

  const genresStr = JSON.stringify(genres);
  const moodsStr = JSON.stringify(moods);
  const audienceStr = JSON.stringify(audience);

  const formatSpecific = type === "movie"
    ? `format: "movie", runtime: 120,`
    : `format: "series", episodes: 10,`;

  return `  { id: "${id}", title: "${title.replace(/"/g, '\\"')}", year: ${year}, genres: ${genresStr}, moods: ${moodsStr}, rating: ${t.vote_average.toFixed(1)}, imdb: "${imdbId}", language: "${langLabel}", ${formatSpecific} platforms: ["any"], era: "${era}", audience: ${audienceStr}, why: "${why}", color: "${color}" },`;
}

async function main() {
  const movieLines: string[] = [];
  const seriesLines: string[] = [];

  for (const { code, label } of LANGUAGES) {
    process.stderr.write(`\nFetching ${label} (${code}) movies…\n`);
    const movies = await discoverMovies(code);

    for (const m of movies.slice(0, 10)) {
      if (m.vote_count < 500) continue;
      const imdb = await getImdb(m.id, "movie");
      if (imdb && EXISTING_IDS.has(imdb)) continue;
      movieLines.push(formatEntry(m, "movie", label, imdb));
      await new Promise(r => setTimeout(r, 120)); // rate-limit
    }

    process.stderr.write(`Fetching ${label} (${code}) series…\n`);
    const series = await discoverTV(code);

    for (const s of series.slice(0, 10)) {
      if (s.vote_count < 200) continue;
      const imdb = await getImdb(s.id, "tv");
      if (imdb && EXISTING_IDS.has(imdb)) continue;
      seriesLines.push(formatEntry(s, "series", label, imdb));
      await new Promise(r => setTimeout(r, 120));
    }
  }

  console.log("\n// ─── MOVIES ────────────────────────────────────────────────────────────────");
  for (const line of movieLines) console.log(line);

  console.log("\n// ─── SERIES ────────────────────────────────────────────────────────────────");
  for (const line of seriesLines) console.log(line);

  process.stderr.write(`\nDone. ${movieLines.length} movies + ${seriesLines.length} series.\n`);
  process.stderr.write("Review the output, edit any fields (runtime, episodes, why), then paste into src/lib/catalog.ts.\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
