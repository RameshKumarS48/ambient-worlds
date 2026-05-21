import { describe, it, expect } from "vitest";
import { QUESTIONS } from "../questions";

describe("QUESTIONS data structure", () => {
  it("has exactly 8 questions", () => {
    expect(QUESTIONS).toHaveLength(8);
  });

  it("covers all required answer keys", () => {
    const keys = QUESTIONS.map((q) => q.key);
    const required = ["mood", "genre", "language", "format", "audience", "time", "era", "platform"];
    for (const k of required) {
      expect(keys).toContain(k);
    }
  });

  it("each question has at least 4 options", () => {
    for (const q of QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("all option values are unique within each question", () => {
    for (const q of QUESTIONS) {
      const values = q.options.map((o) => o.value);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("all options have non-empty label and value", () => {
    for (const q of QUESTIONS) {
      for (const o of q.options) {
        expect(o.value.trim().length).toBeGreaterThan(0);
        expect(o.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("questions have non-empty title and subtitle", () => {
    for (const q of QUESTIONS) {
      expect(q.title.trim().length).toBeGreaterThan(0);
      expect(q.subtitle.trim().length).toBeGreaterThan(0);
    }
  });
});
