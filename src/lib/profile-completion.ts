export type CandidateProfileForCompletion = {
  full_name?: string | null;
  city?: string | null;
  desired_title?: string | null;
  areas?: string[] | null;
  skills?: string[] | null;
  experience_summary?: string | null;
  experience_months?: number | null;
  first_job?: boolean | null;
  education_level?: number | null;
  courses?: string[] | null;
  certifications?: string[] | null;
  availability?: string[] | null;
  work_modes?: string[] | null;
};

const hasText = (value?: string | null) => Boolean(value?.trim());
const hasItems = (value?: string[] | null) => Boolean(value?.some((item) => item.trim()));

export function calculateProfileCompletion(profile: CandidateProfileForCompletion) {
  const checks = [
    { complete: hasText(profile.full_name), next: "Informe seu nome completo." },
    { complete: hasText(profile.city), next: "Informe sua cidade." },
    { complete: hasText(profile.desired_title) || hasItems(profile.areas), next: "Escolha uma profissão ou área de interesse." },
    { complete: hasItems(profile.skills), next: "Adicione suas habilidades profissionais." },
    { complete: Boolean(profile.first_job) || hasText(profile.experience_summary) || Number(profile.experience_months) > 0, next: "Descreva sua experiência ou indique que busca o primeiro emprego." },
    { complete: Number(profile.education_level) > 0 || hasItems(profile.courses) || hasItems(profile.certifications), next: "Informe sua escolaridade, cursos ou certificações." },
    { complete: hasItems(profile.availability), next: "Informe seus horários disponíveis." },
    { complete: hasItems(profile.work_modes), next: "Escolha as modalidades de trabalho que aceita." },
  ];
  const completedSections = checks.filter((check) => check.complete).length;

  return {
    percentage: Math.round((completedSections / checks.length) * 100),
    completedSections,
    totalSections: checks.length,
    nextSteps: checks.filter((check) => !check.complete).map((check) => check.next),
  };
}