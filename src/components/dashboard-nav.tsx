import Link from "next/link";
import { signOut } from "@/app/actions";

export function DashboardNav({ role }: { role: "candidate" | "company" | "admin" }) {
  const items = role === "candidate" ? [["/candidato", "Início"], ["/vagas", "Vagas"], ["/candidato/candidaturas", "Candidaturas"], ["/candidato/perfil", "Perfil"], ["/candidato/notificacoes", "Notificações"], ["/candidato/salvas", "Salvas"], ["/conta", "Conta"]]
    : role === "company" ? [["/empresa", "Início"], ["/empresa/nova-vaga", "Publicar vaga"], ["/empresa/candidaturas", "Candidaturas"], ["/empresa/talentos", "Talentos"], ["/empresa/perfil", "Empresa"], ["/conta", "Conta"]]
    : [["/admin", "Administração"]];
  return <><aside className="hidden sm:block card p-5 h-fit"><p className="text-xs uppercase tracking-wider text-slate-500 mb-4">Menu</p><nav className="grid gap-2">{items.map(([href, label]) => <Link key={href} href={href} className="px-3 py-2 rounded-lg hover:bg-slate-100 font-semibold">{label}</Link>)}<form action={signOut}><button className="px-3 py-2 text-slate-600">Sair</button></form></nav></aside>
  <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t grid grid-cols-5 text-center text-xs shadow-xl">{items.slice(0, 5).map(([href, label]) => <Link key={href} href={href} className="py-4 px-1 font-semibold">{label}</Link>)}</nav></>;
}
