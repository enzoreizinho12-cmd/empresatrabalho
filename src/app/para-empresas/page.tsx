import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Bell, BriefcaseBusiness, Building2, ChartColumn, Check,
  FileText, MapPin, Search, ShieldCheck, Sparkles, Target, UsersRound,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Para empresas | Pombal Emprega",
  description: "Publique oportunidades, encontre talentos da região e organize suas contratações com o Pombal Emprega.",
};

const benefits = [
  { icon: BriefcaseBusiness, title: "Publique suas vagas", text: "Apresente os requisitos e as condições da oportunidade em um anúncio claro e organizado.", color: "blue" },
  { icon: Search, title: "Busque profissionais", text: "Encontre perfis que autorizaram aparecer no diretório de talentos.", color: "green" },
  { icon: Target, title: "Compare compatibilidades", text: "Veja como os dados profissionais correspondem aos requisitos de cada vaga.", color: "blue" },
  { icon: FileText, title: "Consulte currículos digitais", text: "Acesse informações profissionais relevantes com respeito ao consentimento.", color: "green" },
  { icon: UsersRound, title: "Organize candidaturas", text: "Reúna as candidaturas relacionadas às vagas da sua empresa.", color: "blue" },
  { icon: ChartColumn, title: "Acompanhe cada etapa", text: "Atualize o andamento do processo seletivo pelo painel empresarial.", color: "green" },
];

const steps = [
  { icon: Building2, number: "01", title: "Cadastre sua empresa", text: "Informe os dados da empresa e conclua o perfil empresarial." },
  { icon: BriefcaseBusiness, number: "02", title: "Publique uma oportunidade", text: "Descreva o cargo, os requisitos e as condições da vaga." },
  { icon: Target, number: "03", title: "Encontre perfis compatíveis", text: "Consulte candidaturas e talentos que permitiram ser encontrados." },
  { icon: UsersRound, number: "04", title: "Conduza a seleção", text: "Organize as etapas e acompanhe o processo no seu painel." },
];

const questions = [
  ["Como cadastrar minha empresa?", "Clique em Cadastrar minha empresa, escolha a conta empresarial e preencha os dados solicitados. Depois, acompanhe a análise do cadastro pela plataforma."],
  ["Como publicar uma vaga?", "Após entrar com sua conta e a aprovação do perfil empresarial, acesse Publicar vaga no painel e informe cargo, descrição, requisitos e condições."],
  ["Como encontrar profissionais?", "Você pode acompanhar as candidaturas das suas vagas e consultar o banco de talentos. A busca de talentos respeita a autorização de visibilidade definida pelo candidato."],
  ["Como visualizar candidaturas?", "No painel empresarial, abra Candidaturas para consultar os perfis compartilhados para as vagas da sua empresa e atualizar as etapas do processo."],
  ["Como funciona a compatibilidade inteligente?", "O sistema compara informações profissionais do currículo com os requisitos da vaga. A pontuação é uma orientação, não impede candidaturas nem substitui a avaliação da empresa."],
] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-700">{children}</p>;
}

export default function ForCompanies() {
  return <main className="overflow-hidden bg-white text-slate-900">
    <section className="relative isolate min-h-[570px] overflow-hidden bg-[#082d79] text-white sm:min-h-[630px]">
      <Image src="/images/profissionais-brasileiros.png" alt="Profissionais brasileiros conversam em um ambiente de trabalho moderno" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="-z-20 object-cover object-[62%_center] lg:left-auto lg:w-1/2" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#062667]/80 via-[#073c9a]/50 to-[#053d70]/10 lg:from-[#062667] lg:via-[#073c9a]/70 lg:to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#062452]/60 via-transparent to-blue-950/10" />
      <div className="container-page relative flex min-h-[570px] items-center py-14 sm:min-h-[630px] sm:py-20">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em] backdrop-blur"><Building2 size={16}/> Soluções para sua empresa</p>
          <h1 className="text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">Encontre o profissional ideal para sua empresa!</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-blue-50 sm:text-lg">Publique oportunidades, encontre talentos e simplifique seu processo de contratação com a inteligência do PombalEmprega.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/cadastro?tipo=company" className="btn btn-green min-h-12 gap-2 px-6 shadow-lg shadow-emerald-950/20">Cadastrar minha empresa <ArrowRight size={18}/></Link>
            <Link href="#vantagens" className="btn min-h-12 gap-2 border border-white/50 bg-white/10 px-6 text-white backdrop-blur transition hover:bg-white/20">Conhecer as vantagens <ArrowRight size={17}/></Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-blue-50"><span className="inline-flex items-center gap-2"><Check size={16} className="text-emerald-300"/> Talentos da região</span><span className="inline-flex items-center gap-2"><Check size={16} className="text-emerald-300"/> Processo organizado</span><span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-300"/> Privacidade respeitada</span></div>
        </div>
        <div className="absolute bottom-5 right-6 hidden rounded-2xl border border-white/20 bg-white/95 p-4 text-slate-900 shadow-xl backdrop-blur md:block lg:right-12">
          <p className="flex items-center gap-2 text-xs font-bold text-emerald-800"><Sparkles size={15}/> Talentos e oportunidades em um só lugar</p>
          <p className="mt-1 text-xs text-slate-500">Prévia ilustrativa da plataforma</p>
        </div>
      </div>
    </section>

    <section id="vantagens" className="scroll-mt-20 bg-slate-50 py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center"><SectionLabel>Mais clareza em cada contratação</SectionLabel><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Tudo para aproximar sua empresa dos talentos certos</h2><p className="mt-4 leading-7 text-slate-600">Da publicação da vaga ao acompanhamento do processo seletivo, reúna as etapas em uma experiência simples.</p></div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{benefits.map(({ icon: Icon, title, text, color }) => <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"><span className={`grid size-12 place-items-center rounded-2xl ${color === "blue" ? "bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white" : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white"} transition-colors`}><Icon size={23}/></span><h3 className="mt-5 text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}</div>
      </div>
    </section>

    <section className="py-16 sm:py-20">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
        <div><SectionLabel>Inteligência de contratação</SectionLabel><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Enxergue a conexão entre requisitos e perfis</h2><p className="mt-4 leading-7 text-slate-600">A compatibilidade compara as informações profissionais do currículo com os critérios definidos na vaga. A pontuação explica aproximações e pontos a desenvolver; a decisão continua com a empresa.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">{["Experiência", "Habilidades", "Disponibilidade", "Requisitos da vaga", "Cidade ou modalidade remota"].map((item) => <li key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700"><span className="grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-800"><Check size={14}/></span>{item}</li>)}</ul>
          <p className="mt-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-blue-700"/><span>A busca de talentos considera somente perfis com visibilidade autorizada. Ao se candidatar, a pessoa compartilha os dados profissionais necessários para participar daquela seleção.</span></p>
        </div>
        <div className="relative rounded-[2rem] bg-gradient-to-br from-blue-800 via-blue-700 to-emerald-700 p-4 shadow-2xl shadow-blue-900/15 sm:p-7">
          <div className="absolute -right-6 -top-6 hidden size-28 rounded-full bg-emerald-300/30 blur-2xl sm:block"/>
          <div className="relative rounded-3xl bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5"><div><p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-blue-700">Demonstração · vaga</p><h3 className="mt-1 text-2xl font-black">Garçom</h3><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin size={14}/> Ribeira do Pombal · BA</p></div><span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-800">Exemplo ilustrativo</span></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[{ name: "João", role: "Candidato · demonstração", score: 94, color: "blue" }, { name: "Maria", role: "Candidata · demonstração", score: 87, color: "green" }].map((person) => <article key={person.name} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center gap-3"><span className={`grid size-11 place-items-center rounded-full ${person.color === "blue" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}><UsersRound size={20}/></span><div><h4 className="font-extrabold">{person.name}</h4><p className="text-xs text-slate-500">{person.role}</p></div></div><div className="mt-4 flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Compatibilidade demonstrativa</span><strong className="text-xl font-black text-emerald-700">{person.score}%</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><span className={`block h-full rounded-full ${person.color === "blue" ? "bg-blue-600" : "bg-emerald-600"}`} style={{ width: `${person.score}%` }}/></div></article>)}
            </div>
            <p className="mt-4 text-center text-[11px] font-semibold text-slate-400">Nomes e pontuações fictícios, exibidos somente para demonstrar a interface.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#f2f7ff] py-16 sm:py-20">
      <div className="container-page"><div className="mx-auto max-w-2xl text-center"><SectionLabel>Como contratar</SectionLabel><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Quatro etapas para começar</h2><p className="mt-3 text-slate-600">A plataforma organiza a jornada para sua empresa avançar com mais clareza.</p></div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map(({ icon: Icon, number, title, text }, index) => <article key={number} className="relative rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className={`grid size-11 place-items-center rounded-xl ${index % 2 ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}><Icon size={22}/></span><span className="text-3xl font-black text-slate-100">{number}</span></div><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>{index < steps.length - 1 && <ArrowRight size={18} className="absolute -right-3 top-9 z-10 hidden text-blue-500 lg:block"/>}</article>)}</div>
      </div>
    </section>

    <section className="py-16 sm:py-20">
      <div className="container-page grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-slate-900 sm:min-h-[470px]"><Image src="/images/recrutadora-brasileira.png" alt="Profissional brasileira usando um tablet no trabalho" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-6 pt-24 text-white sm:p-8 sm:pt-28"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-300">Seu espaço de trabalho</p><h3 className="mt-2 text-2xl font-black">Seleção organizada, decisão mais clara.</h3><p className="mt-2 text-sm text-slate-200">Prévia ilustrativa do painel empresarial</p></div></div>
        <div><SectionLabel>Painel empresarial</SectionLabel><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Acompanhe sua operação em um só lugar</h2><p className="mt-4 leading-7 text-slate-600">O painel existente reúne as ferramentas para administrar vagas e processos da sua empresa.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{[{ icon: BriefcaseBusiness, title: "Gerenciar vagas", href: "/empresa/nova-vaga" }, { icon: UsersRound, title: "Consultar candidaturas", href: "/empresa/candidaturas" }, { icon: Search, title: "Encontrar talentos", href: "/empresa/talentos" }, { icon: ChartColumn, title: "Acompanhar processos", href: "/empresa/candidaturas" }, { icon: Bell, title: "Receber notificações", href: "/empresa" }].map(({ icon: Icon, title, href }) => <Link key={title} href={href} className="flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50"><Icon size={19} className="text-emerald-700"/>{title}<ArrowRight size={15} className="ml-auto text-slate-400"/></Link>)}</div>
          <Link href="/painel" className="btn btn-outline mt-6 min-h-12 gap-2">Já tenho conta empresarial · Acessar painel <ArrowRight size={17}/></Link>
        </div>
      </div>
    </section>

    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="container-page max-w-4xl"><div className="text-center"><SectionLabel>Perguntas frequentes</SectionLabel><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Tire suas dúvidas</h2></div><div className="mt-8 grid gap-3">{questions.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-slate-900 [&::-webkit-details-marker]:hidden">{question}<span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700 transition group-open:rotate-45"><span aria-hidden="true">+</span></span></summary><p className="mt-4 max-w-3xl border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">{answer}</p></details>)}</div></div>
    </section>

    <section className="bg-gradient-to-r from-[#082d79] via-[#0755c8] to-emerald-700 py-14 text-white sm:py-16"><div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-emerald-200">Pombal Emprega · GOSYXP</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Sua próxima contratação começa aqui!</h2><p className="mt-3 max-w-2xl text-blue-50">Conecte sua empresa aos talentos de Ribeira do Pombal e região.</p></div><Link href="/cadastro?tipo=company" className="btn min-h-12 shrink-0 gap-2 bg-emerald-500 px-6 text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-400">Cadastrar minha empresa <ArrowRight size={18}/></Link></div></section>
  </main>;
}
