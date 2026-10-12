import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { getSiteOrigin } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  applicationName: "PombalEmprega",
  title: { default: "PombalEmprega", template: "%s | PombalEmprega" },
  description: "Encontre oportunidades de emprego e conecte-se às empresas de Ribeira do Pombal e região.",
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: "/favicon.svg", sizes: "any", type: "image/svg+xml" }, { url: "/icons/pombal-emprega-192.png", sizes: "192x192", type: "image/png" }, { url: "/icons/pombal-emprega-512.png", sizes: "512x512", type: "image/png" }], apple: "/icons/pombal-emprega-apple-180.png" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "PombalEmprega" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0755D8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>
    <SiteHeader/>
    {children}
    <footer className="site-footer" id="ajuda"><div className="container-page site-footer-top"><div><Link href="/" className="site-brand" aria-label="Pombal Emprega, início"><svg className="site-brand-symbol" viewBox="0 0 56 48" fill="none" aria-hidden="true"><circle cx="28" cy="10" r="8" fill="#0755D8"/><path d="M13 43c0-10 6-17 15-17s15 7 15 17" fill="#0755D8"/><circle cx="9" cy="18" r="6" fill="#0A9665"/><path d="M0 43c0-9 4-15 11-17 2 0 4 1 6 2-4 4-6 9-6 15" fill="#0A9665"/><circle cx="47" cy="18" r="6" fill="#0A9665"/><path d="M56 43c0-9-4-15-11-17-2 0-4 1-6 2 4 4 6 9 6 15" fill="#0A9665"/></svg><span className="site-brand-wordmark"><strong>Pombal<span>Emprega</span></strong><small>RIBEIRA DO POMBAL · BAHIA</small></span></Link><p>Conectando pessoas e oportunidades na nossa região.</p></div><nav aria-label="Links institucionais"><strong>Institucional</strong><Link href="/vagas">Vagas</Link><Link href="/para-empresas">Para empresas</Link><Link href="/como-funciona">Como funciona</Link><Link href="/planos">Planos</Link><Link href="/ajuda">Ajuda</Link><Link href="/painel">Meu painel</Link><Link href="/privacidade">Política de privacidade</Link><Link href="/termos">Termos de uso</Link><a href="https://wa.me/5571992417737" target="_blank" rel="noopener noreferrer">Contato</a></nav><div className="site-footer-help"><strong>Ajuda</strong><details><summary>Como encontro vagas?</summary><p>Pesquise por cargo ou cidade na página de vagas e crie um perfil para acompanhar oportunidades.</p></details><details><summary>Como uma empresa publica vagas?</summary><p>Crie uma conta empresarial. Após aprovação, a empresa pode publicar vagas pelo painel.</p></details><a className="site-contact-button" href="https://wa.me/5571992417737" target="_blank" rel="noopener noreferrer">Entrar em contato <ArrowRight size={15}/></a></div></div><div className="container-page site-footer-bottom"><span>© {new Date().getFullYear()} Pombal Emprega. Todos os direitos reservados.</span><span>Desenvolvido por <strong>GOSYXP</strong> · Ideias que entregam resultados.</span></div></footer>
  </body></html>;
}
