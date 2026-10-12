"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Bell, BriefcaseBusiness, Building2, FileText,
  Sparkles, Target, UsersRound,
} from "@/components/icons";

const flows = {
  candidate: {
    label: "Sou candidato",
    title: "Sua próxima oportunidade começa pelo seu perfil.",
    action: "Quero encontrar emprego",
    href: "/cadastro?tipo=candidate",
    steps: [
      { icon: UsersRound, title: "Crie sua conta gratuitamente", body: "Cadastre seus dados básicos para começar a usar a plataforma." },
      { icon: FileText, title: "Monte seu currículo digital", body: "Conte sobre sua experiência, habilidades, formação e disponibilidade." },
      { icon: Sparkles, title: "Receba recomendações", body: "Veja oportunidades compatíveis com as informações do seu currículo." },
      { icon: BriefcaseBusiness, title: "Candidate-se às oportunidades", body: "Escolha as vagas que fazem sentido para seus objetivos." },
      { icon: Bell, title: "Acompanhe suas candidaturas", body: "Consulte as atualizações do processo seletivo pelo seu painel." },
    ],
  },
  company: {
    label: "Sou empresa",
    title: "Da publicação da vaga à organização da seleção.",
    action: "Quero contratar",
    href: "/cadastro?tipo=company",
    steps: [
      { icon: Building2, title: "Cadastre sua empresa", body: "Informe os dados da empresa e complete o perfil empresarial." },
      { icon: BriefcaseBusiness, title: "Publique suas vagas", body: "Descreva o cargo, as condições e os requisitos da oportunidade." },
      { icon: Target, title: "Encontre perfis compatíveis", body: "Consulte candidaturas e talentos que autorizaram ser encontrados." },
      { icon: FileText, title: "Analise currículos autorizados", body: "Veja as informações profissionais relevantes para sua seleção." },
      { icon: Bell, title: "Organize o processo seletivo", body: "Acompanhe as etapas e atualize o andamento pelo painel." },
    ],
  },
} as const;

type Profile = keyof typeof flows;

export function HowItWorksTabs() {
  const [profile, setProfile] = useState<Profile>("candidate");
  const flow = flows[profile];

  return <section id="passo-a-passo" className="scroll-mt-20 bg-slate-50 py-16 sm:py-20">
    <div className="container-page">
      <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold uppercase tracking-[.17em] text-blue-700">Sua jornada, do seu jeito</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Como funciona para você?</h2><p className="mt-3 leading-7 text-slate-600">Escolha seu perfil para ver as etapas e os recursos disponíveis.</p></div>
      <div className="mx-auto mt-7 grid max-w-xl grid-cols-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm" role="tablist" aria-label="Escolha seu perfil">
        {(Object.keys(flows) as Profile[]).map((key) => <button key={key} id={`tab-${key}`} role="tab" type="button" aria-selected={profile === key} aria-controls="flow-panel" onClick={() => setProfile(key)} className={`min-h-12 rounded-xl px-3 text-sm font-extrabold capitalize transition duration-200 ${profile === key ? "bg-blue-700 text-white shadow-md shadow-blue-900/15" : "text-slate-600 hover:bg-slate-50 hover:text-blue-800"}`}>{flows[key].label}</button>)}
      </div>
      <div id="flow-panel" role="tabpanel" aria-labelledby={`tab-${profile}`} className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-emerald-700">{flow.label}</p><h3 className="mt-2 max-w-2xl text-2xl font-black text-slate-950 sm:text-3xl">{flow.title}</h3></div><Link href={flow.href} className={`btn min-h-12 shrink-0 gap-2 ${profile === "candidate" ? "btn-blue" : "btn-green"}`}>{flow.action} <ArrowRight size={17}/></Link></div>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{flow.steps.map(({ icon: Icon, title, body }, index) => <li key={title} className="relative rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition duration-200 hover:border-blue-200 hover:bg-white hover:shadow-md"><div className="flex items-center justify-between"><span className={`grid size-11 place-items-center rounded-xl ${index % 2 === 0 ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}><Icon size={22}/></span><span className="text-sm font-black text-slate-300">0{index + 1}</span></div><h4 className="mt-4 text-sm font-extrabold leading-snug text-slate-900">{title}</h4><p className="mt-2 text-xs leading-5 text-slate-600">{body}</p></li>)}</ol>
      </div>
    </div>
  </section>;
}
