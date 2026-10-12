import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { calculateMatch } from "@/lib/match";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function CandidateDashboard() {
  const { supabase, user } = await requireRole("candidate");
  const [{ data: profile }, { data: jobs }, { data: applications }, { data: notifications }] = await Promise.all([
    supabase.from("candidate_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("jobs").select("id,title,city,contract_type,salary_min,work_mode,required_skills,preferred_skills,min_experience_months,min_education_level,availability,first_job_friendly,companies(name)").eq("status", "active").order("created_at", { ascending: false }).limit(50),
    supabase.from("applications").select("id,stage").eq("candidate_id", user.id),
    supabase.from("notifications").select("id,title,body,href,created_at").eq("user_id", user.id).is("read_at", null).order("created_at", { ascending: false }).limit(5),
  ]);
  if (!profile) return <main className="container-page py-10"><h1 className="text-3xl font-bold">Comece pelo seu perfil</h1><p className="text-slate-600 mt-2 mb-6">Adicione suas habilidades para receber recomendações de vagas.</p><Link href="/candidato/perfil" className="btn btn-blue">Criar meu currículo</Link></main>;
  const ranked = (jobs ?? []).map(job => ({ job, match: calculateMatch(profile, job) })).sort((a,b) => b.match.score - a.match.score);
  const completion = [profile.full_name, profile.city, profile.desired_title, profile.skills?.length, profile.availability?.length, profile.education_level, profile.experience_summary || profile.first_job].filter(Boolean).length;
  return <main className="container-page py-8 sm:py-12 mobile-bottom"><div className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-5 lg:gap-7"><DashboardNav role="candidate"/><div>
    <div className="flex justify-between gap-4 items-start"><div><p className="text-blue-700 font-bold">Painel do candidato</p><h1 className="text-3xl font-black mt-1">Olá, {profile.full_name.split(" ")[0]}! 👋</h1><p className="text-slate-600 mt-2">Seu perfil está {Math.round(completion / 7 * 100)}% completo.</p></div><Link href="/candidato/perfil" className="btn btn-outline">Editar currículo</Link></div>
    <div className="h-2 bg-slate-200 rounded-full mt-5"><div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${Math.round(completion / 7 * 100)}%` }}/></div>
    <div className="grid md:grid-cols-3 gap-4 mt-7"><div className="card p-6 bg-blue-700 text-white md:col-span-2"><p className="text-2xl font-bold">{ranked.length} oportunidade{ranked.length === 1 ? "" : "s"} disponível{ranked.length === 1 ? "" : "eis"}</p><p className="text-blue-100 mt-2">Ordenadas pela compatibilidade com seu perfil profissional.</p><Link href="/vagas" className="btn bg-white text-blue-800 mt-5">Ver vagas</Link></div><div className="card p-6"><p className="text-3xl font-black text-blue-700">{applications?.length ?? 0}</p><p className="font-semibold mt-2">Candidaturas enviadas</p><Link href="/candidato/candidaturas" className="text-blue-700 text-sm">Acompanhar →</Link></div></div>
    <div className="flex justify-between items-center mt-10 mb-4"><h2 className="text-2xl font-bold">Vagas recomendadas para você</h2><Link href="/candidato/salvas" className="text-blue-700 font-bold">Salvas →</Link></div>{ranked.length ? <div className="grid gap-4">{ranked.slice(0, 8).map(({ job, match }) => <Link href={`/vagas/${job.id}`} key={job.id} className="card p-6 hover:border-blue-300"><div className="flex justify-between gap-3"><div><h3 className="text-lg font-bold">{job.title}</h3><p className="text-slate-600">{(job.companies as unknown as { name: string } | null)?.name} • {job.city}</p></div><span className="self-start rounded-full bg-green-100 text-green-800 text-sm font-bold px-3 py-1">{match.score}%</span></div><p className="text-sm text-slate-500 mt-3">{job.contract_type} • {job.work_mode}{job.salary_min ? ` • A partir de R$ ${Number(job.salary_min).toLocaleString("pt-BR")}` : ""}</p><p className="text-sm text-emerald-700 mt-3">{match.reasons.slice(0,2).join(" • ")}</p></Link>)}</div> : <p className="card p-6 text-slate-600">Ainda não há vagas publicadas. Volte em breve.</p>}
    <h2 className="text-2xl font-bold mt-10 mb-4">Notificações recentes</h2>{notifications?.length ? <div className="grid gap-3">{notifications.map(item => <Link key={item.id} href={item.href || "/candidato"} className="card p-4"><strong>{item.title}</strong><p className="text-sm text-slate-600">{item.body}</p></Link>)}</div> : <p className="text-slate-600">Nenhuma notificação nova.</p>}
  </div></div></main>;
}
