import { describe, expect, it } from "vitest";
import { calculateProfileCompletion } from "./profile-completion";

describe("calculateProfileCompletion", () => {
  it("starts at zero and returns concrete next steps for an empty profile", () => {
    const result = calculateProfileCompletion({});
    expect(result.percentage).toBe(0);
    expect(result.completedSections).toBe(0);
    expect(result.totalSections).toBe(8);
    expect(result.nextSteps).toContain("Escolha uma profissão ou área de interesse.");
  });

  it("counts real first-job and education details without requiring invented experience", () => {
    const result = calculateProfileCompletion({
      full_name: "Ana Silva", city: "Ribeira do Pombal", desired_title: "Auxiliar",
      skills: ["Atendimento"], first_job: true, courses: ["Atendimento ao cliente"],
      availability: ["diurno"], work_modes: ["presencial"],
    });
    expect(result.percentage).toBe(100);
    expect(result.nextSteps).toEqual([]);
  });

  it("ignores whitespace and empty arrays", () => {
    const result = calculateProfileCompletion({
      full_name: "  ", city: "Ribeira do Pombal", areas: [" ", ""], skills: [],
      experience_months: 0, first_job: false, education_level: 0,
    });
    expect(result.completedSections).toBe(1);
    expect(result.percentage).toBe(13);
    expect(result.nextSteps).toContain("Adicione suas habilidades profissionais.");
  });

  it("does not treat a false first-job checkbox or zero education as completed", () => {
    const result = calculateProfileCompletion({ first_job: false, education_level: 0 });
    expect(result.nextSteps).toContain("Descreva sua experiência ou indique que busca o primeiro emprego.");
    expect(result.nextSteps).toContain("Informe sua escolaridade, cursos ou certificações.");
  });
});