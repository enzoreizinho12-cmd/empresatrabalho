import { describe, expect, it } from "vitest";
import { getSiteOrigin } from "./site-url";

describe("getSiteOrigin", () => {
  it("uses the configured public URL without its path", () => {
    expect(getSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://jobs.example/app/" })).toBe("https://jobs.example");
  });

  it("uses Vercel's deployment host when an explicit URL is absent", () => {
    expect(getSiteOrigin({ VERCEL_URL: "pombal-preview.vercel.app" })).toBe("https://pombal-preview.vercel.app");
  });

  it("uses the current isolated Vercel preview host", () => {
    expect(getSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://pombalemprega.com", VERCEL_ENV: "preview", VERCEL_URL: "pombal-preview.vercel.app" })).toBe("https://pombal-preview.vercel.app");
  });

  it("uses localhost only as the local default", () => {
    expect(getSiteOrigin({})).toBe("http://localhost:3000");
  });

  it.each(["javascript:alert(1)", "https://user:password@example.com", "http://public.example"]) (
    "rejects unsafe URL %s",
    (value) => {
      expect(() => getSiteOrigin({ NEXT_PUBLIC_SITE_URL: value })).toThrow();
    },
  );

  it("rejects localhost as a production auth origin", () => {
    expect(() => getSiteOrigin({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000", VERCEL_ENV: "production" })).toThrow();
  });

  it("allows local production builds to use localhost", () => {
    expect(getSiteOrigin({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000", NODE_ENV: "production" })).toBe("http://localhost:3000");
  });
});
