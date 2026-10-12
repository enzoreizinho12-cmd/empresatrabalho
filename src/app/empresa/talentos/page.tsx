import { requireRole } from "@/lib/auth";
import { calculateMatch, type CandidateMatch, type JobMatch } from "@/lib/match";
import { DashboardNav } from "@/components/dashboard-nav";

type Talent = CandidateMatch & {
  user_id: string;
  full_name: string;
};

type ActiveJob = JobMatch & {
  id: string;
  status: string;
};

export default async function Talents({ searchParams }: {
  searchParams: Promise<{ cidade?: string; profissao?: string; vaga?: string }>;
}) {
  const { supabase, user } = await requireRole("company");
  const { data: company } = await supabase.from("companies").select("id,status").eq("owner_id", user.id).maybeSingle();
  const params = await searchParams;
  const approved = company?.status === "approved";

  const [{ data: directory, error: directoryError }, { data: ownJobs }] = await Promise.all([
    approved
      ? supabase.rpc("directory_search", { search_city: params.cidade || null, search_title: params.profissao || null })
      : Promise.resolve({ data: [], error: null }),
    approved && company
      ? supabase.from("jobs").select("id,title,city,required_skills,preferred_skills,min_experience_months,min_education_level,availability,work_mode,first_job_friendly,status").eq("company_id", company.id).eq("status", "active").order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);

  const jobs = (ownJobs ?? []) as ActiveJob[];
  const selectedJob = jobs.find((job) => job.id === params.vaga);
  const { data: matchResults, error: matchError } = selectedJob
    ? await supabase.rpc("company_job_candidates", { target_job: selectedJob.id })
    : { data: [], error: null };

  const directoryTalents = (directory ?? []) as Talent[];
  const ranked = selectedJob
    ? ((matchResults ?? []) as Talent[])
      .map((talent) => ({ talent, match: calculateMatch(talent, selectedJob) }))
      .sort((a, b) => b.match.score - a.match.score)
    : [];

  return <main className="container-page py-10 mobile-bottom">
    <div className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-5 lg:gap-7">
      <DashboardNav role="company"/>
      <div>
        <p className="text-emerald-700 font-bold">Banco de talentos</p>
        <h1 className="text-3xl font-black mb-6">Profissionais disponíveis</h1>
        {!approved ? <p className="notice">O acesso ao banco de talentos é liberado após aprovação da empresa.</p> : <>
          <section className="card p-5 mb-6">
            <h2 className="text-xl font-bold">Compatibilidade para uma vaga</h2>
            <p className="text-slate-600 mt-1 mb-4">Veja primeiro quem mais combina com os requisitos profissionais da vaga.</p>
            {jobs.length ? <form className="grid sm:grid-cols-[1fr_auto] gap-3">
              <select className="field" name="vaga" aria-label="Selecione uma vaga" defaultValue={selectedJob?.id ?? ""} required>
                <option value="" disabled>Selecione uma vaga ativa</option>
                {jobs.map((job) => <option key={job.id} value={job.id}>{job.title} · {job.city}</option>)}
              </select>
              <button className="btn btn-green">Encontrar compatíveis</button>
            </form> : <p className="text-slate-600">Publique uma vaga ativa para comparar candidatos com os requisitos.</p>}
            {matchError && <p className="error mt-4">Não foi possível calcular as compatibilidades desta vaga.</p>}
            {selectedJob && !matchError && <div className="grid gap-3 mt-5">
              {ranked.length ? ranked.map(({ talent, match }) => <article className="rounded-xl border border-slate-200 p-5" key={talent.user_id}>
                <div className="flex flex-wrap justify-between gap-3"><div>
                  <h3 className="font-bold text-lg">{talent.full_name}</h3>
                  <p className="text-slate-600">{talent.desired_title || "Profissional"} · {talent.city}</p>
                </div><span className="h-fit rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 font-bold">{match.score}% compatível</span></div>
                <p className="text-sm mt-3">Experiência: {talent.experience_months} meses · Disponibilidade: {talent.availability?.join(", ") || "Não informada"}</p>
                <p className="text-sm mt-1">Habilidades: {talent.skills?.join(", ") || "Não informadas"}</p>
                <p className="text-sm text-emerald-800 mt-3">{match.reasons.slice(0, 3).join(" · ")}</p>
                {match.gaps.length > 0 && <p className="text-sm text-slate-600 mt-1">A desenvolver: {match.gaps.slice(0, 2).join(" · ")}</p>}
              </article>) : <p className="rounded-xl bg-slate-50 p-5 text-slate-600">Não há perfis com compartilhamento profissional ativado para esta vaga.</p>}
            </div>}
          </section>

          <h2 className="text-xl font-bold mb-3">Busca no diretório</h2>
          <form className="card p-5 grid sm:grid-cols-[1fr_1fr_auto] gap-3">
            <input className="field" name="profissao" aria-label="Profissão" placeholder="Profissão" defaultValue={params.profissao}/>
            <input className="field" name="cidade" aria-label="Cidade" placeholder="Cidade" defaultValue={params.cidade}/>
            <button className="btn btn-green">Buscar</button>
          </form>
          {directoryError ? <p className="error mt-5">Não foi possível consultar profissionais.</p> : directoryTalents.length ? <div className="grid md:grid-cols-2 gap-4 mt-6">{directoryTalents.map((talent) => <article className="card p-6" key={talent.user_id}>
            <h2 className="font-bold text-xl">{talent.full_name}</h2><p className="text-slate-600 mt-1">{talent.desired_title || "Profissional"} · {talent.city}</p>
            <p className="text-sm mt-3">Experiência: {talent.experience_months} meses</p><p className="text-sm mt-2">Habilidades: {talent.skills?.join(", ") || "Não informadas"}</p>
            <p className="text-sm mt-2">Disponibilidade: {talent.availability?.join(", ") || "Não informada"}</p>
          </article>)}</div> : <p className="card p-6 mt-6 text-slate-600">Nenhum perfil público encontrado para esta busca.</p>}
        </>}
      </div>
    </div>
  </main>;
}
