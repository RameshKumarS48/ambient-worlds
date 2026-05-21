import { createServerFn } from "@tanstack/react-start";

type SearchResult = {
  id: number;
  name: string;
  type: string;
  year: number;
};

type Source = {
  source_id: number;
  name: string;
  type: "sub" | "free" | "buy" | "rent" | "tve";
  region: string;
  web_url: string;
};

type TitleInput = { id: string; title: string; year: number; format: "movie" | "series" | "mini" };

async function getWatchmodeId(apiKey: string, title: string, year: number, format: string): Promise<number | null> {
  const type = format === "movie" ? "movie" : "tv_series";
  const url = `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=name&search_value=${encodeURIComponent(title)}&types=${type}`;
  const res = await fetch(url);
  // On quota exceeded (429) or any error, fall through to catalog fallback silently
  if (!res.ok) return null;
  const data = await res.json() as { title_results: SearchResult[] };
  const results = data.title_results ?? [];
  // Find closest year match
  const match = results.find((r) => Math.abs(r.year - year) <= 1) ?? results[0] ?? null;
  return match?.id ?? null;
}

async function getStreamingSources(apiKey: string, watchmodeId: number): Promise<string[]> {
  const url = `https://api.watchmode.com/v1/title/${watchmodeId}/sources/?apiKey=${apiKey}&regions=US`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const sources = await res.json() as Source[];
  const seen = new Set<string>();
  return sources
    .filter((s) => s.type === "sub" || s.type === "free")
    .map((s) => s.name)
    .filter((name) => {
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });
}

export const fetchStreamingAvailability = createServerFn({ method: "POST" })
  .inputValidator((data: TitleInput[]) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.WATCHMODE_API_KEY;
    if (!apiKey) return {} as Record<string, string[]>;

    const results = await Promise.allSettled(
      data.map(async ({ id, title, year, format }) => {
        const watchmodeId = await getWatchmodeId(apiKey, title, year, format);
        if (!watchmodeId) return { id, platforms: [] };
        const platforms = await getStreamingSources(apiKey, watchmodeId);
        return { id, platforms };
      }),
    );

    const map: Record<string, string[]> = {};
    for (const r of results) {
      if (r.status === "fulfilled" && r.value.platforms.length > 0) {
        map[r.value.id] = r.value.platforms;
      }
    }
    return map;
  });
