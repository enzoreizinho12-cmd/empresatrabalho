import Link from "next/link";
import { unsaveJob } from "@/app/actions";
import { requireRole } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";
export default async function SavedJobs() {
  const { supabase, user } = await requireRole("candidate");
  const { data } = await supabase.from("saved_jobs").select("job_id,jobs(id,title,city,contract_type)").eq("user_id", user.id).order("created_at", { ascending: false });
  return <main className="container-page py-10 mobile-bottom"><div className="grid sm:grid-cols-[220px_1fr] gap-7"><DashboardNav role="candidate"/><div><h1 className="text-3xl font-black mb-6">Vagas salvas</h1>{data?.length ? <div className="grid gap-4">{data.map(item => { const job = item.jobs as unknown as { id: string; title: string; city: string; contract_type: string } | null; return <div key={item.job_id} className="card p-6"><h2 className="font-bold text-xl">{job?.title || "Vaga indisponível"}</h2><p className="text-slate-600 mt-1">{job?.city} {job?.contract_type && `• ${job.contract_type}`}</p><div className="flex gap-4 mt-4">{job && <Link href={`/vagas/${job.id}`} className="text-blue-700 font-bold">Ver vaga</Link>}<form action={unsaveJob}><input type="hidden" name="job_id" value={item.job_id}/><button className="text-slate-600">Remover</button></form></div></div>; })}</div> : <p className="card p-6 text-slate-600">Você ainda não salvou vagas. <Link href="/vagas" className="text-blue-700 font-bold">Explorar vagas</Link></p>}</div></div></main>;
}
