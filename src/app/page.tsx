import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Bell, Bookmark, BriefcaseBusiness, Building2, ChartColumn, Check,
  ChevronDown, CircleCheck, FileText, GraduationCap, HardHat, Heart, MapPin,
  Search, Settings, ShieldCheck, ShoppingBag, Target, Trophy, Truck, UsersRound, Utensils,
} from "@/components/icons";
import { saveJob } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { calculateMatch } from "@/lib/match";
import { jobAreas } from "@/lib/job-areas";
import "./landing.css";

type FeaturedJob = {
  id: string; title: string; city: string; contract_type: string; work_mode: string;
  salary_min: number | null; first_job_friendly: boolean; min_experience_months: number;
  companies: { name: string } | null;
};

const demoMatch = calculateMatch(
  { desired_title: "Atendente", city: "Ribeira do Pombal", skills: ["Atendimento ao cliente", "Comunicação"], experience_months: 12, education_level: 2, availability: ["diurno"], work_modes: ["presencial"], first_job: false },
  { title: "Atendente", city: "Ribeira do Pombal", required_skills: ["Atendimento ao cliente"], preferred_skills: ["Comunicação", "Organização"], min_experience_months: 6, min_education_level: 2, availability: ["diurno"], work_mode: "presencial", first_job_friendly: false },
);

const benefits = [
  { icon: UsersRound, title: "Mais oportunidades", detail: "para nossa região", color: "green" },
  { icon: BriefcaseBusiness, title: "Empresas locais", detail: "encontrando talentos", color: "blue" },
  { icon: ShieldCheck, title: "Processo simples", detail: "e seguro", color: "green" },
  { icon: MapPin, title: "Ribeira do Pombal · BA", detail: "e cidades vizinhas", color: "blue" },
  { icon: ChartColumn, title: "Construindo", detail: "mais oportunidades", color: "blue" },
];

const areas = [
  { slug: "alimentacao", icon: Utensils, color: "blue" },
  { slug: "comercio", icon: ShoppingBag, color: "green" },
  { slug: "construcao", icon: HardHat, color: "yellow" },
  { slug: "saude", icon: Heart, color: "rose" },
  { slug: "educacao", icon: GraduationCap, color: "blue" },
  { slug: "transporte", icon: Truck, color: "blue" },
  { slug: "administrativo", icon: BriefcaseBusiness, color: "green" },
  { slug: "servicos", icon: Settings, color: "blue" },
] as const;

const steps = [
  { icon: FileText, title: "Crie seu perfil", copy: "Conte sua experiência, habilidades e interesses. Inclua se busca o primeiro emprego." },
  { icon: Target, title: "Receba sugestões", copy: "Veja vagas compatíveis e entenda os critérios usados pela plataforma." },
  { icon: BriefcaseBusiness, title: "Candidate-se", copy: "Envie sua candidatura e acompanhe cada etapa pelo seu painel." },
  { icon: CircleCheck, title: "Entrevista", copy: "Acompanhe as etapas de seleção e os convites da empresa." },
  { icon: Trophy, title: "Conquiste seu futuro", copy: "Avance na carreira com oportunidades da sua região." },
];

function artIndex(title: string, fallback: number) {
  if (/garç|restaurante/i.test(title)) return 0;
  if (/vendedor|loja|comércio/i.test(title)) return 1;
  if (/cozinh|chef|pizz/i.test(title)) return 2;
  if (/obra|constru|pedreiro/i.test(title)) return 3;
  return fallback % 4;
}

function FeaturedCard({ job, index }: { job: FeaturedJob; index: number }) {
  return <article className="ref-job-card">
    <div className={`ref-job-image ref-job-image-${artIndex(job.title, index)}`} role="img" aria-label="Fotografia ilustrativa de uma área profissional"><span>Imagem ilustrativa</span></div>
    <div className="ref-job-info"><h3>{job.title}</h3><p>{job.companies?.name ?? "Empresa cadastrada"}</p><span><MapPin size={13} /> {job.city}</span>{job.salary_min != null && <strong className="ref-job-pay">A partir de R$ {Number(job.salary_min).toLocaleString("pt-BR")}</strong>}
      <div className="ref-job-tags"><span>{job.contract_type}</span><span>{job.work_mode}</span><span>{job.min_experience_months ? `${job.min_experience_months} meses+` : "Sem experiência mínima"}</span></div>
      <div className="ref-job-buttons"><Link href={`/vagas/${job.id}`}>Candidatar-se</Link><form action={saveJob}><input type="hidden" name="job_id" value={job.id}/><button type="submit" aria-label={`Salvar vaga ${job.title}`} title="Salvar vaga"><Bookmark size={18}/></button></form></div>
    </div>
  </article>;
}

function HeroPhones() {
  return <div className="ref-phones" aria-hidden="true">
    <div className="ref-phone ref-phone-primary"><div className="ref-phone-island"/><div className="ref-phone-screen"><div className="ref-phone-brand"><span className="ref-phone-brand-mark">●●●</span><strong>Pombal<span>Emprega</span></strong></div><p>Olá! Seu perfil está pronto para explorar.</p><div className="ref-phone-blue"><strong>Oportunidades para você</strong><span>Encontre vagas da sua região</span><i>Ver vagas</i></div><div className="ref-phone-mini"><span className="ref-phone-mini-icon"><BriefcaseBusiness size={16}/></span><span><strong>Exemplo de vaga</strong><small>Ribeira do Pombal · BA</small></span><b>{demoMatch.score}%</b></div><div className="ref-phone-lines"><span/><span/><span/></div><div className="ref-phone-caption">Prévia ilustrativa</div></div></div>
    <div className="ref-phone ref-phone-secondary"><div className="ref-phone-island"/><div className="ref-phone-screen"><div className="ref-phone-brand"><span className="ref-phone-brand-mark">●●●</span><strong>Pombal<span>Emprega</span></strong></div><div className="ref-phone-avatar"/><div className="ref-phone-lines"><span/><span/><span/></div><div className="ref-phone-mini"><span className="ref-phone-mini-icon"><Target size={15}/></span><span><strong>Seu perfil</strong><small>Compatibilidade explicada</small></span></div><div className="ref-phone-caption">Prévia ilustrativa</div></div></div>
  </div>;
}

export default async function Home() {
  let jobs: FeaturedJob[] = [];
  let configured = true;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("jobs").select("id,title,city,contract_type,work_mode,salary_min,first_job_friendly,min_experience_months,companies(name)").eq("status", "active").order("created_at", { ascending: false }).limit(4);
    jobs = (data ?? []) as unknown as FeaturedJob[];
    if (error) configured = false;
  } catch { configured = false; }

  return <main className="reference-page">
    <section className="ref-hero" aria-labelledby="ref-title"><div className="ref-hero-grid" aria-hidden="true"/><div className="ref-hero-people" aria-hidden="true"><Image src="/images/hero-profissionais.png" alt="" fill priority sizes="(max-width: 760px) 95vw, 55vw"/></div><HeroPhones/>
      <div className="ref-hero-note" aria-hidden="true">Pessoas reais,<br/>oportunidades reais! <span>↘</span></div>
      <div className="ref-notification" aria-hidden="true"><span><Bell size={20}/></span><div><strong>Seu futuro pode começar aqui!</strong><small>Explore vagas e acompanhe suas candidaturas.</small></div></div>
      <div className="container-page ref-hero-content"><p className="ref-hero-eyebrow">TRABALHO MAIS PERTO DE VOCÊ</p><h1 id="ref-title">Seu talento<br/>merece ser<br/><span>encontrado.</span></h1><p className="ref-hero-subtitle">A oportunidade certa encontra você!</p><p className="ref-hero-description">Conectamos talentos e empresas através de uma tecnologia inteligente que cruza perfis e encontra as melhores oportunidades para cada pessoa.</p>
        <form action="/vagas" role="search" className="ref-search"><Search size={19}/><input type="search" name="busca" aria-label="Qual vaga você procura?" placeholder="Qual vaga você procura?"/><label className="ref-search-city"><MapPin size={18}/><select name="cidade" aria-label="Cidade da busca" defaultValue="Ribeira do Pombal"><option value="Ribeira do Pombal">Ribeira do Pombal</option><option value="">Todas as cidades</option></select><ChevronDown size={14}/></label><button type="submit">Buscar</button></form>
        <div className="ref-hero-actions"><Link href="/cadastro?tipo=candidate" className="ref-hero-action blue"><UsersRound size={25}/><span><strong>Quero trabalhar</strong><small>Crie seu currículo e receba oportunidades</small></span></Link><Link href="/cadastro?tipo=company" className="ref-hero-action green"><Building2 size={25}/><span><strong>Quero contratar</strong><small>Encontre os profissionais ideais</small></span></Link></div>
      </div>
    </section>

    <div className="ref-benefits"><div className="container-page ref-benefits-grid">{benefits.map(item => { const Icon = item.icon; return <div className="ref-benefit" key={item.title}><span className={item.color}><Icon size={27}/></span><div><strong>{item.title}</strong><small>{item.detail}</small></div></div>; })}</div></div>

    <section className="ref-jobs" id="vagas"><div className="container-page"><div className="ref-section-heading"><div><h2>Vagas em destaque</h2><p>Oportunidades próximas de você. Encontre a sua!</p></div><Link href="/vagas">Ver todas as vagas <ArrowRight size={16}/></Link></div>
      {jobs.length ? <div className="ref-jobs-grid">{jobs.map((job,index) => <FeaturedCard key={job.id} job={job} index={index}/>)}</div> : <div className="ref-jobs-empty"><div className="ref-empty-photos" aria-hidden="true">{[0,1,2,3].map(index => <div className={`ref-job-image ref-job-image-${index}`} key={index}/>)}</div><div className="ref-empty-message"><div className="ref-empty-icon"><BriefcaseBusiness size={28}/></div><div><h3>As próximas vagas estão chegando.</h3><p>{configured ? "Ainda não há vagas publicadas. Crie seu perfil para acompanhar oportunidades e notificações." : "Estamos preparando a área de vagas. Crie seu perfil para acompanhar oportunidades e notificações no painel."}</p></div><Link href="/cadastro?tipo=candidate">Criar perfil gratuito <ArrowRight size={15}/></Link></div></div>}
    </div></section>

    <section className="ref-feature-strip" aria-label="Caminhos para candidatos e empresas"><div className="container-page ref-feature-grid">
      <article className="ref-feature ref-first-job" id="primeiro-emprego"><Image src="/images/primeiro-emprego.png" alt="Jovem brasileiro usando um celular" fill sizes="(max-width: 700px) 45vw, 18vw"/><div className="ref-first-copy"><p>PRIMEIRO EMPREGO</p><h2>Sua primeira oportunidade começa <span>aqui!</span></h2><p>Não tem experiência? Encontre vagas abertas a quem está começando.</p><Link href="/vagas?inicio=1">Ver oportunidades <ArrowRight size={16}/></Link></div></article>
      <article className="ref-feature ref-areas"><h2>Principais áreas</h2><p>Encontre vagas na sua área de interesse.</p><div className="ref-area-grid">{areas.map(area => { const Icon = area.icon; return <Link href={`/vagas?area=${area.slug}`} key={area.slug} className={`ref-area ${area.color}`}><Icon size={20}/><span>{jobAreas[area.slug].label}</span></Link>; })}</div></article>
      <article className="ref-feature ref-business" id="para-empresas"><Image src="/images/empresa-profissional.png" alt="Profissional brasileira usando um tablet" fill sizes="(max-width: 700px) 44vw, 18vw"/><div className="ref-business-copy"><p>PARA EMPRESAS</p><h2>O profissional ideal para sua empresa está aqui.</h2><ul><li><Check size={12}/> Publicação de vagas</li><li><Check size={12}/> Candidaturas organizadas</li><li><Check size={12}/> Filtro por experiência</li><li><Check size={12}/> Tudo em um só lugar</li></ul><Link href="/cadastro?tipo=company">Encontrar talentos <ArrowRight size={16}/></Link></div></article>
    </div></section>

    <section className="ref-steps" id="como-funciona"><div className="container-page"><div className="ref-section-heading"><div><h2>Como funciona</h2><p>Do cadastro à contratação. Tudo em poucos passos.</p></div><strong>Rápido, simples e inteligente.</strong></div><div className="ref-steps-grid">{steps.map((step,index) => { const Icon = step.icon; return <article className="ref-step" key={step.title}><div className="ref-step-head"><b>{index + 1}</b><span><Icon size={23}/></span></div><h3>{step.title}</h3><p>{step.copy}</p>{index < steps.length - 1 && <ArrowRight className="ref-step-arrow" size={17}/>}</article>; })}</div></div></section>

    <section className="ref-final" id="planos"><div className="container-page ref-final-grid"><div className="ref-final-copy"><h2>Faça parte de uma cidade<br/>com mais oportunidades.</h2><p>Conectando pessoas, impulsionando o trabalho e fortalecendo o comércio local.</p></div><div className="ref-final-motifs" aria-hidden="true"><div><Building2 size={23}/>Mais empregos</div><div><ChartColumn size={23}/>Economia local</div><div><UsersRound size={23}/>Empresas que crescem</div></div><div className="ref-final-signup"><h3>Comece agora, é gratuito!</h3><p>Cadastre-se em poucos minutos e tenha acesso às oportunidades disponíveis.</p><Link href="/cadastro?tipo=candidate">Quero me cadastrar <ArrowRight size={16}/></Link></div></div></section>
  </main>;
}
