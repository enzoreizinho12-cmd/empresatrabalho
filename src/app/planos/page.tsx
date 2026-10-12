import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BriefcaseBusiness, Building2, Check, FileText, Search,
  ShieldCheck, Sparkles, Target, UsersRound,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Planos | Pombal Emprega",
  description: "Conheça o acesso gratuito para candidatos e acompanhe a preparação dos planos empresariais do Pombal Emprega.",
};

const candidateFeatures = [
  { icon: UsersRound, text: "Cadastro de candidato" },
  { icon: FileText, text: "Currículo digital" },
  { icon: Search, text: "Pesquisa de vagas" },
  { icon: BriefcaseBusiness, text: "Candidaturas e acompanhamento" },
  { icon: Target, text: "Recomendações compatíveis" },
  { icon: ShieldCheck, text: "Notificações sobre suas inscrições" },
];

const businessPlans = [
  { name: "Start", description: "Para empresas que desejam começar a divulgar oportunidades.", icon: Building2, tone: "blue" },
  { name: "Pro", description: "Para empresas que precisam gerenciar mais processos seletivos.", icon: Target, tone: "green", featured: true },
  { name: "Premium", description: "Para empresas que desejam utilizar mais recursos da plataforma.", icon: Sparkles, tone: "blue" },
];

const comparisonRows = [
  ["Quantidade de vagas", "Em definição", "Em definição", "Em definição"],
  ["Gestão de candidaturas", "Em preparação", "Em preparação", "Em preparação"],
  ["Busca de talentos", "Em preparação", "Em preparação", "Em preparação"],
  ["Compatibilidade inteligente", "Em preparação", "Em preparação", "Em preparação"],
  ["Recursos administrativos empresariais", "Em definição", "Em definição", "Em definição"],
  ["Suporte", "Em definição", "Em definição", "Em definição"],
  ["Recursos adicionais", "Em definição", "Em definição", "Em definição"],
];

const questions = [
  ["O cadastro de candidato é gratuito?", "Sim. O acesso básico do candidato é gratuito e inclui cadastro, currículo digital, pesquisa de vagas, candidaturas, recomendações compatíveis e acompanhamento das inscrições."],
  ["Como funcionam os planos empresariais?", "As categorias Start, Pro e Premium estão em preparação. Preços, periodicidade, limites e diferenças entre os planos ainda não foram configurados."],
  ["Posso mudar de plano?", "As regras de alteração de plano ainda não estão definidas. Entre em contato pelo WhatsApp para receber informações quando os planos estiverem prontos."],
  ["Como publicar vagas?", "Cadastre uma conta empresarial e acompanhe a análise do perfil. Após a aprovação, você poderá acessar o painel empresarial e publicar uma oportunidade."],
  ["Quais recursos estão disponíveis?", "A plataforma já oferece cadastro empresarial, publicação e gestão de vagas, candidaturas, busca de talentos sujeita às permissões de visibilidade, compatibilidade e notificações. A disponibilidade pode depender da aprovação da empresa e do consentimento do candidato."],
] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-700">{children}</p>;
}

export default function PlansPage() {
  return <main className="overflow-hidden bg-white text-slate-900">
    <section className="relative isolate overflow-hidden bg-[#082d79] text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_78%_15%,rgba(16,185,129,.35),transparent_35%),linear-gradient(120deg,#062667_0%,#0755d8_68%,#087c71_100%)]" />
      <div className="absolute -right-20 top-[-10rem] -z-10 size-[28rem] rounded-full border border-white/10" />
      <div className="absolute -right-4 top-[-7rem] -z-10 size-[22rem] rounded-full border border-white/10" />
      <div className="container-page grid min-h-[510px] items-center gap-8 py-14 sm:py-20 lg:grid-cols-[1.05fr_.95fr]">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.15em]"><Sparkles size={15}/> Acesso para cada etapa da sua jornada</p>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">Planos para encontrar os melhores <span className="text-emerald-300">talentos!</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">Escolha a solução ideal para sua empresa e simplifique suas contratações.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#candidatos" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-800 shadow-lg transition hover:-translate-y-0.5">Para candidatos <ArrowRight size={17}/></a>
            <a href="#empresas" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/20">Para empresas <Building2 size={17}/></a>
          </div>
          <p className="mt-5 text-sm text-blue-100">Acesso básico gratuito para candidatos · planos empresariais em preparação</p>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-4 rounded-[2rem] bg-emerald-300/20 blur-2xl" />
          <div className="relative min-h-[300px] overflow-hidden rounded-[1.8rem] border border-white/20 bg-white/10 shadow-2xl sm:min-h-[385px]">
            <Image src="/images/profissionais-brasileiros.png" alt="Profissionais em um ambiente de trabalho colaborativo" fill priority sizes="(max-width: 1024px) 92vw, 48vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061b51]/90 via-[#061b51]/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7"><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur"><UsersRound size={15}/> Talentos e empresas da região</span><p className="mt-3 max-w-sm text-xl font-extrabold leading-snug sm:text-2xl">Uma plataforma para aproximar pessoas e oportunidades.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section id="candidatos" className="scroll-mt-24 py-16 sm:py-20">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-16">
        <div>
          <SectionLabel>Para candidatos</SectionLabel>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Seu próximo emprego começa aqui!</h2>
          <p className="mt-4 max-w-xl leading-7 text-slate-600">Crie seu perfil gratuitamente, descubra oportunidades e acompanhe suas candidaturas em um só lugar.</p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4"><span className="grid size-11 place-items-center rounded-xl bg-emerald-600 text-white"><Check size={23}/></span><span><strong className="block text-lg font-black text-emerald-900">Gratuito</strong><span className="text-sm text-emerald-800">Acesso básico para candidatos</span></span></div>
          <Link href="/cadastro?tipo=candidate" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800">Criar conta gratuita <ArrowRight size={17}/></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {candidateFeatures.map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon size={21}/></span><span className="text-sm font-bold text-slate-800">{text}</span></div>)}
        </div>
      </div>
    </section>

    <section id="empresas" className="scroll-mt-24 bg-[#f3f7ff] py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center"><SectionLabel>Para empresas</SectionLabel><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Planos empresariais em preparação.</h2><p className="mt-4 leading-7 text-slate-600">Estamos organizando as opções comerciais. Preços, periodicidade, limites e recursos específicos serão apresentados quando estiverem definidos.</p></div>
        <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
          {businessPlans.map(({ name, description, icon: Icon, tone, featured }) => <article key={name} className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-7 ${featured ? "border-emerald-300 ring-2 ring-emerald-200 lg:-translate-y-2" : "border-slate-200"}`}>
            {featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white">Categoria intermediária</span>}
            <div className={`grid size-12 place-items-center rounded-2xl ${tone === "green" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}><Icon size={24}/></div>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[.15em] text-slate-500">Categoria planejada</p><h3 className="mt-1 text-2xl font-black">Plano {name}</h3><p className="mt-3 min-h-12 leading-6 text-slate-600">{description}</p>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4"><p className="text-sm font-extrabold text-slate-800">Preço e periodicidade</p><p className="mt-1 text-sm text-slate-600">A definir</p></div>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-extrabold text-amber-950">Recursos e limites em preparação</p><p className="mt-1 text-xs leading-5 text-amber-900">Nenhuma contratação ou cobrança está disponível por esta página.</p></div>
            <a href="https://wa.me/5571992417737?text=Ol%C3%A1%2C%20gostaria%20de%20receber%20informa%C3%A7%C3%B5es%20sobre%20os%20planos%20empresariais%20do%20Pombal%20Emprega." target="_blank" rel="noopener noreferrer" className={`mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition ${tone === "green" ? "bg-emerald-700 text-white hover:bg-emerald-800" : "border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100"}`}>Consultar novidades <ArrowRight size={16}/></a>
          </article>)}
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">Consultar novidades abre o canal de contato configurado; não inicia uma contratação.</p>
      </div>
    </section>

    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="max-w-2xl"><SectionLabel>Compare as categorias</SectionLabel><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Detalhes comerciais serão publicados quando definidos.</h2><p className="mt-3 leading-7 text-slate-600">A tabela deixa visível o que ainda está sendo preparado, sem presumir preços, limites ou benefícios específicos.</p></div>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm" role="region" aria-label="Comparação de recursos dos planos empresariais" tabIndex={0}>
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead><tr className="bg-[#082d79] text-white"><th scope="col" className="p-4 font-extrabold">Recurso</th><th scope="col" className="p-4 font-extrabold">Start</th><th scope="col" className="bg-emerald-700 p-4 font-extrabold">Pro</th><th scope="col" className="p-4 font-extrabold">Premium</th></tr></thead>
            <tbody>{comparisonRows.map(([label, start, pro, premium], index) => <tr key={label} className={index % 2 ? "bg-white" : "bg-slate-50"}><th scope="row" className="border-t border-slate-200 p-4 font-bold text-slate-800">{label}</th><td className="border-t border-slate-200 p-4 text-slate-600">{start}</td><td className="border-t border-slate-200 p-4 text-slate-600">{pro}</td><td className="border-t border-slate-200 p-4 text-slate-600">{premium}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section className="bg-[#f3f7ff] py-16 sm:py-20">
      <div className="container-page grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div><SectionLabel>Perguntas frequentes</SectionLabel><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Informação clara para começar.</h2><p className="mt-4 leading-7 text-slate-600">As condições comerciais empresariais serão atualizadas nesta página quando estiverem configuradas.</p></div>
        <div className="space-y-3">{questions.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-slate-900 marker:content-none">{question}<span className="text-xl text-blue-700 transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{answer}</p></details>)}</div>
      </div>
    </section>

    <section className="bg-gradient-to-r from-[#082d79] via-blue-700 to-emerald-700 py-14 text-white sm:py-16">
      <div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-200">Comece hoje</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Seu próximo passo começa aqui.</h2><p className="mt-3 max-w-2xl leading-6 text-blue-100">Candidatos podem criar um perfil gratuito. Empresas podem entrar em contato para acompanhar as novidades dos planos.</p></div><div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-56"><Link href="/cadastro?tipo=candidate" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-800 hover:bg-blue-50">Criar conta gratuita <ArrowRight size={16}/></Link><a href="https://wa.me/5571992417737?text=Ol%C3%A1%2C%20gostaria%20de%20receber%20informa%C3%A7%C3%B5es%20sobre%20os%20planos%20empresariais%20do%20Pombal%20Emprega." target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-extrabold text-white hover:bg-white/20">Falar sobre planos <ArrowRight size={16}/></a></div></div>
    </section>
  </main>;
}
