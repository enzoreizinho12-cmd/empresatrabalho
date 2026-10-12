"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Home, MapPin, Menu } from "@/components/icons";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

let wasInstalled = false;
function subscribePwaDisplay(listener: () => void) {
  const media = window.matchMedia("(display-mode: standalone)");
  const onInstalled = () => { wasInstalled = true; listener(); };
  media.addEventListener("change", listener);
  window.addEventListener("appinstalled", onInstalled);
  return () => { media.removeEventListener("change", listener); window.removeEventListener("appinstalled", onInstalled); };
}
function getInstalledSnapshot() { return wasInstalled || window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true; }
function getAppleInstallSnapshot() { return !getInstalledSnapshot() && isAppleSafari(); }

const publicLinks = [["/", "Início"], ["/vagas", "Vagas"], ["/para-empresas", "Para empresas"], ["/como-funciona", "Como funciona"], ["/planos", "Planos"], ["/ajuda", "Ajuda"]];

function isAppleSafari() {
  const agent = navigator.userAgent;
  const appleMobile = /iPhone|iPad|iPod/.test(agent) || (/Macintosh/.test(agent) && navigator.maxTouchPoints > 1);
  return appleMobile && /Safari/.test(agent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(agent);
}

function PwaControls() {
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const installed = useSyncExternalStore(subscribePwaDisplay, getInstalledSnapshot, () => false);
  const appleInstall = useSyncExternalStore(subscribePwaDisplay, getAppleInstallSnapshot, () => false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [installGuide, setInstallGuide] = useState(false);
  const reloadAfterUpdate = useRef(false);

  useEffect(() => {
    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    const onInstalled = () => { wasInstalled = true; setInstallPrompt(null); };
    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    let updateTimer: number | undefined; let updateCheck: (() => void) | undefined;
    let disposed = false;
    const onControllerChange = () => { if (reloadAfterUpdate.current) window.location.reload(); };
    navigator.serviceWorker?.addEventListener("controllerchange", onControllerChange);

    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator && window.isSecureContext) {
      void navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).then((result) => {
        if (disposed) return;

        if (result.waiting && navigator.serviceWorker.controller) setWaitingWorker(result.waiting);
        result.addEventListener("updatefound", () => {
          const installing = result.installing;
          installing?.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) setWaitingWorker(installing);
          });
        });
        updateCheck = () => { if (document.visibilityState === "visible" && navigator.onLine) void result.update().catch(() => {}); };
        document.addEventListener("visibilitychange", updateCheck);
        updateTimer = window.setInterval(updateCheck, 30 * 60 * 1000);

      }).catch(() => {});
    }
    return () => {
      disposed = true;
      window.removeEventListener("beforeinstallprompt", onInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      navigator.serviceWorker?.removeEventListener("controllerchange", onControllerChange);
      if (updateCheck) document.removeEventListener("visibilitychange", updateCheck); if (updateTimer) window.clearInterval(updateTimer);
    };
  }, []);

  useEffect(() => {
    if (!installGuide) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setInstallGuide(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [installGuide]);

  async function install() {
    if (appleInstall) { setInstallGuide(true); return; }
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstallPrompt(null);
  }

  function update() {
    const forms = Array.from(document.forms);
    const hasUnsavedChanges = forms.some((form) => Array.from(form.elements).some((element) => {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) return false;
      if (element instanceof HTMLInputElement && ["hidden", "submit", "button", "reset"].includes(element.type)) return false;
      if (element instanceof HTMLInputElement && ["checkbox", "radio"].includes(element.type)) return element.checked !== element.defaultChecked;
      if (element instanceof HTMLInputElement && element.type === "file") return Boolean(element.files?.length);
      if (element instanceof HTMLSelectElement) return Array.from(element.options).some((option) => option.selected !== option.defaultSelected);
      return element.value !== element.defaultValue;
    }));
    if (hasUnsavedChanges) {
      setUpdateMessage("Envie ou salve as alterações do formulário antes de atualizar.");
      return;
    }
    if (!waitingWorker) return;
    reloadAfterUpdate.current = true;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  }

  return <>
    {(installPrompt || appleInstall) && !installed && <button type="button" className="site-install" onClick={() => void install()} aria-label="Instalar PombalEmprega"><span aria-hidden="true">↓</span><b>Instalar</b></button>}
    {waitingWorker && <div className="site-update-banner" role="status" aria-live="polite"><div><strong>Uma nova versão do PombalEmprega está disponível.</strong>{updateMessage && <small>{updateMessage}</small>}</div><button type="button" onClick={update}>Atualizar</button><button type="button" className="site-update-dismiss" onClick={() => { setWaitingWorker(null); setUpdateMessage(""); }} aria-label="Fechar aviso">×</button></div>}
    {installGuide && <div className="site-install-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setInstallGuide(false); }}><section className="site-install-dialog" role="dialog" aria-modal="true" aria-labelledby="install-title"><button type="button" className="site-install-close" onClick={() => setInstallGuide(false)} aria-label="Fechar instruções">×</button><p className="site-install-kicker">PombalEmprega no seu iPhone</p><h2 id="install-title">Adicione à Tela de Início</h2><ol><li>No Safari, toque no botão <b>Compartilhar</b> (quadrado com seta para cima).</li><li>Role as opções e toque em <b>Adicionar à Tela de Início</b>.</li><li>Confirme em <b>Adicionar</b>.</li></ol><p>Depois, abra o PombalEmprega pelo ícone na tela inicial.</p><button type="button" className="site-install-done" onClick={() => setInstallGuide(false)}>Entendi</button></section></div>}
  </>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: PointerEvent) => { if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setMenuOpen(false); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  const nav = (className: string, label: string) => <nav className={className} aria-label={label}>{publicLinks.map(([href, title]) => { const isHome = href === "/"; return <Link key={href} href={href} className={isHome ? "site-home-link" : undefined} aria-current={pathname === href ? "page" : undefined} onClick={() => setMenuOpen(false)}>{isHome && <Home size={16}/>}<span>{title}</span></Link>; })}</nav>;
  return <header className="site-header"><div className="container-page site-header-inner">
    <Link href="/" className="site-brand" aria-label="Pombal Emprega, início"><svg className="site-brand-symbol" viewBox="0 0 56 48" fill="none" aria-hidden="true"><circle cx="28" cy="10" r="8" fill="#0755D8"/><path d="M13 43c0-10 6-17 15-17s15 7 15 17" fill="#0755D8"/><circle cx="9" cy="18" r="6" fill="#0A9665"/><path d="M0 43c0-9 4-15 11-17 2 0 4 1 6 2-4 4-6 9-6 15" fill="#0A9665"/><circle cx="47" cy="18" r="6" fill="#0A9665"/><path d="M56 43c0-9-4-15-11-17-2 0-4 1-6 2 4 4 6 9 6 15" fill="#0A9665"/></svg><span className="site-brand-wordmark"><strong>Pombal<span>Emprega</span></strong><small>RIBEIRA DO POMBAL · BAHIA</small></span></Link>
    {nav("site-nav", "Navegação principal")}
    <div className="site-header-actions"><details className="site-location"><summary><MapPin size={15}/> Ribeira do Pombal · BA <ChevronDown size={12}/></summary><form action="/vagas"><label htmlFor="site-city">Buscar em outra cidade</label><input id="site-city" name="cidade" placeholder="Digite a cidade" autoComplete="address-level2"/><button type="submit">Ver vagas</button></form></details><Link href="/entrar" className="site-login">Entrar</Link><Link href="/cadastro" className="site-signup">Criar conta <ArrowRight size={16}/></Link><PwaControls/>
      <div className="site-mobile-menu" ref={menuRef}><button type="button" className="site-menu-trigger" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="site-mobile-navigation" onClick={() => setMenuOpen((open) => !open)}><Menu size={21}/></button>{menuOpen && <div id="site-mobile-navigation" className="site-mobile-panel">{nav("site-mobile-links", "Navegação móvel")}<details className="site-mobile-location"><summary><MapPin size={17}/> Minha localização <ChevronDown size={15}/></summary><form action="/vagas"><label htmlFor="mobile-site-city">Buscar em outra cidade</label><input id="mobile-site-city" name="cidade" placeholder="Digite a cidade" autoComplete="address-level2"/><button type="submit">Ver vagas</button></form></details><Link href="/painel" onClick={() => setMenuOpen(false)}>Meu painel</Link><Link href="/entrar" onClick={() => setMenuOpen(false)}>Entrar</Link><Link href="/cadastro" className="site-mobile-signup" onClick={() => setMenuOpen(false)}>Criar conta</Link></div>}</div>
    </div>
  </div></header>;
}
