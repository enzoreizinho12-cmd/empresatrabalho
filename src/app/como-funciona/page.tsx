import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BriefcaseBusiness, Check, FileText, MapPin,
  ShieldCheck, Sparkles, Target, UsersRound,
} from "@/components/icons";
import { HowItWorksTabs } from "./how-it-works-tabs";

export const metadata: Metadata = {
  title: "Como funciona | Pombal Emprega",
  description: "Veja como candidatos e empresas usam o Pombal Emprega para se conectar e acompanhar oportunidades e seleções.",
};

const flow = [
  { icon: FileText, title: "Currículo do candidato", copy: "Experiência, habilidades e preferências profissionais." },
  { icon: Target, title: "Análise de compatibilidade", copy: "Comparação com os critérios informados na vaga." },
  { icon: Sparkles, title: "Oportunidades recomendadas", copy: "Vagas que podem combinar com o perfil profissional." },
  { icon: BriefcaseBusiness, title: "Candidatura", copy: "O profissional decide se quer participar da seleção." },
  { icon: UsersRound, title: "Processo seletivo", copy: "A empresa acompanha as candidaturas e suas etapas." },
];

export default function HowItWorks() {
  return <main className="overflow-hidden bg-white text-slate-900">
    <section className="bg-gradient-to-br from-[#082d79] via-[#0755c8] to-[#087b5b] text-white">
      <div className="container-page grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1.02fr_.98fr] lg:gap-10 lg:py-20">
        <div className="relative z-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em]"><Sparkles size={16}/> Pombal Emprega · GOSYXP</p>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.65rem]">Conectar talentos e oportunidades nunca foi tão simples!</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-blue-50 sm:text-lg">Conheça a tecnologia que aproxima quem procura emprego de quem precisa contratar.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="#passo-a-passo" className="btn min-h-12 gap-2 bg-white px-6 text-blue-800 shadow-lg transition hover:bg-blue-50">Ver como funciona <ArrowRight size={17}/></Link><Link href="/vagas" className="btn min-h-12 gap-2 border border-white/40 bg-white/10 px-6 text-white transition hover:bg-white/20">Explorar vagas <BriefcaseBusiness size={17}/></Link></div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-blue-50"><span className="inline-flex items-center gap-2"><Check size={15} className="text-emerald-300"/> Para candidatos</span><span className="inline-flex items-center gap-2"><Check size={15} className="text-emerald-300"/> Para empresas</span><span className="inline-flex items-center gap-2"><Check size={15} className="text-emerald-300"/> Da região para a região</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-xl pb-7 sm:pb-8">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-emerald-300/20 blur-2xl"/>
          <div className="relative h-[300px] overflow-hidden rounded-[2rem] border border-white/25 bg-blue-950/30 shadow-2xl sm:h-[390px] lg:h-[430px]"><Image src="/images/profissionais-brasileiros.png" alt="Profissionais brasileiros conectados pelo trabalho" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[58%_center]"/><div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-950/10 to-transparent"/><p className="absolute bottom-5 left-5 text-xs font-bold uppercase tracking-[.15em] text-white/90">Pessoas e oportunidades conectadas</p></div>
          <div className="absolute -bottom-1 left-2 flex items-center gap-3 rounded-2xl border border-blue-100 bg-white p-3 text-slate-900 shadow-xl sm:-left-6 sm:p-4"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><FileText size={20}/></span><span><strong className="block text-sm">Perfil profissional</strong><small className="text-xs text-slate-500">Informações relevantes</small></span><ArrowRight size={16} className="text-blue-700"/><span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Target size={20}/></span></div>
          <div className="absolute right-2 top-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-white/95 px-3 py-2 text-xs font-bold text-emerald-800 shadow-lg sm:right-[-14px] sm:top-8"><Sparkles size={15}/> Compatibilidade explicada</div>
        </div>
      </div>
    </section>

    <HowItWorksTabs />

    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold uppercase tracking-[.17em] text-blue-700">Tecnologia que aproxima</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Como a compatibilidade conecta os perfis</h2><p className="mt-4 leading-7 text-slate-600">A plataforma cruza informações profissionais relevantes para ajudar a recomendar oportunidades. A compatibilidade orienta a busca, mas não garante uma contratação.</p></div>
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{flow.map(({ icon: Icon, title, copy }, index) => <li key={title} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"><div className="flex items-center justify-between"><span className={`grid size-12 place-items-center rounded-2xl ${index % 2 ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}><Icon size={23}/></span><span className="text-2xl font-black text-slate-200">0{index + 1}</span></div><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>{index < flow.length - 1 && <span aria-hidden="true" className="absolute -right-3 top-10 z-10 hidden size-6 place-items-center rounded-full border border-blue-100 bg-white text-blue-700 lg:grid">›</span>}</li>)}</ol>
        <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-5 text-slate-500">A análise considera dados informados no currículo e nos requisitos da vaga, como experiência, habilidades, disponibilidade e cidade ou modalidade de trabalho.</p>
      </div>
    </section>

    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="container-page grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
        <div><p className="text-xs font-extrabold uppercase tracking-[.17em] text-emerald-700">Exemplo ilustrativo</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Uma oportunidade, diferentes caminhos até a contratação</h2><p className="mt-4 leading-7 text-slate-600">Imagine que uma empresa procura um garçom com experiência. A plataforma pode identificar perfis com habilidades relacionadas e apresentar a oportunidade aos profissionais. Cada pessoa decide se deseja se candidatar; a empresa acompanha os inscritos pelo painel.</p><Link href="/vagas" className="btn btn-blue mt-6 min-h-12 gap-2">Ver oportunidades <ArrowRight size={17}/></Link></div>
        <div className="rounded-[2rem] bg-gradient-to-br from-blue-800 via-blue-700 to-emerald-700 p-4 shadow-xl sm:p-6">
          <div className="rounded-3xl bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5"><div><p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-blue-700">Vaga · demonstração</p><h3 className="mt-1 text-xl font-black">Garçom com experiência</h3><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13}/> Exemplo, Ribeira do Pombal</p></div><span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">Fluxo demonstrativo</span></div>
            <div className="grid gap-3 py-5 sm:grid-cols-3"><div className="rounded-xl bg-blue-50 p-4"><FileText size={19} className="text-blue-700"/><p className="mt-3 text-sm font-extrabold">Perfil profissional</p><p className="mt-1 text-xs text-slate-600">Experiência e habilidades</p></div><div className="rounded-xl bg-emerald-50 p-4"><Target size={19} className="text-emerald-700"/><p className="mt-3 text-sm font-extrabold">Compatibilidade</p><p className="mt-1 text-xs text-slate-600">Requisitos relacionados</p></div><div className="rounded-xl bg-blue-50 p-4"><BriefcaseBusiness size={19} className="text-blue-700"/><p className="mt-3 text-sm font-extrabold">Candidatura</p><p className="mt-1 text-xs text-slate-600">Decisão do profissional</p></div></div>
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-extrabold">Acompanhamento da empresa</p><p className="mt-1 text-xs text-slate-500">Os inscritos e as etapas ficam no painel empresarial.</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Prévia fictícia</span></div>
            <p className="mt-4 text-center text-[11px] text-slate-400">Esta ilustração descreve um fluxo possível e não representa vagas ou candidatos cadastrados.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-16 sm:py-20">
      <div className="container-page grid items-center gap-9 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] bg-blue-900 sm:min-h-[390px]"><Image src="/images/empresa-profissional.png" alt="Profissional brasileira usando um tablet no trabalho" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[center_30%]"/><div className="absolute inset-0 bg-gradient-to-t from-blue-950/75 via-transparent to-transparent"/><p className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur">Informação compartilhada com contexto e consentimento</p></div>
        <div><p className="text-xs font-extrabold uppercase tracking-[.17em] text-blue-700">Privacidade no processo</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Suas informações com mais segurança.</h2><p className="mt-4 leading-7 text-slate-600">O PombalEmprega oferece controles para que as informações profissionais sejam usadas nos fluxos da plataforma de forma responsável.</p><ul className="mt-6 grid gap-4">{[
          [ShieldCheck, "Controle das informações compartilhadas", "O perfil permite escolher se pode aparecer no diretório de talentos."],
          [Check, "Consentimento para visualizar currículos", "Empresas aprovadas consultam perfis que autorizaram a busca; a candidatura compartilha o perfil com a empresa da vaga."],
          [UsersRound, "Acesso às contas", "O acesso aos recursos depende da conta e do perfil de usuário autenticado."],
          [FileText, "Uso responsável das informações", "Os dados profissionais ajudam a apresentar oportunidades e conduzir candidaturas."],
        ].map(([Icon, title, text]) => {
          const ItemIcon = Icon as typeof ShieldCheck;
          return <li key={title as string} className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><ItemIcon size={19}/></span><span><strong className="block text-sm font-extrabold">{title as string}</strong><span className="mt-1 block text-sm leading-6 text-slate-600">{text as string}</span></span></li>;
        })}</ul><p className="mt-5 text-xs leading-5 text-slate-500">Nenhuma medida elimina todos os riscos. Consulte a <Link href="/privacidade" className="font-bold text-blue-700 underline">Política de privacidade</Link> para conhecer os detalhes.</p></div>
      </div>
    </section>

    <section className="bg-gradient-to-r from-[#082d79] via-[#0755c8] to-emerald-700 py-14 text-white sm:py-16"><div className="container-page text-center"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-emerald-200">Pombal Emprega · GOSYXP</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Pronto para começar?</h2><p className="mx-auto mt-3 max-w-2xl text-blue-50">Escolha como quer participar e dê o próximo passo.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/cadastro?tipo=candidate" className="btn min-h-12 gap-2 bg-white px-6 text-blue-800 shadow-lg transition hover:bg-blue-50">Encontrar emprego <ArrowRight size={17}/></Link><Link href="/cadastro?tipo=company" className="btn min-h-12 gap-2 bg-emerald-500 px-6 text-white shadow-lg transition hover:bg-emerald-400">Cadastrar empresa <ArrowRight size={17}/></Link></div></div></section>
  </main>;
}
