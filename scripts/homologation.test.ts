import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { calculateMatch, type CandidateMatch, type JobMatch } from "../src/lib/match";

const STAGING_PROJECT_REF = "vctcnxvoajszeqfffcah";

type TestAccount = { client: SupabaseClient; userId: string };
type Context = {
  joao: TestAccount;
  maria: TestAccount;
  companyA: TestAccount;
  companyB: TestAccount;
  admin: TestAccount;
  companyAId: string;
  companyBId: string;
  jobA: { id: string; title: string };
  jobB: { id: string; title: string };
  applicationAId: string;
  applicationBId: string;
  runTag: string;
};

let context: Context | undefined;
const clients: SupabaseClient[] = [];

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Configure ${name} em .env.homologation.`);
  return value;
}

function newClient() {
  const client = createClient(
    required("NEXT_PUBLIC_SUPABASE_URL"),
    required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } },
  );
  clients.push(client);
  return client;
}

async function login(label: string, expectedRole: "candidate" | "company" | "admin"): Promise<TestAccount> {
  const prefix = `PE_TEST_${label}`;
  const client = newClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: required(`${prefix}_EMAIL`),
    password: required(`${prefix}_PASSWORD`),
  });
  if (error || !data.user) throw new Error(`Login de ${label} falhou: ${error?.message ?? "usuário ausente"}`);

  const { data: role, error: roleError } = await client
    .from("account_roles")
    .select("role,suspended")
    .eq("user_id", data.user.id)
    .single();
  if (roleError || role?.role !== expectedRole || role.suspended) {
    throw new Error(`A conta ${label} precisa ter papel ${expectedRole} ativo no staging.`);
  }
  return { client, userId: data.user.id };
}

function ctx() {
  if (!context) throw new Error("Pré-requisitos da homologação não foram preparados.");
  return context;
}

async function createOrUpdateCompany(account: TestAccount, name: string) {
  const payload = { name, city: "Ribeira do Pombal", description: "Empresa fictícia para homologação." };
  const { data: existing, error: findError } = await account.client
    .from("companies").select("id").eq("owner_id", account.userId).maybeSingle();
  if (findError) throw findError;
  const result = existing
    ? await account.client.from("companies").update(payload).eq("id", existing.id).select("id,status").single()
    : await account.client.from("companies").insert({ owner_id: account.userId, ...payload }).select("id,status").single();
  if (result.error || !result.data) throw result.error ?? new Error("Empresa não foi criada.");
  return result.data as { id: string; status: string };
}

async function createJob(account: TestAccount, companyId: string, title: string) {
  const { data, error } = await account.client.from("jobs").insert({
    company_id: companyId,
    title,
    description: "Vaga fictícia usada exclusivamente nos testes de homologação.",
    openings: 1,
    contract_type: "CLT",
    min_experience_months: 24,
    min_education_level: 2,
    required_skills: ["Atendimento ao cliente", "Experiência em restaurantes"],
    preferred_skills: ["Boa comunicação"],
    city: "Ribeira do Pombal",
    work_mode: "presencial",
    availability: ["noturno"],
    benefits: [],
    first_job_friendly: false,
  }).select("id,title").single();
  if (error || !data) throw error ?? new Error("Vaga não foi criada.");
  return data as { id: string; title: string };
}

async function candidateProfile(account: TestAccount, fullName: string, skills: string[], experienceMonths: number, availability: string[]) {
  const { error } = await account.client.from("candidate_profiles").upsert({
    user_id: account.userId,
    full_name: fullName,
    phone: null,
    city: "Ribeira do Pombal",
    neighborhood: null,
    desired_title: ctx().jobA?.title ?? "Garçom Homologação",
    areas: ["Restaurantes e Alimentação"],
    skills,
    courses: [],
    certifications: [],
    experience_summary: "Experiência fictícia para homologação.",
    experience_months: experienceMonths,
    education_level: 2,
    availability,
    work_modes: ["presencial"],
    expected_salary: null,
    first_job: false,
    visible_in_directory: true,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

describe.sequential("homologação Supabase PombalEmprega — mutações apenas no staging autorizado", () => {
  beforeAll(async () => {
    const url = required("NEXT_PUBLIC_SUPABASE_URL");
    const projectRef = new URL(url).hostname.split(".")[0];
    if (projectRef !== STAGING_PROJECT_REF) {
      throw new Error(`Recusado: projeto ${projectRef} não é o staging permitido.`);
    }
    if (required("POMBALEMPREGA_CONFIRM_STAGING") !== STAGING_PROJECT_REF) {
      throw new Error("Confirme o ref do staging em POMBALEMPREGA_CONFIRM_STAGING.");
    }

    const joao = await login("JOAO", "candidate");
    const maria = await login("MARIA", "candidate");
    const companyA = await login("EMPRESA_A", "company");
    const companyB = await login("EMPRESA_B", "company");
    const admin = await login("ADMIN", "admin");
    const runTag = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
    const title = `Garçom Homologação ${runTag}`;

    context = {
      joao, maria, companyA, companyB, admin, runTag,
      companyAId: "", companyBId: "",
      jobA: { id: "", title }, jobB: { id: "", title },
      applicationAId: "", applicationBId: "",
    };

    await candidateProfile(joao, "João Teste", ["Atendimento ao cliente", "Experiência em restaurantes", "Boa comunicação"], 36, ["noturno"]);
    await candidateProfile(maria, "Maria Teste", ["Atendimento ao cliente"], 12, ["comercial"]);

    const companyARecord = await createOrUpdateCompany(companyA, `Restaurante Teste Pombal ${runTag}`);
    const companyBRecord = await createOrUpdateCompany(companyB, `Comércio Teste Pombal ${runTag}`);
    context.companyAId = companyARecord.id;
    context.companyBId = companyBRecord.id;

    for (const id of [companyARecord.id, companyBRecord.id]) {
      const { data, error } = await admin.client.from("companies").update({ status: "approved" })
        .eq("id", id).select("id,status").single();
      if (error || data?.status !== "approved") {
        throw new Error(`Administrador de teste não conseguiu aprovar a empresa: ${error?.message ?? "status não aprovado"}`);
      }
    }

    const [jobA, jobB] = await Promise.all([
      createJob(companyA, companyARecord.id, title),
      createJob(companyB, companyBRecord.id, title),
    ]);
    context.jobA = jobA;
    context.jobB = jobB;
  }, 60_000);

  afterAll(async () => {
    await Promise.all(clients.map(async (client) => { await client.auth.signOut(); }));
  }, 30_000);

  it("encontra os candidatos consentidos e ordena pelo match calculado", async () => {
    const { companyA, jobA, joao, maria } = ctx();
    const { data, error } = await companyA.client.rpc("company_job_candidates", { target_job: jobA.id });
    expect(error).toBeNull();
    const candidates = (data ?? []) as Array<CandidateMatch & { user_id: string }>;
    expect(candidates.map((candidate) => candidate.user_id).sort()).toEqual([joao.userId, maria.userId].sort());

    const job: JobMatch = {
      title: jobA.title, city: "Ribeira do Pombal", required_skills: ["Atendimento ao cliente", "Experiência em restaurantes"],
      preferred_skills: ["Boa comunicação"], min_experience_months: 24, min_education_level: 2,
      availability: ["noturno"], work_mode: "presencial", first_job_friendly: false,
    };
    const score = (candidate: (typeof candidates)[number]) => calculateMatch(candidate as CandidateMatch, job).score;
    const ranked = [...candidates].sort((a, b) => score(b) - score(a));
    expect(ranked[0]?.user_id).toBe(joao.userId);
    expect(score(ranked[0])).toBeGreaterThan(score(ranked[1]));
  });

  it("exige consentimento e impede uma empresa de consultar a vaga de outra", async () => {
    const { companyA, companyB, jobA, maria } = ctx();
    const { error: updateError } = await maria.client.from("candidate_profiles")
      .update({ visible_in_directory: false }).eq("user_id", maria.userId);
    expect(updateError).toBeNull();

    try {
      const hidden = await companyA.client.rpc("company_job_candidates", { target_job: jobA.id });
      expect(hidden.error).toBeNull();
      const hiddenCandidates = (hidden.data ?? []) as Array<CandidateMatch & { user_id: string }>;
      expect(hiddenCandidates.some((candidate) => candidate.user_id === maria.userId)).toBe(false);

      const unauthorized = await companyB.client.rpc("company_job_candidates", { target_job: jobA.id });
      expect(unauthorized.error).toBeNull();
      expect(unauthorized.data ?? []).toHaveLength(0);
    } finally {
      const { error: restoreError } = await maria.client.from("candidate_profiles")
        .update({ visible_in_directory: true }).eq("user_id", maria.userId);
      expect(restoreError).toBeNull();
    }
  });

  it("registra candidaturas somente pela RPC e rejeita duplicatas e identidade enviada pelo cliente", async () => {
    const { joao, maria, jobA, jobB } = ctx();
    const first = await joao.client.rpc("apply_for_job", { target_job: jobA.id });
    expect(first.error).toBeNull();
    expect(first.data).toEqual(expect.any(String));
    ctx().applicationAId = first.data as string;

    const second = await maria.client.rpc("apply_for_job", { target_job: jobB.id });
    expect(second.error).toBeNull();
    expect(second.data).toEqual(expect.any(String));
    ctx().applicationBId = second.data as string;

    const duplicate = await joao.client.rpc("apply_for_job", { target_job: jobA.id });
    expect(duplicate.error).not.toBeNull();

    const spoof = await joao.client.rpc("apply_for_job", { target_job: jobB.id, candidate_id: maria.userId });
    expect(spoof.error).not.toBeNull();

    const directInsert = await joao.client.from("applications")
      .insert({ job_id: jobA.id, candidate_id: joao.userId }).select("id").maybeSingle();
    expect(directInsert.data).toBeNull();
    expect(directInsert.error?.code).toBe("42501");
  });

  it("isola perfis, candidaturas, notificações e alterações de vagas entre usuários", async () => {
    const { joao, maria, companyA, companyB, jobB, applicationAId, applicationBId } = ctx();

    const privateProfile = await joao.client.from("candidate_profiles").select("user_id")
      .eq("user_id", maria.userId).maybeSingle();
    expect(privateProfile.data).toBeNull();

    const profileWrite = await joao.client.from("candidate_profiles").update({ full_name: "Maria Teste" })
      .eq("user_id", maria.userId).select("user_id").maybeSingle();
    expect(profileWrite.data).toBeNull();

    const privateApplication = await maria.client.from("applications").select("id")
      .eq("id", applicationAId).maybeSingle();
    expect(privateApplication.data).toBeNull();

    const applicantsA = await companyA.client.rpc("company_applicants");
    const applicantsB = await companyB.client.rpc("company_applicants");
    expect(applicantsA.error).toBeNull();
    expect(applicantsB.error).toBeNull();
    const rowsA = (applicantsA.data ?? []) as Array<{ application_id: string }>;
    const rowsB = (applicantsB.data ?? []) as Array<{ application_id: string }>;
    expect(rowsA.some((row) => row.application_id === applicationAId)).toBe(true);
    expect(rowsB.some((row) => row.application_id === applicationAId)).toBe(false);
    expect(rowsB.some((row) => row.application_id === applicationBId)).toBe(true);

    const otherNotifications = await maria.client.from("notifications").select("id")
      .eq("user_id", joao.userId).limit(1);
    expect(otherNotifications.data ?? []).toHaveLength(0);

    const otherJobWrite = await companyA.client.from("jobs").update({ title: jobB.title })
      .eq("id", jobB.id).select("id").maybeSingle();
    expect(otherJobWrite.data).toBeNull();
  });

  it("entrega notificações aos destinatários e registra o processo seletivo", async () => {
    const { joao, maria, companyA, jobA, jobB, applicationAId, applicationBId } = ctx();
    const [candidateNotice, employerNotice, mariaNotice] = await Promise.all([
      joao.client.from("notifications").select("id,dedupe_key,read_at")
        .eq("dedupe_key", `application-sent:${applicationAId}`).maybeSingle(),
      companyA.client.from("notifications").select("id,dedupe_key")
        .eq("dedupe_key", `application-received:${applicationAId}`).maybeSingle(),
      maria.client.from("notifications").select("id,dedupe_key,read_at")
        .eq("dedupe_key", `application-sent:${applicationBId}`).maybeSingle(),
    ]);
    expect(candidateNotice.error).toBeNull();
    expect(candidateNotice.data).not.toBeNull();
    expect(employerNotice.error).toBeNull();
    expect(employerNotice.data).not.toBeNull();
    expect(mariaNotice.error).toBeNull();
    expect(mariaNotice.data).not.toBeNull();

    const unauthorizedRead = await joao.client.from("notifications").select("id")
      .eq("id", mariaNotice.data!.id).maybeSingle();
    expect(unauthorizedRead.data).toBeNull();
    const unauthorizedMark = await joao.client.rpc("mark_notification", { target_notification: mariaNotice.data!.id });
    expect(unauthorizedMark.error).toBeNull();
    const unchanged = await maria.client.from("notifications").select("read_at")
      .eq("id", mariaNotice.data!.id).single();
    expect(unchanged.data?.read_at).toBeNull();

    const stage = await companyA.client.rpc("move_application", {
      target_application: applicationAId, next_stage: "analise",
    });
    expect(stage.error).toBeNull();
    const candidateStatus = await joao.client.from("applications").select("stage")
      .eq("id", applicationAId).single();
    expect(candidateStatus.data?.stage).toBe("analise");
    const stageNotice = await joao.client.from("notifications").select("id")
      .eq("dedupe_key", `stage:${applicationAId}:analise`).maybeSingle();
    expect(stageNotice.data).not.toBeNull();

    const crossCompanyAttempt = await maria.client.rpc("move_application", {
      target_application: applicationAId, next_stage: "entrevista",
    });
    expect(crossCompanyAttempt.error).not.toBeNull();

    const close = await companyA.client.from("jobs").update({ status: "closed" })
      .eq("id", jobA.id).select("id").single();
    expect(close.error).toBeNull();
    const closedStatus = await joao.client.from("applications").select("stage")
      .eq("id", applicationAId).single();
    expect(closedStatus.data?.stage).toBe("encerrada");
    const closedNotice = await joao.client.from("notifications").select("id")
      .eq("dedupe_key", `closed:${jobA.id}`).maybeSingle();
    expect(closedNotice.data).not.toBeNull();

    const closedApply = await maria.client.rpc("apply_for_job", { target_job: jobA.id });
    expect(closedApply.error).not.toBeNull();
    expect(jobB.id).not.toBe(jobA.id);
  });

  it("impede contas comuns de alterar papéis administrativos e confirma escopo do administrador", async () => {
    const { joao, maria, admin, companyA, companyB } = ctx();
    const commonUserWrite = await joao.client.from("account_roles").update({ role: "candidate" })
      .eq("user_id", maria.userId).select("user_id").maybeSingle();
    expect(commonUserWrite.data).toBeNull();

    const allRoles = await admin.client.from("account_roles").select("user_id,role");
    expect(allRoles.error).toBeNull();
    const visibleIds = new Set(((allRoles.data ?? []) as Array<{ user_id: string }>).map((row) => row.user_id));
    for (const userId of [joao.userId, maria.userId, companyA.userId, companyB.userId]) {
      expect(visibleIds.has(userId)).toBe(true);
    }
  });

  it("encerra todas as sessões de teste", async () => {
    const results = await Promise.all(clients.map((client) => client.auth.signOut()));
    expect(results.every(({ error }) => error === null)).toBe(true);
  });
});
