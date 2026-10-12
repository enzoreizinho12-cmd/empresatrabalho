import { requestDeletion } from "@/app/actions";
import { requireUser } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";
import { Feedback } from "@/components/feedback";
export default async function Account({ searchParams }: { searchParams: Promise<{ erro?: string; aviso?: string }> }) {
  const { supabase, user } = await requireUser();
  const { data: role } = await supabase.from("account_roles").select("role").eq("user_id", user.id).single();
  const { data: request } = await supabase.from("deletion_requests").select("status,requested_at").eq("user_id", user.id).maybeSingle();
  const feedback = await searchParams;
  return <main className="container-page py-10 mobile-bottom"><div className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-5 lg:gap-7"><DashboardNav role={role?.role || "candidate"}/><div><h1 className="text-3xl font-black mb-6">Minha conta</h1><Feedback {...feedback}/><div className="card p-6"><p><strong>E-mail:</strong> {user.email}</p><p className="text-slate-600 mt-2">Você controla a visibilidade profissional no seu perfil.</p></div><section className="card p-6 mt-5"><h2 className="font-bold text-xl">Solicitar exclusão dos dados</h2><p className="text-slate-600 mt-2">Registre a solicitação. A equipe precisará verificar obrigações de retenção e concluir a exclusão ou anonimização dos dados.</p>{request ? <p className="notice mt-4">Solicitação {request.status === "pending" ? "pendente" : "concluída"} desde {new Date(request.requested_at).toLocaleDateString("pt-BR")}.</p> : <form action={requestDeletion} className="mt-4"><button className="btn btn-outline">Solicitar exclusão</button></form>}</section></div></div></main>;
}
