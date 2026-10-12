import { requireRole } from "@/lib/auth";
import { saveCompany } from "@/app/actions";
import { DashboardNav } from "@/components/dashboard-nav";
import { Feedback } from "@/components/feedback";
export default async function CompanyProfile({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { supabase, user } = await requireRole("company");
  const { data: company } = await supabase.from("companies").select("*").eq("owner_id", user.id).maybeSingle();
  const privateProfile = user.user_metadata?.company_profile ?? {};
  const params = await searchParams;
  return <main className="container-page py-10 mobile-bottom"><div className="grid sm:grid-cols-[220px_1fr] gap-7"><DashboardNav role="company"/><div><h1 className="text-3xl font-black mb-2">Perfil da empresa</h1><p className="mb-6 text-slate-600">Os dados de contato e identificação ficam privados na conta empresarial.</p><Feedback erro={params.erro}/><form action={saveCompany} className="card grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
    <div className="sm:col-span-2"><label htmlFor="name" className="label">Nome da empresa *</label><input id="name" name="name" required minLength={2} defaultValue={company?.name ?? privateProfile.company_name ?? ""} className="field"/></div>
    <div><label htmlFor="responsible_name" className="label">Nome do responsável *</label><input id="responsible_name" name="responsible_name" required minLength={2} defaultValue={privateProfile.responsible_name ?? ""} autoComplete="name" className="field"/></div>
    <div><label htmlFor="cnpj" className="label">CNPJ (quando aplicável)</label><input id="cnpj" name="cnpj" inputMode="numeric" defaultValue={privateProfile.cnpj ?? ""} placeholder="00.000.000/0000-00" className="field"/></div>
    <div><label htmlFor="phone" className="label">WhatsApp *</label><input id="phone" name="phone" type="tel" required defaultValue={privateProfile.phone ?? ""} autoComplete="tel" className="field"/></div>
    <div><label htmlFor="city" className="label">Cidade *</label><input id="city" name="city" required defaultValue={company?.city ?? privateProfile.city ?? "Ribeira do Pombal"} autoComplete="address-level2" className="field"/></div>
    <div><label htmlFor="neighborhood" className="label">Bairro *</label><input id="neighborhood" name="neighborhood" required defaultValue={privateProfile.neighborhood ?? ""} autoComplete="address-level3" className="field"/></div>
    <div><label htmlFor="industry" className="label">Segmento da empresa *</label><select id="industry" name="industry" required defaultValue={privateProfile.industry ?? ""} className="field"><option value="" disabled>Selecione o segmento</option><option>Restaurantes e alimentação</option><option>Comércio e vendas</option><option>Construção civil</option><option>Saúde e estética</option><option>Educação</option><option>Transporte e logística</option><option>Administrativo</option><option>Serviços gerais</option><option>Outro</option></select></div>
    <div className="sm:col-span-2"><label htmlFor="description" className="label">Sobre a empresa</label><textarea id="description" name="description" rows={4} defaultValue={company?.description ?? ""} className="field"/></div>
    <button className="btn btn-green sm:col-span-2">Salvar empresa</button>
  </form></div></div></main>;
}
