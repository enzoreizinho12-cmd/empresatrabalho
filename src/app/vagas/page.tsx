import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isJobArea, jobAreas } from "@/lib/job-areas";

type JobSummary = {
  id: string;
  title: string;
  city: string;
  contract_type: string;
  work_mode: string;
  salary_min: number | null;
  companies: { name: string } | null;
};

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; cidade?: string; area?: string; inicio?: string }>;
}) {
  const params = await searchParams;
  const area = isJobArea(params.area) ? params.area : null;
  const firstJob = params.inicio === "1";
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  let jobs: JobSummary[] = [];
  let loadError = false;

  if (configured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from("jobs")
        .select("id,title,city,contract_type,work_mode,salary_min,companies(name)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(50);

      if (params.busca) query = query.ilike("title", `%${params.busca.slice(0, 80)}%`);
      if (params.cidade) query = query.ilike("city", `%${params.cidade.slice(0, 80)}%`);
      if (area) {
        query = query.or(
          jobAreas[area].terms
            .flatMap((term) => [`title.ilike.%${term}%`, `description.ilike.%${term}%`])
            .join(","),
        );
      }
      if (firstJob) query = query.eq("first_job_friendly", true);

      const result = await query;
      loadError = Boolean(result.error);
      jobs = (result.data ?? []) as unknown as JobSummary[];
    } catch {
      loadError = true;
    }
  }

  return (
    <main className="container-page py-12">
      <p className="font-bold text-blue-700">Oportunidades reais</p>
      <h1 className="mt-1 text-4xl font-black">Encontre sua próxima vaga</h1>
      {area && (
        <p className="mt-2 text-slate-600">
          Área: {jobAreas[area].label} · <Link href="/vagas" className="font-bold text-blue-700">Limpar filtro</Link>
        </p>
      )}
      {firstJob && (
        <p className="mt-2 text-slate-600">
          Vagas abertas ao primeiro emprego · <Link href="/vagas" className="font-bold text-blue-700">Limpar filtro</Link>
        </p>
      )}
      <form method="get" className="card mt-7 grid gap-3 p-5 sm:grid-cols-[1fr_1fr_auto]">
        {area && <input type="hidden" name="area" value={area} />}
        {firstJob && <input type="hidden" name="inicio" value="1" />}
        <input name="busca" aria-label="Cargo" placeholder="Cargo ou profissão" defaultValue={params.busca} className="field" />
        <input name="cidade" aria-label="Cidade" placeholder="Cidade" defaultValue={params.cidade} className="field" />
        <button className="btn btn-blue">Buscar</button>
      </form>

      {!configured ? (
        <p className="notice mt-6">As vagas aparecerão quando o ambiente Supabase de desenvolvimento estiver configurado.</p>
      ) : loadError ? (
        <p className="error mt-6">Não foi possível carregar as vagas.</p>
      ) : jobs.length ? (
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <Link key={job.id} href={`/vagas/${job.id}`} className="card p-6 hover:border-blue-300">
              <h2 className="text-xl font-bold">{job.title}</h2>
              <p className="mt-1 text-slate-600">{job.companies?.name} • {job.city}</p>
              <p className="mt-3 text-sm text-slate-500">
                {job.contract_type} • {job.work_mode}
                {job.salary_min ? ` • A partir de R$ ${Number(job.salary_min).toLocaleString("pt-BR")}` : ""}
              </p>
              <span className="mt-5 inline-block font-bold text-blue-700">Ver detalhes →</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card mt-7 p-7">
          <h2 className="text-xl font-bold">Nenhuma vaga encontrada por enquanto</h2>
          <p className="mt-2 text-slate-600">Crie seu perfil e acompanhe as próximas oportunidades da região.</p>
          <Link href="/cadastro?tipo=candidate" className="btn btn-blue mt-5 inline-flex">Criar meu perfil</Link>
        </div>
      )}
    </main>
  );
}
