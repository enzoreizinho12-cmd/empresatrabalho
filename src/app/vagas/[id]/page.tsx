import { notFound } from "next/navigation";
import { applyJob, reportJob, saveJob } from "@/app/actions";
import { Feedback } from "@/components/feedback";
import { calculateMatch } from "@/lib/match";
import { createClient } from "@/lib/supabase/server";

export default async function JobDetails({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ erro?: string; aviso?: string }> }) {
  const { id } = await params; const feedback = await searchParams;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return <main className="container-page py-12"><p className="notice">Configure o Supabase de desenvolvimento para consultar esta vaga.</p></main>;
  const supabase = await createClient();
  const { data: job } = await supabase.from("jobs").select("*,companies(name,description)").eq("id", id).maybeSingle();
  if (!job) notFound();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from("candidate_profiles").select("*").eq("user_id", user.id).maybeSingle() : { data: null };
  const match = profile ? calculateMatch(profile, job) : null;
  return <main className="container-page max-w-4xl py-10"><Feedback {...feedback}/><div className="card overflow-hidden"><div className="bg-gradient-to-r from-blue-700 to-emerald-700 p-7 text-white"><p>{(job.companies as unknown as { name: string } | null)?.name}</p><h1 className="text-4xl font-black mt-2">{job.title}</h1><p className="mt-3">{job.city} • {job.contract_type} • {job.work_mode}</p></div><div className="p-7 grid gap-7">
    <div className="flex flex-wrap gap-2 text-sm">{job.salary_min && <span className="bg-slate-100 rounded-full px-3 py-1">A partir de R$ {Number(job.salary_min).toLocaleString("pt-BR")}</span>}<span className="bg-slate-100 rounded-full px-3 py-1">{job.min_experience_months ? `${job.min_experience_months} meses de experiência` : "Sem experiência mínima"}</span>{job.first_job_friendly && <span className="bg-emerald-100 rounded-full px-3 py-1">Primeiro emprego</span>}</div>
    {match && <section className="bg-emerald-50 rounded-xl p-5"><h2 className="font-bold text-emerald-900 text-xl">{match.score}% de compatibilidade</h2><p className="text-sm text-emerald-900 mt-1">Critérios v{match.version}. A pontuação orienta; você pode se candidatar mesmo com lacunas.</p><div className="grid md:grid-cols-2 gap-4 mt-4"><div><strong>Você atende</strong><ul className="list-disc pl-5 text-sm mt-1">{match.reasons.map(r => <li key={r}>{r}</li>)}</ul></div><div><strong>Pontos a desenvolver</strong><ul className="list-disc pl-5 text-sm mt-1">{match.gaps.length ? match.gaps.map(g => <li key={g}>{g}</li>) : <li>Nenhum identificado</li>}</ul></div></div></section>}
    <section><h2 className="text-xl font-bold mb-2">Descrição da vaga</h2><p className="whitespace-pre-wrap leading-relaxed text-slate-700">{job.description}</p></section>
    <section><h2 className="text-xl font-bold mb-2">Requisitos</h2><p className="text-slate-600">Habilidades obrigatórias: {job.required_skills?.join(", ") || "Não informadas"}</p><p className="text-slate-600 mt-1">Desejáveis: {job.preferred_skills?.join(", ") || "Não informadas"}</p><p className="text-slate-600 mt-1">Disponibilidade: {job.availability?.join(", ") || "A combinar"}</p></section>
    {job.benefits?.length > 0 && <section><h2 className="text-xl font-bold mb-2">Benefícios</h2><p>{job.benefits.join(", ")}</p></section>}
    {job.deadline && <p className="text-sm text-slate-500">Candidaturas até {new Date(`${job.deadline}T12:00:00`).toLocaleDateString("pt-BR")}</p>}
    <div id="candidatar" className="flex flex-wrap gap-3">{profile ? <><form action={applyJob}><input type="hidden" name="job_id" value={id}/><button className="btn btn-blue">Candidatar-me agora</button></form><form action={saveJob}><input type="hidden" name="job_id" value={id}/><button className="btn btn-outline">Salvar vaga</button></form></> : <a href={`/entrar?next=${encodeURIComponent(`/vagas/${id}`)}`} className="btn btn-blue">Entre para se candidatar</a>}</div>
    {user && <form action={reportJob} className="border-t pt-5"><label htmlFor="reason" className="label">Denunciar vaga suspeita</label><div className="flex flex-col sm:flex-row gap-2"><input type="hidden" name="job_id" value={id}/><input id="reason" name="reason" minLength={10} required className="field" placeholder="Descreva o problema"/><button className="btn btn-outline shrink-0">Enviar denúncia</button></div></form>}
  </div></div></main>;
}
