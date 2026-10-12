import { requireRole } from "@/lib/auth";
import { saveCandidate } from "@/app/actions";
import { DashboardNav } from "@/components/dashboard-nav";
import { Feedback } from "@/components/feedback";
import { calculateProfileCompletion } from "@/lib/profile-completion";

const text = (items?: string[] | null) => (items ?? []).join(", ");
export default async function CandidateProfile({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { supabase, user } = await requireRole("candidate");
  const { data: p } = await supabase.from("candidate_profiles").select("*").eq("user_id", user.id).maybeSingle();
  const params = await searchParams;
  const completion = p ? calculateProfileCompletion(p) : null;
  return <main className="container-page py-8 sm:py-12 mobile-bottom"><div className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-5 lg:gap-7"><DashboardNav role="candidate"/><div><h1 className="text-3xl font-black mb-2">Meu currículo</h1><p className="text-slate-600 mb-6">Atualize suas informações. Seu telefone não aparece no banco de talentos.</p>{completion && <div className="card p-4 mb-5"><div className="flex justify-between gap-3"><strong>Currículo {completion.percentage}% completo</strong><span className="text-sm text-slate-500">{completion.completedSections} de {completion.totalSections} seções</span></div><div className="h-2 bg-slate-200 rounded-full mt-3"><div className="h-2 bg-emerald-500 rounded-full" style={{ width: completion.percentage + "%" }}/></div>{completion.nextSteps[0] && <p className="text-sm text-slate-600 mt-3">Sugestão: {completion.nextSteps[0]}</p>}</div>}<Feedback erro={params.erro}/><form action={saveCandidate} className="card p-6 sm:p-8 grid md:grid-cols-2 gap-5">
    <h2 className="font-bold text-xl md:col-span-2">Dados pessoais</h2>
    <div><label htmlFor="full_name" className="label">Nome completo *</label><input id="full_name" name="full_name" required minLength={2} defaultValue={p?.full_name} className="field"/></div>
    <div><label htmlFor="phone" className="label">WhatsApp (privado)</label><input id="phone" name="phone" type="tel" defaultValue={p?.phone ?? ""} className="field"/></div>
    <div><label htmlFor="city" className="label">Cidade *</label><input id="city" name="city" required defaultValue={p?.city ?? "Ribeira do Pombal"} className="field"/></div>
    <div><label htmlFor="neighborhood" className="label">Bairro</label><input id="neighborhood" name="neighborhood" defaultValue={p?.neighborhood ?? ""} className="field"/></div>
    <h2 className="font-bold text-xl md:col-span-2 pt-4">Perfil profissional</h2>
    <div><label htmlFor="desired_title" className="label">Profissão desejada</label><input id="desired_title" name="desired_title" defaultValue={p?.desired_title ?? ""} className="field" placeholder="Ex.: Garçom"/></div>
    <div><label htmlFor="areas" className="label">Áreas de interesse (separe por vírgula)</label><input id="areas" name="areas" defaultValue={text(p?.areas)} className="field"/></div>
    <div className="md:col-span-2"><label htmlFor="experience_summary" className="label">Experiência anterior</label><textarea id="experience_summary" name="experience_summary" defaultValue={p?.experience_summary ?? ""} rows={4} className="field" placeholder="Descreva suas atividades reais"/></div>
    <div><label htmlFor="experience_months" className="label">Meses de experiência</label><input id="experience_months" name="experience_months" type="number" min={0} defaultValue={p?.experience_months ?? 0} className="field"/></div>
    <div><label htmlFor="education_level" className="label">Escolaridade</label><select id="education_level" name="education_level" defaultValue={p?.education_level ?? 0} className="field"><option value="0">Não informado</option><option value="1">Fundamental</option><option value="2">Médio</option><option value="3">Técnico</option><option value="4">Superior</option><option value="5">Pós-graduação</option></select></div>
    <div><label htmlFor="skills" className="label">Habilidades (separe por vírgula)</label><input id="skills" name="skills" defaultValue={text(p?.skills)} className="field"/></div>
    <div><label htmlFor="courses" className="label">Cursos</label><input id="courses" name="courses" defaultValue={text(p?.courses)} className="field"/></div>
    <div><label htmlFor="certifications" className="label">Certificações</label><input id="certifications" name="certifications" defaultValue={text(p?.certifications)} className="field"/></div>
    <div><label htmlFor="availability" className="label">Disponibilidade (ex.: diurno, noturno)</label><input id="availability" name="availability" defaultValue={text(p?.availability)} className="field"/></div>
    <fieldset className="md:col-span-2"><legend className="label">Modalidades desejadas</legend><div className="flex flex-wrap gap-4">{["presencial","híbrido","remoto"].map(mode => <label key={mode} className="flex gap-2"><input type="checkbox" name="work_modes" value={mode} defaultChecked={p?.work_modes?.includes(mode)}/>{mode}</label>)}</div></fieldset>
    <label className="flex gap-3 md:col-span-2"><input type="checkbox" name="first_job" defaultChecked={p?.first_job}/><span>Estou procurando meu primeiro emprego</span></label>
    <label className="flex gap-3 md:col-span-2"><input type="checkbox" name="visible_in_directory" defaultChecked={p?.visible_in_directory}/><span>Permitir que empresas aprovadas encontrem meu perfil profissional</span></label>
    <button className="btn btn-blue md:col-span-2">Salvar currículo</button>
  </form></div></div></main>;
}
