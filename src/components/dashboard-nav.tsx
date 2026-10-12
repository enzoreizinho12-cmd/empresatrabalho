"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions";

type Role = "candidate" | "company" | "admin";
type Item = [string, string];
const routeSets: Record<Role, { main: Item[]; more: Item[] }> = {
  candidate: { main: [["/candidato", "Início"], ["/vagas", "Vagas"], ["/candidato/candidaturas", "Candidaturas"], ["/candidato/perfil", "Perfil"]], more: [["/candidato/notificacoes", "Notificações"], ["/candidato/salvas", "Vagas salvas"], ["/conta", "Conta"]] },
  company: { main: [["/empresa", "Início"], ["/empresa/nova-vaga", "Publicar vaga"], ["/empresa/candidaturas", "Candidaturas"], ["/empresa/talentos", "Talentos"]], more: [["/empresa/perfil", "Perfil da empresa"], ["/conta", "Conta"]] },
  admin: { main: [["/admin", "Administração"]], more: [] },
};

export function DashboardNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const { main, more } = routeSets[role];
  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
  const links = (items: Item[], className: string) => items.map(([href, label]) => <Link key={href} href={href} className={className} aria-current={active(href) ? "page" : undefined}>{label}</Link>);
  return <>
    <aside className="dashboard-desktop card p-5 h-fit"><p className="text-xs uppercase tracking-wider text-slate-500 mb-4">Menu</p><nav className="grid gap-2">{links([...main, ...more], "dashboard-side-link")}</nav><form action={signOut} className="mt-2"><button className="dashboard-side-link dashboard-signout">Sair</button></form></aside>
    <nav className="dashboard-bottom" aria-label="Navegação do painel" style={{ gridTemplateColumns: "repeat(" + (main.length + 1) + ", minmax(0, 1fr))" }}>{links(main, "dashboard-bottom-link")}{more.length > 0 ? <details className="dashboard-more"><summary aria-label="Mais opções">Mais</summary><div className="dashboard-more-panel">{links(more, "dashboard-more-link")}<form action={signOut}><button className="dashboard-more-link">Sair</button></form></div></details> : <form action={signOut} className="dashboard-bottom-exit"><button className="dashboard-bottom-link">Sair</button></form>}</nav>
  </>;
}
