import Link from "next/link";
import { withdrawApplication } from "@/app/actions";
import { requireRole } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";
import { Feedback } from "@/components/feedback";

export default async function CandidateApplications({ searchParams }: { searchParams: Promise<{ erro?: string; aviso?: string }> }) {
  const { supabase, user } = await requireRole("candidate");
  const { data: applications } = await supabase.from("applications").select("id,stage,created_at,jobs(id,title,city,companies(name))").eq("candidate_id", user.id).order("created_at", { ascending: false });
  const feedback = await searchParams;
  return <main className="container-page py-10 mobile-bottom"><div className="grid sm:grid-cols-[220px_1fr] gap-7"><DashboardNav role="candidate"/><div><h1 className="text-3xl font-black mb-6">Minhas candidaturas</h1><Feedback {...feedback}/>{applications?.length ? <div className="grid gap-4">{applications.map(item => { const job = item.jobs as unknown as { id: string; title: string; city: string; companies: { name: string } | null } | null; return <div key={item.id} className="card p-6"><div className="flex justify-between gap-3"><div><h2 className="font-bold text-lg">{job?.title}</h2><p className="text-slate-600">{job?.companies?.name} • {job?.city}</p></div><span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm h-fit">{item.stage.replaceAll("_", " ")}</span></div><div className="flex gap-3 items-center mt-5"><Link href={`/vagas/${job?.id}`} className="text-blue-700 font-bold">Ver vaga</Link>{!["contratado","nao_selecionado","encerrada","retirada"].includes(item.stage) && <form action={withdrawApplication}><input type="hidden" name="application_id" value={item.id}/><button className="text-slate-500 text-sm">Retirar candidatura</button></form>}</div></div>; })}</div> : <p className="card p-6 text-slate-600">Você ainda não se candidatou. <Link href="/vagas" className="text-blue-700 font-bold">Explorar vagas</Link></p>}</div></div></main>;
}
