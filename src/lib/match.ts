export const MATCH_VERSION = "1.0.0";

export type CandidateMatch = {
  desired_title: string | null;
  city: string;
  skills: string[];
  experience_months: number;
  education_level: number;
  availability: string[];
  work_modes: string[];
  first_job: boolean;
};

export type JobMatch = {
  title: string;
  city: string;
  required_skills: string[];
  preferred_skills: string[];
  min_experience_months: number;
  min_education_level: number;
  availability: string[];
  work_mode: string;
  first_job_friendly: boolean;
};

const normal = (value: string) => value.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const includes = (items: string[], item: string) => items.some((value) => normal(value) === normal(item));

export function calculateMatch(candidate: CandidateMatch, job: JobMatch) {
  const reasons: string[] = [];
  const gaps: string[] = [];
  let points = 0;
  const title = normal(candidate.desired_title ?? "");
  const jobTitle = normal(job.title);
  if (title && (title.includes(jobTitle) || jobTitle.includes(title))) {
    points += 20;
    reasons.push("Cargo desejado alinhado à vaga");
  } else gaps.push("Cargo desejado diferente");

  if (normal(candidate.city) === normal(job.city) || job.work_mode === "remoto") {
    points += 15;
    reasons.push(job.work_mode === "remoto" ? "Vaga remota" : "Mesma cidade");
  } else gaps.push("Cidade diferente");

  const required = job.required_skills ?? [];
  const matchedRequired = required.filter((skill) => includes(candidate.skills ?? [], skill));
  points += required.length ? Math.round(25 * matchedRequired.length / required.length) : 25;
  for (const skill of matchedRequired) reasons.push(`Habilidade obrigatória: ${skill}`);
  for (const skill of required.filter((skill) => !includes(candidate.skills ?? [], skill))) gaps.push(`Habilidade obrigatória a desenvolver: ${skill}`);

  const preferred = job.preferred_skills ?? [];
  const matchedPreferred = preferred.filter((skill) => includes(candidate.skills ?? [], skill));
  points += preferred.length ? Math.round(10 * matchedPreferred.length / preferred.length) : 10;
  for (const skill of matchedPreferred) reasons.push(`Habilidade desejável: ${skill}`);

  if (candidate.experience_months >= job.min_experience_months || (candidate.first_job && job.first_job_friendly)) {
    points += 10;
    reasons.push(job.min_experience_months ? "Experiência compatível" : "Experiência não exigida");
  } else gaps.push("Experiência abaixo da solicitada");

  if (candidate.education_level >= job.min_education_level) {
    points += 5;
    reasons.push("Escolaridade compatível");
  } else gaps.push("Escolaridade abaixo da solicitada");

  if (!job.availability?.length || job.availability.some((time) => includes(candidate.availability ?? [], time))) {
    points += 10;
    reasons.push("Disponibilidade compatível");
  } else gaps.push("Disponibilidade diferente");

  if (includes(candidate.work_modes ?? [], job.work_mode)) {
    points += 5;
    reasons.push("Modalidade desejada");
  } else gaps.push("Modalidade diferente");

  return { score: Math.min(100, points), reasons, gaps, version: MATCH_VERSION };
}
