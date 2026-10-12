import { moveApplication } from "@/app/actions";
import { requireRole } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";
import { Feedback } from "@/components/feedback";

type Applicant = { application_id: string; job_id: string; job_title: string; candidate_name: string; candidate_city: string; candidate_title: string | null; candidate_skills: string[]; stage: string; applied_at: string };
const stages = [["visualizada", "Currículo visualizado"], ["analise", "Em análise"], ["entrevista", "Selecionado para entrevista"], ["agendada", "Entrevista agendada"], ["aprovada", "Aprovado"], ["contratado", "Contratado"], ["nao_selecionado", "Não selecionado"], ["encerrada", "Vaga encerrada"]];
export default async function CompanyApplications({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { supabase } = await requireRole("company");
  const { data, error } = await supabase.rpc("company_applicants");
  const applicants = (data ?? []) as Applicant[];
  const params = await searchParams;
  return <main className="container-page py-10 mobile-bottom"><div className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-5 lg:gap-7"><DashboardNav role="company"/><div><p className="text-emerald-700 font-bold">Seleção</p><h1 className="text-3xl font-black mb-6">Candidaturas recebidas</h1><Feedback erro={params.erro}/>{error ? <p className="error">Não foi possível carregar candidaturas.</p> : applicants.length ? <div className="grid gap-4">{applicants.map(item => <div key={item.application_id} className="card p-6"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-bold text-xl">{item.candidate_name}</h2><p className="text-slate-600">{item.candidate_title || "Profissional"} • {item.candidate_city}</p><p className="text-sm text-slate-500 mt-1">Candidatura para {item.job_title}</p></div><span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full h-fit text-sm">{item.stage.replaceAll("_", " ")}</span></div><p className="text-sm mt-4">Habilidades: {item.candidate_skills?.join(", ") || "Não informadas"}</p>{!["contratado","nao_selecionado","encerrada","retirada"].includes(item.stage) && <form action={moveApplication} className="flex flex-wrap gap-2 mt-5"><input type="hidden" name="application_id" value={item.application_id}/><select name="stage" aria-label="Próxima etapa" className="field max-w-xs" defaultValue="analise">{stages.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select><button className="btn btn-green">Atualizar etapa</button></form>}</div>)}</div> : <p className="card p-6 text-slate-600">Nenhuma candidatura recebida até agora.</p>}</div></div></main>;
}
