import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/vagas", "/para-empresas", "/como-funciona", "/planos", "/ajuda", "/privacidade", "/termos"],
      disallow: ["/admin", "/painel", "/empresa", "/candidato", "/conta", "/entrar", "/cadastro", "/recuperar", "/nova-senha", "/auth"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
