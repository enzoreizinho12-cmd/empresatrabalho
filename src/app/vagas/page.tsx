import Link from "next/link";
import { applyJob } from "@/app/actions";
import { ArrowRight, BriefcaseBusiness, Building2, MapPin, Search, Sparkles } from "@/components/icons";
import { calculateMatch, type CandidateMatch } from "@/lib/match";
import { isJobArea, jobAreas } from "@/lib/job-areas";
import { createClient } from "@/lib/supabase/server";

type JobSummary = {
  id: string; title: string; description: string; city: string; contract_type: string;
  work_mode: string; salary_min: number | null; salary_max: number | null;
  min_experience_months: number; min_education_level: number; required_skills: string[];
  preferred_skills: string[]; availability: string[]; first_job_friendly: boolean;
  created_at: string; companies: { name: string } | null;
};
type Filters = {
  busca?: string; cidade?: string; area?: string; salario?: string; experiencia?: string;
  inicio?: string; contrato?: string; modalidade?: string; data?: string;
};
const contracts = ["CLT", "Temporário", "Freelancer", "Diária", "Estágio", "Jovem Aprendiz", "Primeiro emprego"];
const modes = ["presencial", "híbrido", "remoto"];
const clean = (value: string | undefined, max = 100) => (value ?? "").trim().slice(0, max);
const brl = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const dateLabel = (value: string) => new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

export default async function Jobs({ searchParams }: { searchParams: Promise<Filters> }) {
  const params = await searchParams;
  const search = clean(params.busca);
  const city = clean(params.cidade, 120) || "Ribeira do Pombal";
  const area = isJobArea(params.area) ? params.area : "";
  const salary = Number(params.salario);
  const experience = Number(params.experiencia);
  const contract = contracts.includes(params.contrato ?? "") ? params.contrato! : "";
  const mode = modes.includes(params.modalidade ?? "") ? params.modalidade! : "";
  const days = ["7", "30", "90"].includes(params.data ?? "") ? Number(params.data) : 0;
  const firstJob = params.inicio === "1";
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  let jobs: JobSummary[] = [];
  let loadError = false;
  let candidate: CandidateMatch | null = null;
  let isCandidate = false;

  if (configured) {
    try {
      const supabase = await createClient();
      const [{ data: { user } }, result] = await Promise.all([
        supabase.auth.getUser(),
        (async () => {
          let query = supabase.from("jobs").select("id,title,description,city,contract_type,work_mode,salary_min,salary_max,min_experience_months,min_education_level,required_skills,preferred_skills,availability,first_job_friendly,created_at,companies(name)")
            .eq("status", "active").order("created_at", { ascending: false }).limit(100);
          if (search) query = query.ilike("title", `%${search.replace(/[%_,()]/g, " ")}%`);
          if (city) query = query.ilike("city", `%${city.replace(/[%_,()]/g, " ")}%`);
          if (area) query = query.or(jobAreas[area].terms.map((term) => `title.ilike.%${term}%`).join(","));
          if (Number.isFinite(salary) && salary > 0) query = query.or(`salary_min.gte.${salary},salary_max.gte.${salary}`);
          if (params.experiencia !== undefined && Number.isFinite(experience) && experience >= 0) query = query.lte("min_experience_months", experience);
          if (firstJob) query = query.eq("first_job_friendly", true);
          if (contract) query = query.eq("contract_type", contract);
          if (mode) query = query.eq("work_mode", mode);
          if (days) query = query.gte("created_at", new Date(new Date().getTime() - days * 86400000).toISOString());
          return query;
        })(),
      ]);
      if (result.error) loadError = true;
      else jobs = (result.data ?? []) as unknown as JobSummary[];
      if (user) {
        const { data: role } = await supabase.from("account_roles").select("role,suspended").eq("user_id", user.id).maybeSingle();
        isCandidate = role?.role === "candidate" && !role.suspended;
        if (isCandidate) {
          const { data: profile } = await supabase.from("candidate_profiles").select("desired_title,city,skills,experience_months,education_level,availability,work_modes,first_job").eq("user_id", user.id).maybeSingle();
          if (profile) candidate = profile as CandidateMatch;
        }
      }
    } catch {
      loadError = true;
    }
  }

  const matches = candidate
    ? jobs.map((job) => ({ job, match: calculateMatch(candidate!, job) })).sort((a, b) => b.match.score - a.match.score)
    : [];
  const recommendedIds = new Set(matches.slice(0, 3).map(({ job }) => job.id));
  const loginHref = (jobId: string) => `/entrar?next=${encodeURIComponent(`/vagas/${jobId}`)}`;
  const detailsHref = (jobId: string) => `/vagas/${jobId}`;

  return <main className="min-h-screen bg-slate-50 pb-16">
    <section className="relative overflow-hidden bg-gradient-to-br from-[#082d79] via-[#0755d9] to-[#087b5b] text-white">
      <div className="pointer-events-none absolute -right-20 -top-32 size-96 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="container-page relative py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.16em]"><Sparkles size={16}/> Oportunidades perto de você</p>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">Encontre a oportunidade que <span className="text-emerald-300">combina com você!</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-blue-50 sm:text-lg">Descubra vagas perto de você e encontre empresas que procuram profissionais com o seu perfil.</p>
        </div>
        <form method="get" action="/vagas" className="mt-8 grid gap-3 rounded-2xl bg-white p-3 shadow-2xl shadow-blue-950/30 md:grid-cols-[1.4fr_1fr_auto] md:items-end">
          {area && <input type="hidden" name="area" value={area}/>}{firstJob && <input type="hidden" name="inicio" value="1"/>}
          <label className="block"><span className="mb-1.5 block px-2 text-xs font-bold text-slate-600">Qual emprego você procura?</span><span className="flex items-center gap-2 px-2"><Search size={19} className="shrink-0 text-blue-700"/><input name="busca" defaultValue={search} placeholder="Cargo ou profissão" className="min-h-11 w-full text-sm text-slate-900 outline-none placeholder:text-slate-400"/></span></label>
          <label className="block border-t border-slate-100 pt-2 md:border-l md:border-t-0 md:pl-4 md:pt-0"><span className="mb-1.5 block px-2 text-xs font-bold text-slate-600">Cidade</span><span className="flex items-center gap-2 px-2"><MapPin size={18} className="shrink-0 text-blue-700"/><input name="cidade" defaultValue={city} list="job-cities" placeholder="Qualquer cidade" className="min-h-11 w-full text-sm text-slate-900 outline-none placeholder:text-slate-400"/><datalist id="job-cities"><option value="Ribeira do Pombal"/><option value="Cícero Dantas"/><option value="Tucano"/><option value="Euclides da Cunha"/></datalist></span></label>
          <button className="btn btn-blue min-h-12 gap-2 px-7"><Search size={18}/>Buscar vagas</button>
        </form>
        <p className="mt-3 text-xs text-blue-100">Localização inicial: Ribeira do Pombal — BA. Você pode pesquisar qualquer cidade.</p>
      </div>
    </section>

    <section className="container-page py-8 sm:py-10">
      {candidate && <section className="mb-7 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 bg-gradient-to-r from-emerald-50 to-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div><p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700"><Sparkles size={15}/> Recomendadas para você</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">Oportunidades compatíveis com seu perfil</h2><p className="mt-1 text-sm text-slate-600">Compatibilidade calculada pelo seu currículo e pelos requisitos informados em cada vaga.</p></div>
          <Link href="/candidato/perfil" className="text-sm font-bold text-blue-700">Atualizar currículo <ArrowRight size={15} className="inline"/></Link>
        </div>
        {!candidate.desired_title && candidate.skills.length === 0 ? <p className="px-6 py-4 text-sm text-slate-600">Complete seu currículo para receber recomendações mais precisas.</p> : matches.length ? <div className="grid gap-3 p-4 sm:grid-cols-3">{matches.slice(0, 3).map(({ job, match }) => <Link key={job.id} href={detailsHref(job.id)} className="rounded-xl border border-slate-100 p-4 transition hover:border-emerald-300 hover:shadow-md"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-semibold text-slate-500">{job.companies?.name || "Empresa da região"}</p><h3 className="mt-1 font-bold text-slate-900">{job.title}</h3></div><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800">{match.score}%</span></div><p className="mt-2 text-xs text-slate-500">{match.reasons.slice(0, 2).join(" · ") || "Veja os requisitos e detalhes da vaga."}</p></Link>)}</div> : <p className="px-6 py-4 text-sm text-slate-600">Ainda não encontramos compatibilidades entre seu perfil e as vagas disponíveis.</p>}
      </section>}

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-blue-700">Trabalho mais perto de você</p><h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Vagas disponíveis</h2><p className="mt-1 text-sm text-slate-600">{loadError ? "Não conseguimos consultar as oportunidades agora." : `${jobs.length} ${jobs.length === 1 ? "oportunidade encontrada" : "oportunidades encontradas"} com os filtros atuais.`}</p></div><Link href="/vagas" className="text-sm font-bold text-blue-700">Limpar filtros</Link></div>
      <div className="grid items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-20 lg:block" open>
          <summary className="cursor-pointer list-none font-extrabold text-slate-900 [&::-webkit-details-marker]:hidden"><span className="inline-flex items-center gap-2"><BriefcaseBusiness size={18} className="text-blue-700"/>Filtros inteligentes</span><span className="float-right text-blue-700 lg:hidden">⌄</span></summary>
          <form method="get" action="/vagas" className="mt-4 grid gap-3 group-open:grid">
            <label className="text-xs font-bold text-slate-700">Profissão<input name="busca" defaultValue={search} placeholder="Cargo ou profissão" className="field mt-1 text-sm"/></label>
            <label className="text-xs font-bold text-slate-700">Cidade<input name="cidade" defaultValue={city} className="field mt-1 text-sm"/></label>
            <label className="text-xs font-bold text-slate-700">Área profissional<select name="area" defaultValue={area} className="field mt-1 text-sm"><option value="">Todas as áreas</option>{Object.entries(jobAreas).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
            <label className="text-xs font-bold text-slate-700">Salário mínimo (quando informado)<input name="salario" type="number" min="0" step="100" defaultValue={params.salario ?? ""} placeholder="R$ 0" className="field mt-1 text-sm"/></label>
            <label className="text-xs font-bold text-slate-700">Experiência máxima exigida<select name="experiencia" defaultValue={params.experiencia ?? ""} className="field mt-1 text-sm"><option value="">Qualquer experiência</option><option value="0">Sem experiência</option><option value="6">Até 6 meses</option><option value="12">Até 1 ano</option><option value="24">Até 2 anos</option></select></label>
            <label className="text-xs font-bold text-slate-700">Tipo de contratação<select name="contrato" defaultValue={contract} className="field mt-1 text-sm"><option value="">Todos</option>{contracts.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="text-xs font-bold text-slate-700">Modalidade<select name="modalidade" defaultValue={mode} className="field mt-1 text-sm"><option value="">Todas</option>{modes.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label>
            <label className="text-xs font-bold text-slate-700">Publicadas<select name="data" defaultValue={params.data ?? ""} className="field mt-1 text-sm"><option value="">Qualquer data</option><option value="7">Últimos 7 dias</option><option value="30">Últimos 30 dias</option><option value="90">Últimos 3 meses</option></select></label>
            <label className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-900"><input type="checkbox" name="inicio" value="1" defaultChecked={firstJob} className="mt-0.5 accent-emerald-700"/>Aceita primeiro emprego</label>
            <p className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">O cadastro de vagas ainda não possui bairro. A localização é filtrada pela cidade informada pela empresa.</p>
            <button className="btn btn-blue min-h-11 w-full">Aplicar filtros</button>
          </form>
        </details>

        <div>
          {loadError ? <div className="rounded-2xl border border-red-200 bg-white p-8 text-center"><h3 className="text-lg font-bold text-slate-900">Não foi possível carregar as vagas</h3><p className="mt-2 text-sm text-slate-600">Tente novamente em instantes.</p><Link href="/vagas" className="btn btn-outline mt-5">Tentar novamente</Link></div> : !configured ? <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center"><h3 className="text-lg font-bold">Conecte o ambiente de desenvolvimento</h3><p className="mt-2 text-sm text-slate-600">As oportunidades reais aparecerão quando o Supabase estiver configurado.</p></div> : jobs.length ? <div className="grid gap-4 xl:grid-cols-2">{jobs.map((job) => {
            const match = candidate ? calculateMatch(candidate, job) : null;
            const actionHref = isCandidate ? (candidate ? "" : "/candidato/perfil") : loginHref(job.id);
            return <article key={job.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg sm:p-6">
              <div className="flex gap-4"><div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-emerald-100 text-blue-800"><Building2 size={23}/></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-500">{job.companies?.name || "Empresa da região"}</p><h3 className="mt-1 text-lg font-extrabold leading-snug text-slate-950">{job.title}</h3><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600"><MapPin size={15} className="shrink-0 text-blue-700"/>{job.city} · Bahia</p></div>{match && <span title="Calculada pelo motor de compatibilidade do currículo" className="h-fit rounded-full bg-emerald-100 px-2.5 py-1.5 text-xs font-extrabold text-emerald-800">{match.score}% match</span>}</div>
              <div className="mt-4 flex flex-wrap gap-2">{[job.contract_type, job.work_mode[0].toUpperCase() + job.work_mode.slice(1), job.min_experience_months ? `${job.min_experience_months} meses de experiência` : "Sem experiência mínima", ...(job.first_job_friendly ? ["Primeiro emprego"] : [])].map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{tag}</span>)}</div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm"><span className="font-bold text-slate-900">{job.salary_min || job.salary_max ? `${job.salary_min ? brl(Number(job.salary_min)) : "A combinar"}${job.salary_max ? ` – ${brl(Number(job.salary_max))}` : ""}` : "Salário a combinar"}</span><time className="text-xs text-slate-500" dateTime={job.created_at}>Publicada em {dateLabel(job.created_at)}</time></div>
              {match && <p className="mt-3 text-xs leading-5 text-emerald-800">{match.reasons.slice(0, 2).join(" · ") || "Consulte os requisitos da oportunidade."}</p>}
              <div className="mt-4 grid grid-cols-2 gap-2"><Link href={detailsHref(job.id)} className="btn btn-outline min-h-11 gap-1 text-sm">Ver detalhes <ArrowRight size={15}/></Link>{isCandidate ? candidate ? <form action={applyJob}><input type="hidden" name="job_id" value={job.id}/><button className="btn btn-blue min-h-11 w-full text-sm">Candidatar-se</button></form> : <Link href={actionHref} className="btn btn-blue min-h-11 text-sm">Complete seu currículo</Link> : <Link href={actionHref} className="btn btn-blue min-h-11 text-sm">Candidatar-se</Link>}</div>
            </article>;
          })}</div> : <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white text-center shadow-sm"><div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-6 py-12 sm:px-10"><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-100 text-blue-700"><BriefcaseBusiness size={30}/></span><p className="mt-5 text-xs font-extrabold uppercase tracking-[.16em] text-blue-700">Novas oportunidades estão chegando</p><h3 className="mt-2 text-2xl font-black text-slate-950">Seu próximo passo começa com um perfil completo.</h3><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">Não encontramos vagas com esses filtros agora. Crie seu perfil gratuito e acompanhe as oportunidades que combinam com você.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/cadastro?tipo=candidate" className="btn btn-blue min-h-12 gap-2">Criar meu perfil gratuito <ArrowRight size={17}/></Link><Link href="/vagas" className="btn btn-outline min-h-12">Limpar filtros</Link></div></div></div>}
          <section className="mt-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-600 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-100">Primeiro emprego</p><h3 className="mt-1 text-xl font-extrabold">Seu primeiro emprego começa aqui!</h3><p className="mt-1 text-sm text-emerald-50">Encontre empresas que valorizam seu potencial.</p></div><Link href="/vagas?inicio=1" className="btn min-h-11 gap-2 bg-white px-5 text-sm font-bold text-emerald-800">Encontrar meu primeiro emprego <ArrowRight size={16}/></Link></section>
        </div>
      </div>
      <p className="container-page mt-10 text-center text-xs text-slate-400">{recommendedIds.size > 0 ? "As recomendações usam os critérios atuais de compatibilidade do PombalEmprega." : "PombalEmprega · oportunidades reais da região."}</p>
    </section>
  </main>;
}
