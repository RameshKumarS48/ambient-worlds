import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchWikipediaPoster, enrichWithPosters } from "../wikipedia";

describe("fetchWikipediaPoster()", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns a URL string when Wikipedia has a thumbnail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        thumbnail: { source: "https://upload.wikimedia.org/test.jpg", width: 320, height: 480 },
      }),
    } as Response);

    const url = await fetchWikipediaPoster("Inception", 2010, "movie");
    expect(url).toBe("https://upload.wikimedia.org/test.jpg");
  });

  it("falls back to originalimage when thumbnail is absent", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        originalimage: { source: "https://upload.wikimedia.org/original.jpg" },
      }),
    } as Response);

    const url = await fetchWikipediaPoster("Some Film", 2015, "movie");
    expect(url).toBe("https://upload.wikimedia.org/original.jpg");
  });

  it("returns null when all variants return 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const url = await fetchWikipediaPoster("Unknown Film XYZ", 1900, "movie");
    expect(url).toBeNull();
  });

  it("returns null on a network error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    const url = await fetchWikipediaPoster("Inception", 2010, "movie");
    expect(url).toBeNull();
  });

  it("calls the Wikipedia REST API with an encoded title", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ thumbnail: { source: "https://example.com/img.jpg" } }),
    } as Response);

    await fetchWikipediaPoster("The Dark Knight", 2008, "movie");
    const firstCall = (spy.mock.calls[0] as [string])[0];
    expect(firstCall).toContain("wikipedia.org/api/rest_v1/page/summary");
    expect(firstCall).toContain("Dark");
  });

  it("tries the (film) variant for movies", async () => {
    const spy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: false, status: 404 } as Response)
      .mockResolvedValue({
        ok: true,
        json: async () => ({ thumbnail: { source: "https://example.com/poster.jpg" } }),
      } as Response);

    const url = await fetchWikipediaPoster("Parasite", 2019, "movie");
    expect(url).toBe("https://example.com/poster.jpg");
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("tries the (TV series) variant for series", async () => {
    const spy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: false, status: 404 } as Response)
      .mockResolvedValue({
        ok: true,
        json: async () => ({ thumbnail: { source: "https://example.com/show.jpg" } }),
      } as Response);

    const url = await fetchWikipediaPoster("Dark", 2017, "series");
    expect(url).toBe("https://example.com/show.jpg");
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

describe("enrichWithPosters()", () => {
  afterEach(() => vi.restoreAllMocks());

  it("adds posterPath to each item", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ thumbnail: { source: "https://example.com/img.jpg" } }),
    } as Response);

    const items = [
      { title: "Inception", year: 2010, format: "movie" as const },
      { title: "Breaking Bad", year: 2008, format: "series" as const },
    ];
    const result = await enrichWithPosters(items);
    expect(result).toHaveLength(2);
    expect(result[0].posterPath).toBe("https://example.com/img.jpg");
    expect(result[1].posterPath).toBe("https://example.com/img.jpg");
  });

  it("sets posterPath to null when no image is found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false, status: 404 } as Response);

    const items = [{ title: "Unknown", year: 1900, format: "movie" as const }];
    const result = await enrichWithPosters(items);
    expect(result[0].posterPath).toBeNull();
  });

  it("preserves all original fields on each item", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false, status: 404 } as Response);

    const items = [{ title: "Test", year: 2020, format: "movie" as const, rating: 8.5 }];
    const result = await enrichWithPosters(items);
    expect(result[0].title).toBe("Test");
    expect(result[0].rating).toBe(8.5);
  });
});
