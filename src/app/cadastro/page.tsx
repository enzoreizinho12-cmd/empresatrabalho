import Link from "next/link";
import { Building2, UsersRound } from "@/components/icons";
import { signUpCandidate, signUpCompany } from "@/app/actions";
import { Feedback } from "@/components/feedback";
import { SubmitButton } from "@/components/submit-button";

type Search = { erro?: string; tipo?: string; next?: string };

function Field({ id, label, type = "text", required = true, autoComplete, placeholder, inputMode }: { id: string; label: string; type?: string; required?: boolean; autoComplete?: string; placeholder?: string; inputMode?: "numeric" | "tel" }) {
  return <div><label htmlFor={id} className="label">{label}{required ? " *" : ""}</label><input id={id} name={id} type={type} required={required} autoComplete={autoComplete} placeholder={placeholder} inputMode={inputMode} className="field" /></div>;
}

function Terms() {
  return <label className="flex items-start gap-3 text-sm leading-6 text-slate-600"><input type="checkbox" name="terms" required className="mt-1 size-4 shrink-0 accent-blue-700"/><span>Li e aceito os <Link href="/termos" className="font-semibold text-blue-700 underline">Termos de uso</Link> e a <Link href="/privacidade" className="font-semibold text-blue-700 underline">Política de privacidade</Link>.</span></label>;
}

function AccountChoice() {
  return <section className="grid gap-5 sm:grid-cols-2" aria-label="Escolha o tipo de conta">
    <article className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 text-center">
      <UsersRound className="mx-auto mb-3 text-blue-700" size={34}/><h2 className="text-xl font-extrabold text-slate-900">Sou candidato</h2>
      <p className="my-2 text-sm text-slate-600">Quero encontrar oportunidades de emprego.</p>
      <Link className="btn btn-blue mt-3 w-full justify-center" href="/cadastro?tipo=candidate">Criar conta de candidato <span aria-hidden="true">→</span></Link>
    </article>
    <article className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
      <Building2 className="mx-auto mb-3 text-emerald-700" size={34}/><h2 className="text-xl font-extrabold text-slate-900">Sou empresa</h2>
      <p className="my-2 text-sm text-slate-600">Quero anunciar vagas e contratar profissionais.</p>
      <Link className="btn btn-green mt-3 w-full justify-center" href="/cadastro?tipo=company">Cadastrar minha empresa <span aria-hidden="true">→</span></Link>
    </article>
  </section>;
}

export default async function Register({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const role = params.tipo === "candidate" || params.tipo === "company" ? params.tipo : null;
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const isCompany = role === "company";
  return <main className="container-page max-w-3xl py-10 sm:py-16">
    <div className="card p-5 sm:p-9">
      <div className="mx-auto mb-7 max-w-xl text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-blue-700">Pombal Emprega · cadastro gratuito</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{role ? (isCompany ? "Cadastre sua empresa" : "Crie sua conta de candidato") : "Escolha o tipo de conta"}</h1>
        <p className="mt-2 text-slate-600">{role ? (isCompany ? "Encontre profissionais da região e prepare seu painel empresarial." : "Crie seu perfil e acompanhe oportunidades da sua região.") : "Escolha como deseja usar a plataforma para continuar."}</p>
      </div>
      <Feedback erro={params.erro}/>
      {!configured && <p className="notice mb-5" role="status">O ambiente Supabase de desenvolvimento ainda não foi configurado.</p>}
      {!role ? <AccountChoice/> : <>
        <form action={isCompany ? signUpCompany : signUpCandidate} className="grid gap-4 sm:grid-cols-2">
          {params.next && <input type="hidden" name="next" value={params.next}/>}
          {isCompany ? <>
            <div className="sm:col-span-2"><Field id="company_name" label="Nome da empresa" autoComplete="organization"/></div>
            <Field id="responsible_name" label="Nome do responsável" autoComplete="name"/>
            <Field id="cnpj" label="CNPJ (quando aplicável)" required={false} inputMode="numeric" placeholder="00.000.000/0000-00"/>
            <Field id="email" label="E-mail" type="email" autoComplete="email"/>
            <Field id="phone" label="WhatsApp" type="tel" autoComplete="tel" placeholder="(75) 9 9999-9999"/>
            <Field id="city" label="Cidade" autoComplete="address-level2"/>
            <Field id="neighborhood" label="Bairro" autoComplete="address-level3"/>
            <div className="sm:col-span-2"><label htmlFor="industry" className="label">Segmento da empresa *</label><select id="industry" name="industry" required defaultValue="" className="field"><option value="" disabled>Selecione o segmento</option><option>Restaurantes e alimentação</option><option>Comércio e vendas</option><option>Construção civil</option><option>Saúde e estética</option><option>Educação</option><option>Transporte e logística</option><option>Administrativo</option><option>Serviços gerais</option><option>Outro</option></select></div>
          </> : <>
            <div className="sm:col-span-2"><Field id="full_name" label="Nome completo" autoComplete="name"/></div>
            <Field id="email" label="E-mail" type="email" autoComplete="email"/>
            <Field id="phone" label="WhatsApp" type="tel" autoComplete="tel" placeholder="(75) 9 9999-9999"/>
            <Field id="city" label="Cidade" autoComplete="address-level2"/>
            <Field id="neighborhood" label="Bairro" autoComplete="address-level3"/>
          </>}
          <Field id="password" label="Senha (mínimo 8 caracteres)" type="password" autoComplete="new-password"/>
          <Field id="confirm_password" label="Confirmar senha" type="password" autoComplete="new-password"/>
          <div className="sm:col-span-2"><Terms/></div>
          <SubmitButton disabled={!configured} className={`btn ${isCompany ? "btn-green" : "btn-blue"} min-h-12 w-full justify-center text-base font-bold sm:col-span-2`} pendingLabel="Enviando cadastro…">{isCompany ? "CADASTRAR MINHA EMPRESA" : "CRIAR MINHA CONTA GRATUITA"}</SubmitButton>
        </form>
        <p className="mt-5 text-sm text-slate-600">Já tem uma conta? <Link href={params.next ? `/entrar?next=${encodeURIComponent(params.next)}` : "/entrar"} className="font-bold text-blue-700">Entrar</Link><span className="mx-2">·</span><Link href="/cadastro" className="font-semibold text-blue-700">Trocar tipo de conta</Link></p>
      </>}
      {!role && <p className="mt-7 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">Já tem cadastro? <Link href="/entrar" className="font-bold text-blue-700">Entrar</Link></p>}
    </div>
  </main>;
}
