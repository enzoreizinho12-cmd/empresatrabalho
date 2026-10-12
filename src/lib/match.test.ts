import { describe, expect, it } from "vitest";
import { calculateMatch, type CandidateMatch, type JobMatch } from "./match";

const candidate: CandidateMatch = {
  desired_title: "Garçom", city: "Ribeira do Pombal", skills: ["Atendimento ao público"],
  experience_months: 12, education_level: 2, availability: ["noturno"],
  work_modes: ["presencial"], first_job: false,
};
const job: JobMatch = {
  title: "Garçom", city: "Ribeira do Pombal", required_skills: ["Atendimento ao público"],
  preferred_skills: [], min_experience_months: 12, min_education_level: 2,
  availability: ["noturno"], work_mode: "presencial", first_job_friendly: false,
};

describe("calculateMatch", () => {
  it("returns a documented full match for aligned professional criteria", () => {
    expect(calculateMatch(candidate, job).score).toBe(100);
  });
  it("explains missing required skills without excluding the candidate", () => {
    const result = calculateMatch({ ...candidate, skills: [] }, job);
    expect(result.score).toBe(75);
    expect(result.gaps).toContain("Habilidade obrigatória a desenvolver: Atendimento ao público");
  });
  it("accepts a first job candidate when a vacancy welcomes first jobs", () => {
    const result = calculateMatch({ ...candidate, first_job: true, experience_months: 0 }, { ...job, first_job_friendly: true });
    expect(result.reasons).toContain("Experiência compatível");
  });
  it("does not consider personal or protected attributes", () => {
    const result = calculateMatch(candidate, job);
    expect(Object.keys(result)).toEqual(["score", "reasons", "gaps", "version"]);
  });

  it("ranks the more experienced night-shift waiter above a daytime attendant", () => {
    const vacancy: JobMatch = {
      title: "Garçom", city: "Ribeira do Pombal",
      required_skills: ["Atendimento ao cliente", "Experiência em restaurantes", "Boa comunicação"],
      preferred_skills: [], min_experience_months: 24, min_education_level: 2,
      availability: ["noturno"], work_mode: "presencial", first_job_friendly: false,
    };
    const joao: CandidateMatch = {
      desired_title: "Garçom", city: "Ribeira do Pombal",
      skills: ["Atendimento ao cliente", "Experiência em restaurantes", "Boa comunicação"],
      experience_months: 36, education_level: 2, availability: ["noturno"],
      work_modes: ["presencial"], first_job: false,
    };
    const maria: CandidateMatch = {
      desired_title: "Atendente", city: "Ribeira do Pombal",
      skills: ["Atendimento ao público", "Organização", "Comunicação"],
      experience_months: 12, education_level: 2, availability: ["comercial"],
      work_modes: ["presencial"], first_job: false,
    };

    const joaoMatch = calculateMatch(joao, vacancy);
    const mariaMatch = calculateMatch(maria, vacancy);
    expect(joaoMatch.score).toBe(100);
    expect(joaoMatch.score).toBeGreaterThan(mariaMatch.score);
    expect(mariaMatch.gaps).toContain("Experiência abaixo da solicitada");
    expect(mariaMatch.gaps).toContain("Disponibilidade diferente");
  });
});
