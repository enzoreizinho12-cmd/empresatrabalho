import { describe, expect, it } from "vitest";
import { safeInternalRedirect } from "./safe-redirect";

describe("safeInternalRedirect", () => {
  const origin = "https://pombalemprega.example";

  it("keeps internal paths and query strings", () => {
    expect(safeInternalRedirect("/vagas?termo=caixa#lista", origin)).toBe("/vagas?termo=caixa#lista");
  });

  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "/%5c%5cevil.example"]) (
    "rejects external destination %s",
    (destination) => {
      expect(safeInternalRedirect(destination, origin)).toBe("/painel");
    },
  );

  it("uses the fallback for missing or malformed values", () => {
    expect(safeInternalRedirect(null, origin)).toBe("/painel");
    expect(safeInternalRedirect("/entrar", "invalid-origin")).toBe("/painel");
  });
});
