import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  const pages = [
    ["", 1],
    ["vagas", 0.9],
    ["para-empresas", 0.7],
    ["como-funciona", 0.7],
    ["planos", 0.5],
    ["ajuda", 0.5],
    ["privacidade", 0.2],
    ["termos", 0.2],
  ] as const;

  return pages.map(([path, priority]) => ({
    url: path ? `${origin}/${path}` : origin,
    changeFrequency: path === "vagas" ? "daily" : "monthly",
    priority,
  }));
}
