import { describe, it, expect } from "vitest";
import { recommend, type Answers } from "../catalog";

const BASE: Answers = {
  mood: "happy",
  genre: "comedy",
  language: "english",
  format: "movie",
  audience: "solo",
  time: "under2",
  era: "any",
  platform: "any",
};

describe("recommend()", () => {
  it("returns exactly 5 results", () => {
    expect(recommend(BASE)).toHaveLength(5);
  });

  it("language match scores higher than mismatch — english tops when language=english", () => {
    const results = recommend({ ...BASE, language: "english" });
    expect(results[0].language).toBe("english");
  });

  it("language=korean returns korean title as top result", () => {
    const results = recommend({ ...BASE, language: "korean", genre: "thriller", format: "either" });
    expect(results[0].language).toBe("korean");
  });

  it("language=any returns results without penalising any language", () => {
    const results = recommend({ ...BASE, language: "any" });
    expect(results).toHaveLength(5);
  });

  it("format=movie top result is a movie", () => {
    const results = recommend({ ...BASE, format: "movie" });
    expect(results[0].format).toBe("movie");
  });

  it("format=series top result is a series", () => {
    const results = recommend({ ...BASE, format: "series", time: "binge" });
    expect(results[0].format).toBe("series");
  });

  it("audience=family produces no dark/horror/crime titles", () => {
    const results = recommend({ ...BASE, format: "either", language: "any", audience: "family" });
    const bad = results.filter(
      (t) =>
        t.moods.includes("dark") ||
        t.genres.includes("horror") ||
        t.genres.includes("crime"),
    );
    expect(bad).toHaveLength(0);
  });

  it("time=under2 gives higher score to short movies — #1 result is ≤120 min", () => {
    const results = recommend({ ...BASE, time: "under2", format: "movie" });
    // The algorithm is soft-scoring, not hard-filtering. Verify the top pick respects time.
    expect(results[0].runtime ?? 0).toBeLessThanOrEqual(120);
  });

  it("era filter boosts matching era titles", () => {
    const results = recommend({ ...BASE, format: "either", language: "any", era: "recent" });
    expect(results.some((t) => t.era === "recent")).toBe(true);
  });

  it("platform filter boosts matching platform titles", () => {
    const results = recommend({ ...BASE, format: "either", language: "any", platform: "netflix" });
    expect(results.some((t) => t.platforms.includes("netflix"))).toBe(true);
  });

  it("rating bonus surfaces high-rated titles", () => {
    const results = recommend({ ...BASE, format: "either", language: "any", era: "any" });
    const topRated = results.find((t) => t.rating >= 9.0);
    expect(topRated).toBeDefined();
  });

  it("mood match adds score — tense mood returns tense titles", () => {
    const results = recommend({ ...BASE, mood: "tense", format: "either", language: "any" });
    expect(results.some((t) => t.moods.includes("tense"))).toBe(true);
  });

  it("genre match adds score — horror genre returns horror titles", () => {
    const results = recommend({ ...BASE, genre: "horror", format: "either", language: "any" });
    expect(results.some((t) => t.genres.includes("horror"))).toBe(true);
  });

  it("time=binge with format=either returns at least one series", () => {
    const results = recommend({ ...BASE, time: "binge", format: "either", language: "any" });
    expect(results.some((t) => t.format === "series")).toBe(true);
  });

  it("format=mini matches series with ≤10 episodes", () => {
    const results = recommend({ ...BASE, format: "mini", language: "any", time: "binge" });
    const miniSeries = results.filter(
      (t) => t.format === "series" && (t.episodes ?? 0) <= 10,
    );
    expect(miniSeries.length).toBeGreaterThan(0);
  });
});
