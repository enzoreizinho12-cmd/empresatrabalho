import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "PombalEmprega",
    short_name: "PombalEmprega",
    description: "Encontre oportunidades de emprego e conecte-se às empresas de Ribeira do Pombal e região.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "pt-BR",
    dir: "ltr",
    theme_color: "#0755D8",
    background_color: "#FFFFFF",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icons/pombal-emprega-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/pombal-emprega-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/pombal-emprega-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icons/pombal-emprega-apple-180.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
