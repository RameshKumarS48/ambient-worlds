type WikiSummary = {
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string };
  extract?: string;
};

const WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary";

// Candidates to try in order until one returns a thumbnail
function titleVariants(title: string, year: number, format: string): string[] {
  const base = title.replace(/['']/g, "'");
  const isTV = format === "series" || format === "mini";
  return [
    base,
    isTV ? `${base} (TV series)` : `${base} (film)`,
    isTV ? `${base} (TV show)` : `${base} (${year} film)`,
    `${base} (${year})`,
  ];
}

async function fetchSummary(title: string): Promise<WikiSummary | null> {
  try {
    const res = await fetch(
      `${WIKI_API}/${encodeURIComponent(title)}`,
      { headers: { "Api-User-Agent": "watch-tonight-quiz/1.0" } },
    );
    if (!res.ok) return null;
    return res.json() as Promise<WikiSummary>;
  } catch {
    return null;
  }
}

export async function fetchWikipediaPoster(
  title: string,
  year: number,
  format: string,
): Promise<string | null> {
  for (const variant of titleVariants(title, year, format)) {
    const data = await fetchSummary(variant);
    const src = data?.thumbnail?.source ?? data?.originalimage?.source ?? null;
    if (src) return src;
  }
  return null;
}

export async function enrichWithPosters<T extends { title: string; year: number; format: string }>(
  items: T[],
): Promise<(T & { posterPath?: string | null })[]> {
  const posters = await Promise.all(
    items.map((t) => fetchWikipediaPoster(t.title, t.year, t.format)),
  );
  return items.map((t, i) => ({ ...t, posterPath: posters[i] }));
}
