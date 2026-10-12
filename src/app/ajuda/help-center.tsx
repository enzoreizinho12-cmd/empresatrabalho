"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BriefcaseBusiness, Building2, FileText, Search,
  ShieldCheck, UsersRound,
} from "@/components/icons";

const categories = [
  { name: "Minha conta", icon: UsersRound },
  { name: "Meu currículo", icon: FileText },
  { name: "Buscar empregos", icon: Search },
  { name: "Candidaturas", icon: BriefcaseBusiness },
  { name: "Empresas e vagas", icon: Building2 },
  { name: "Segurança e privacidade", icon: ShieldCheck },
] as const;

type Category = (typeof categories)[number]["name"];
type Article = { category: Category; question: string; answer: React.ReactNode; keywords?: string };

const articles: Article[] = [
  { category: "Minha conta", question: "Como criar minha conta?", answer: <>Acesse <Link className="font-bold text-blue-700 underline" href="/cadastro?tipo=candidate">Criar conta de candidato</Link> ou escolha o cadastro de empresa. Informe os dados solicitados e confirme seu e-mail, se o sistema pedir.</>, keywords: "cadastro registrar candidato empresa" },
  { category: "Meu currículo", question: "Como cadastrar meu currículo?", answer: <>Entre na sua conta e abra <Link className="font-bold text-blue-700 underline" href="/candidato/perfil">Meu perfil</Link>. Preencha seus dados profissionais, habilidades, experiência, formação e disponibilidade. Você pode atualizar essas informações depois.</>, keywords: "curriculo perfil experiência habilidades formação" },
  { category: "Buscar empregos", question: "Como procurar emprego?", answer: <>Acesse <Link className="font-bold text-blue-700 underline" href="/vagas">Vagas</Link>, pesquise por cargo ou cidade e use os filtros disponíveis para encontrar oportunidades adequadas ao seu perfil.</>, keywords: "pesquisa busca emprego cidade filtros" },
  { category: "Candidaturas", question: "Como me candidatar a uma vaga?", answer: <>Abra os detalhes da oportunidade e selecione <strong>Candidatar-se</strong>. Você precisa estar autenticado como candidato. Ao se candidatar, seus dados profissionais são compartilhados com a empresa responsável pela seleção.</>, keywords: "inscrição aplicar vaga candidatura" },
  { category: "Candidaturas", question: "Como acompanhar minha candidatura?", answer: <>Acesse <Link className="font-bold text-blue-700 underline" href="/candidato/candidaturas">Minhas candidaturas</Link> para consultar o andamento e as atualizações da empresa.</>, keywords: "status processo seletivo acompanhar" },
  { category: "Meu currículo", question: "Como editar meus dados?", answer: <>Abra <Link className="font-bold text-blue-700 underline" href="/candidato/perfil">Meu perfil</Link> para atualizar seu currículo. Para dados da conta e visibilidade do perfil, consulte <Link className="font-bold text-blue-700 underline" href="/conta">Minha conta</Link>.</>, keywords: "alterar editar atualizar informações" },
  { category: "Minha conta", question: "Como recuperar minha senha?", answer: <>Acesse <Link className="font-bold text-blue-700 underline" href="/recuperar">Recuperar acesso</Link>, informe o e-mail da conta e use o link enviado pelo serviço de autenticação para cadastrar uma nova senha.</>, keywords: "senha esqueci login acesso" },
  { category: "Empresas e vagas", question: "Como cadastrar minha empresa?", answer: <>Use o <Link className="font-bold text-blue-700 underline" href="/cadastro?tipo=company">cadastro empresarial</Link> e preencha as informações solicitadas. O perfil empresarial passa por análise antes de liberar a publicação de vagas.</>, keywords: "empresa negócio cadastro conta empresarial" },
  { category: "Empresas e vagas", question: "Como publicar uma oportunidade?", answer: <>Depois que o perfil empresarial for aprovado, entre no <Link className="font-bold text-blue-700 underline" href="/empresa/nova-vaga">painel de publicação</Link>, preencha os detalhes da vaga e envie para análise.</>, keywords: "anunciar divulgar publicar vaga oportunidade" },
  { category: "Empresas e vagas", question: "Como encontrar profissionais?", answer: <>Empresas aprovadas podem consultar candidaturas recebidas e buscar perfis que permitiram aparecer no diretório de talentos. A compatibilidade compara critérios profissionais informados para a vaga.</>, keywords: "talentos busca candidatos compatibilidade" },
  { category: "Candidaturas", question: "Como visualizar os candidatos?", answer: <>No painel empresarial, abra <Link className="font-bold text-blue-700 underline" href="/empresa/candidaturas">Candidaturas</Link> para ver as pessoas inscritas nas vagas da sua empresa. O acesso aos dados segue as permissões e o consentimento aplicáveis.</>, keywords: "empresa inscritos currículos candidatos" },
  { category: "Candidaturas", question: "Como acompanhar um processo seletivo?", answer: <>Acesse <Link className="font-bold text-blue-700 underline" href="/empresa/candidaturas">Candidaturas</Link> no painel da empresa para consultar inscrições e atualizar as etapas do processo.</>, keywords: "etapa processo entrevista status empresa" },
  { category: "Empresas e vagas", question: "Como encerrar uma vaga?", answer: <>A empresa responsável pode gerenciar suas oportunidades pelo painel empresarial. Abra a vaga correspondente e use a opção de encerramento disponível nos controles da oportunidade.</>, keywords: "fechar desativar vaga oportunidade" },
  { category: "Segurança e privacidade", question: "Como alterar minha senha?", answer: <>Se estiver conectado, saia da conta e use <Link className="font-bold text-blue-700 underline" href="/recuperar">Recuperar acesso</Link> para receber um link de redefinição de senha.</>, keywords: "senha trocar redefinir" },
  { category: "Segurança e privacidade", question: "Como controlar o compartilhamento do meu currículo?", answer: <>Em <Link className="font-bold text-blue-700 underline" href="/candidato/perfil">Meu perfil</Link>, ajuste a visibilidade profissional. Ao se candidatar, os dados necessários para aquela seleção são compartilhados com a empresa responsável.</>, keywords: "consentimento privacidade visibilidade currículo" },
  { category: "Segurança e privacidade", question: "Como solicitar a exclusão da minha conta?", answer: <>Acesse <Link className="font-bold text-blue-700 underline" href="/conta">Minha conta</Link> e registre uma solicitação de exclusão. A equipe precisa analisar obrigações aplicáveis de retenção antes de concluir a exclusão ou anonimização.</>, keywords: "apagar excluir deletar dados conta" },
  { category: "Segurança e privacidade", question: "Como denunciar uma oportunidade suspeita?", answer: <>Entre na sua conta e, na página de detalhes da oportunidade, use o formulário <strong>Denunciar vaga suspeita</strong>. Descreva o motivo; a denúncia fica registrada para análise. Evite enviar documentos ou fazer pagamentos solicitados por anúncios suspeitos.</>, keywords: "fraude golpe reportar denunciar vaga reclamação anúncio" },
];

const guides = [
  { title: "Criar uma conta", audience: "Candidato", icon: UsersRound, href: "/cadastro?tipo=candidate", steps: ["Escolha cadastro de candidato", "Informe seus dados e e-mail", "Confirme a conta para entrar"] },
  { title: "Preencher currículo", audience: "Candidato", icon: FileText, href: "/candidato/perfil", steps: ["Abra seu perfil", "Conte sua experiência e habilidades", "Salve e revise a visibilidade"] },
  { title: "Encontrar vagas", audience: "Candidato", icon: Search, href: "/vagas", steps: ["Pesquise cargo ou cidade", "Ajuste os filtros", "Abra uma oportunidade compatível"] },
  { title: "Realizar candidatura", audience: "Candidato", icon: BriefcaseBusiness, href: "/vagas", steps: ["Entre na conta de candidato", "Leia os detalhes da vaga", "Candidate-se e acompanhe o painel"] },
  { title: "Cadastrar empresa", audience: "Empresa", icon: Building2, href: "/cadastro?tipo=company", steps: ["Escolha cadastro de empresa", "Informe os dados solicitados", "Acompanhe a análise do perfil"] },
  { title: "Publicar oportunidade", audience: "Empresa", icon: BriefcaseBusiness, href: "/empresa/nova-vaga", steps: ["Acesse o painel aprovado", "Preencha cargo e requisitos", "Envie a vaga para análise"] },
];

export default function HelpCenter() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "Todas">("Todas");
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const filteredArticles = useMemo(() => articles.filter((article) => {
    const matchesCategory = activeCategory === "Todas" || article.category === activeCategory;
    const searchable = `${article.question} ${article.category} ${article.keywords ?? ""}`.toLocaleLowerCase("pt-BR");
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
  }), [activeCategory, normalizedQuery]);

  return <>
    <section className="relative isolate overflow-hidden bg-[#082d79] text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_80%_15%,rgba(16,185,129,.28),transparent_35%),linear-gradient(120deg,#062667_0%,#0755d8_65%,#087c71_100%)]" />
      <div className="container-page grid min-h-[420px] items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1.05fr_.95fr]">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em]"><ShieldCheck size={15}/> Central de ajuda</p>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">Olá! Como podemos ajudar?</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">Encontre respostas rápidas para suas dúvidas sobre o PombalEmprega.</p>
          <label className="mt-7 flex min-h-14 max-w-xl items-center gap-3 rounded-xl bg-white px-4 text-slate-900 shadow-lg"><Search size={20} className="shrink-0 text-blue-700"/><span className="sr-only">Digite sua dúvida</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") document.getElementById("perguntas")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} placeholder="Digite sua dúvida..." className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"/><button type="button" onClick={() => document.getElementById("perguntas")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-blue-800">Buscar</button></label>
          <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-blue-100"><span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-300"/> Conta e privacidade</span><span className="inline-flex items-center gap-2"><Search size={15} className="text-emerald-300"/> Vagas e candidaturas</span></div>
        </div>
        <div className="relative mx-auto h-[240px] w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 shadow-2xl sm:h-[300px]">
          <Image src="/images/recrutadora-brasileira.png" alt="Profissional consultando informações em um tablet" fill sizes="(max-width: 1024px) 92vw, 45vw" className="object-cover object-[center_28%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061b51]/85 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5"><span className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-extrabold text-emerald-950"><ShieldCheck size={14}/> Orientação para candidatos e empresas</span></div>
        </div>
      </div>
    </section>
    <section className="bg-[#f3f7ff] py-10 sm:py-14">
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-center">
        <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-700">Central de ajuda</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Perguntas frequentes</h2><p className="mt-3 max-w-xl leading-7 text-slate-600">Pesquise respostas sobre contas, vagas e candidaturas ou escolha uma categoria.</p></div>
        <p className="text-sm font-semibold text-slate-500">{filteredArticles.length} {filteredArticles.length === 1 ? "resposta" : "respostas"}{normalizedQuery ? ` para “${query.trim()}”` : " disponíveis"}</p>
      </div>
    </section>

    <section className="container-page py-12 sm:py-16">
      <div className="flex flex-wrap gap-2" aria-label="Filtrar por categoria">
        <button type="button" onClick={() => setActiveCategory("Todas")} aria-pressed={activeCategory === "Todas"} className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${activeCategory === "Todas" ? "bg-blue-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"}`}>Todas</button>
        {categories.map(({ name, icon: Icon }) => <button key={name} type="button" onClick={() => setActiveCategory(name)} aria-pressed={activeCategory === name} className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${activeCategory === name ? "bg-blue-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"}`}><Icon size={16}/>{name}</button>)}
      </div>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[.68fr_1.32fr]">
        <aside className="rounded-3xl bg-gradient-to-br from-[#082d79] to-blue-700 p-6 text-white sm:p-8"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-300">Respostas rápidas</p><h3 className="mt-3 text-2xl font-black">Conte com a central de ajuda</h3><p className="mt-3 text-sm leading-6 text-blue-100">Encontre instruções para sua jornada profissional ou para contratar talentos.</p><div className="mt-6 space-y-2">{categories.map(({ name, icon: Icon }) => <button key={name} type="button" onClick={() => { setActiveCategory(name); document.getElementById("faq-list")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition hover:bg-white/10"><Icon size={17} className="text-emerald-300"/>{name}<ArrowRight size={15} className="ml-auto opacity-70"/></button>)}</div></aside>
        <div id="faq-list" className="scroll-mt-24 space-y-3">
          <div className="mb-4"><h3 className="text-xl font-black">{activeCategory === "Todas" ? "Dúvidas de candidatos e empresas" : activeCategory}</h3><p className="mt-1 text-sm text-slate-500">{filteredArticles.length} {filteredArticles.length === 1 ? "resposta encontrada" : "respostas encontradas"}</p></div>
          {filteredArticles.map((article) => <details key={article.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition open:border-blue-200 open:shadow-md"><summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-extrabold leading-6 text-slate-900 marker:content-none">{article.question}<span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-50 text-lg text-blue-700 transition group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-7 text-slate-600">{article.answer}</p></details>)}
          {!filteredArticles.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><Search size={27} className="mx-auto text-slate-400"/><h4 className="mt-3 font-extrabold">Não encontramos essa dúvida</h4><p className="mt-1 text-sm text-slate-600">Tente outras palavras ou fale com a equipe pelo canal oficial.</p><a href="https://wa.me/5571992417737" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex font-bold text-blue-700 underline">Abrir WhatsApp</a></div>}
        </div>
      </div>
    </section>

    <section className="bg-[#f3f7ff] py-12 sm:py-16">
      <div className="container-page"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-700">Guias passo a passo</p><h2 className="mt-2 text-3xl font-black tracking-tight">Comece com estes passos</h2></div><p className="max-w-lg text-sm leading-6 text-slate-600">Orientações curtas para as tarefas mais comuns da plataforma.</p></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{guides.map(({ title, audience, icon: Icon, href, steps: guideSteps }) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon size={21}/></span><div><h3 className="font-extrabold">{title}</h3><p className="text-xs font-semibold text-emerald-700">{audience}</p></div></div><ol className="mt-5 space-y-3">{guideSteps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-5 text-slate-600"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-extrabold text-blue-700">{index + 1}</span>{step}</li>)}</ol><Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-blue-700 hover:underline">Acessar página <ArrowRight size={15}/></Link></article>)}</div>
      </div>
    </section>

    <section className="container-page grid gap-8 py-12 sm:py-16 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-700">Fale com a equipe</p><h2 className="mt-2 text-2xl font-black">Não encontrou o que procurava?</h2><p className="mt-3 text-sm leading-6 text-slate-600">O envio de solicitações pelo formulário ainda não está disponível porque a plataforma não tem um serviço de suporte conectado. Use o WhatsApp oficial para falar com a equipe.</p><form className="mt-6 grid gap-4" aria-describedby="support-unavailable"><fieldset disabled className="grid gap-4 opacity-60 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-semibold text-slate-700">Nome<input name="name" autoComplete="name" placeholder="Seu nome" className="h-11 rounded-xl border border-slate-200 px-3 font-normal"/></label><label className="grid gap-1.5 text-sm font-semibold text-slate-700">E-mail<input name="email" type="email" autoComplete="email" placeholder="voce@email.com" className="h-11 rounded-xl border border-slate-200 px-3 font-normal"/></label><label className="grid gap-1.5 text-sm font-semibold text-slate-700">Tipo de usuário<select name="user_type" defaultValue="" className="h-11 rounded-xl border border-slate-200 px-3 font-normal"><option value="" disabled>Selecione</option><option>Candidato</option><option>Empresa</option><option>Outro</option></select></label><label className="grid gap-1.5 text-sm font-semibold text-slate-700">Assunto<input name="subject" placeholder="Como podemos ajudar?" className="h-11 rounded-xl border border-slate-200 px-3 font-normal"/></label><label className="grid gap-1.5 text-sm font-semibold text-slate-700 sm:col-span-2">Descrição do problema<textarea name="description" rows={3} placeholder="Descreva sua dúvida" className="rounded-xl border border-slate-200 p-3 font-normal"/></label></fieldset><button type="button" disabled className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-300 px-5 py-3 text-sm font-extrabold text-slate-600">ENVIAR SOLICITAÇÃO <ArrowRight size={16}/></button><p id="support-unavailable" className="text-xs leading-5 text-amber-800">Formulário indisponível: nenhum serviço de atendimento está conectado.</p></form></div>
      <div className="rounded-3xl bg-gradient-to-br from-[#082d79] to-emerald-800 p-6 text-white shadow-xl sm:p-8"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-emerald-200">Canais oficiais</p><h2 className="mt-2 text-2xl font-black">Contato e orientação</h2><p className="mt-3 text-sm leading-6 text-blue-100">Use os canais configurados no projeto para tirar dúvidas ou relatar uma oportunidade suspeita.</p><div className="mt-6 grid gap-3">
        <a href="https://wa.me/5571992417737" target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/20 bg-white/10 p-4 transition hover:bg-white/15"><span className="text-xs font-bold uppercase tracking-wide text-emerald-200">WhatsApp oficial configurado</span><strong className="mt-1 block text-lg">(71) 99241-7737</strong><span className="mt-2 inline-flex items-center gap-2 text-sm font-bold">Falar com a equipe <ArrowRight size={15}/></span></a>
        <a href="https://wa.me/5571992417737?text=Ol%C3%A1%2C%20tenho%20uma%20d%C3%BAvida%20sobre%20cadastro%20empresarial%20ou%20publica%C3%A7%C3%A3o%20de%20vagas." target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/15 bg-white/5 p-4 transition hover:bg-white/10"><strong className="block">Dúvidas de empresas</strong><p className="mt-1 text-sm text-blue-100">Fale pelo WhatsApp sobre cadastro empresarial, análise e publicação de vagas.</p><span className="mt-2 inline-flex items-center gap-2 text-sm font-bold">Falar sobre empresas <ArrowRight size={14}/></span></a>
        <a href="https://wa.me/5571992417737?text=Ol%C3%A1%2C%20tenho%20uma%20d%C3%BAvida%20sobre%20uma%20candidatura%20no%20Pombal%20Emprega." target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/15 bg-white/5 p-4 transition hover:bg-white/10"><strong className="block">Dúvidas de candidaturas</strong><p className="mt-1 text-sm text-blue-100">Informe o cargo e a cidade da oportunidade. Não envie senha ou documentos sensíveis.</p><span className="mt-2 inline-flex items-center gap-2 text-sm font-bold">Falar sobre candidatura <ArrowRight size={14}/></span></a>
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4"><strong className="block">Suporte por e-mail</strong><p className="mt-1 text-sm text-blue-100">Endereço de suporte ainda não configurado.</p></div>
      </div><Link href="/privacidade" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white underline">Leia a Política de privacidade <ArrowRight size={15}/></Link></div>
    </section>
  </>;
}
