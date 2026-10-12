import { redirect } from "next/navigation";
import { publishJob } from "@/app/actions";
import { requireRole } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";
import { Feedback } from "@/components/feedback";
export default async function NewJob({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { supabase, user } = await requireRole("company");
  const { data: company } = await supabase.from("companies").select("city,status").eq("owner_id", user.id).maybeSingle();
  if (!company || company.status !== "approved") redirect("/empresa");
  const params = await searchParams;
  return <main className="container-page py-10 mobile-bottom"><div className="grid sm:grid-cols-[220px_1fr] gap-7"><DashboardNav role="company"/><div><p className="text-emerald-700 font-bold">Nova oportunidade</p><h1 className="text-3xl font-black mb-6">Publicar vaga</h1><Feedback erro={params.erro}/><form action={publishJob} className="card p-6 sm:p-8 grid md:grid-cols-2 gap-5">
    <div><label htmlFor="title" className="label">Cargo *</label><input id="title" name="title" required className="field" placeholder="Ex.: Garçom"/></div>
    <div><label htmlFor="openings" className="label">Quantidade de vagas *</label><input id="openings" name="openings" type="number" min={1} defaultValue={1} required className="field"/></div>
    <div className="md:col-span-2"><label htmlFor="description" className="label">Descrição detalhada *</label><textarea id="description" name="description" minLength={20} required rows={6} className="field"/></div>
    <div><label htmlFor="contract_type" className="label">Tipo de contratação *</label><select id="contract_type" name="contract_type" className="field">{["CLT","Temporário","Freelancer","Diária","Estágio","Jovem Aprendiz","Primeiro emprego"].map(t => <option key={t}>{t}</option>)}</select></div>
    <div><label htmlFor="work_mode" className="label">Modalidade *</label><select id="work_mode" name="work_mode" className="field"><option value="presencial">Presencial</option><option value="híbrido">Híbrido</option><option value="remoto">Remoto</option></select></div>
    <div><label htmlFor="salary_min" className="label">Salário mínimo (opcional)</label><input id="salary_min" name="salary_min" type="number" min={0} step="0.01" className="field"/></div>
    <div><label htmlFor="salary_max" className="label">Salário máximo (opcional)</label><input id="salary_max" name="salary_max" type="number" min={0} step="0.01" className="field"/></div>
    <div><label htmlFor="min_experience_months" className="label">Experiência mínima em meses</label><input id="min_experience_months" name="min_experience_months" type="number" min={0} defaultValue={0} className="field"/></div>
    <div><label htmlFor="min_education_level" className="label">Escolaridade mínima</label><select id="min_education_level" name="min_education_level" className="field"><option value="0">Não exigir</option><option value="1">Fundamental</option><option value="2">Médio</option><option value="3">Técnico</option><option value="4">Superior</option><option value="5">Pós-graduação</option></select></div>
    <div><label htmlFor="required_skills" className="label">Habilidades obrigatórias (vírgulas)</label><input id="required_skills" name="required_skills" className="field"/></div>
    <div><label htmlFor="preferred_skills" className="label">Habilidades desejáveis (vírgulas)</label><input id="preferred_skills" name="preferred_skills" className="field"/></div>
    <div><label htmlFor="city" className="label">Cidade *</label><input id="city" name="city" required defaultValue={company.city} className="field"/></div>
    <div><label htmlFor="availability" className="label">Disponibilidade necessária</label><input id="availability" name="availability" className="field" placeholder="Ex.: noturno, fim de semana"/></div>
    <div><label htmlFor="benefits" className="label">Benefícios (vírgulas)</label><input id="benefits" name="benefits" className="field"/></div>
    <div><label htmlFor="deadline" className="label">Prazo para candidatura</label><input id="deadline" name="deadline" type="date" className="field"/></div>
    <label className="md:col-span-2 flex gap-3"><input type="checkbox" name="first_job_friendly"/>Aceita candidatos em busca do primeiro emprego</label>
    <button className="btn btn-green md:col-span-2">Publicar vaga</button>
  </form></div></div></main>;
}
