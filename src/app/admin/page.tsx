import { approveCompany } from "@/app/actions";
import { requireRole } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";
import { Feedback } from "@/components/feedback";

export default async function Admin({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { supabase } = await requireRole("admin");
  const [{ count: candidates }, { count: companiesCount }, { count: jobsCount }, { count: applicationsCount }, { data: companies }, { data: reports }, { data: audit }] = await Promise.all([
    supabase.from("account_roles").select("*", { count: "exact", head: true }).eq("role", "candidate"),
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase.from("companies").select("id,name,city,status,created_at").order("created_at", { ascending: false }).limit(30),
    supabase.from("reports").select("id,reason,status,job_id,created_at").order("created_at", { ascending: false }).limit(30),
    supabase.from("admin_audit").select("id,action,target_id,created_at").order("created_at", { ascending: false }).limit(20),
  ]);
  const params = await searchParams;
  return <main className="container-page py-10"><div className="grid sm:grid-cols-[220px_1fr] gap-7"><DashboardNav role="admin"/><div><h1 className="text-3xl font-black mb-2">Administração</h1><p className="text-slate-600 mb-7">Moderação e acompanhamento da operação.</p><Feedback erro={params.erro}/><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[[candidates,"Candidatos"],[companiesCount,"Empresas"],[jobsCount,"Vagas"],[applicationsCount,"Candidaturas"]].map(([n,label]) => <div key={label} className="card p-5"><strong className="text-3xl text-blue-700">{n ?? 0}</strong><p className="text-sm text-slate-600">{label}</p></div>)}</div>
    <h2 className="text-2xl font-bold mt-10 mb-4">Empresas</h2>{companies?.length ? <div className="grid gap-3">{companies.map(company => <div key={company.id} className="card p-5 flex flex-wrap justify-between gap-3"><div><strong>{company.name}</strong><p className="text-sm text-slate-600">{company.city} • {company.status}</p></div><div className="flex gap-2"><form action={approveCompany}><input type="hidden" name="company_id" value={company.id}/><input type="hidden" name="status" value="approved"/><button className="btn btn-green">Aprovar</button></form><form action={approveCompany}><input type="hidden" name="company_id" value={company.id}/><input type="hidden" name="status" value="blocked"/><button className="btn btn-outline">Bloquear</button></form></div></div>)}</div> : <p className="text-slate-600">Nenhuma empresa cadastrada.</p>}
    <h2 className="text-2xl font-bold mt-10 mb-4">Denúncias</h2>{reports?.length ? <div className="grid gap-3">{reports.map(report => <div className="card p-5" key={report.id}><strong>{report.status}</strong><p className="mt-2">{report.reason}</p><p className="text-xs text-slate-500 mt-2">Vaga: {report.job_id}</p></div>)}</div> : <p className="text-slate-600">Nenhuma denúncia.</p>}
    <h2 className="text-2xl font-bold mt-10 mb-4">Auditoria</h2>{audit?.length ? <div className="card divide-y">{audit.map(item => <p key={item.id} className="p-4 text-sm">{item.action} • {new Date(item.created_at).toLocaleString("pt-BR")}</p>)}</div> : <p className="text-slate-600">Sem ações registradas.</p>}
  </div></div></main>;
}
