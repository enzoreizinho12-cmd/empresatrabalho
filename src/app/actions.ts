"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole, requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const value = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const list = (form: FormData, key: string) => value(form, key).split(",").map((item) => item.trim()).filter(Boolean);
function fail(path: string, message: string): never {
  redirect(`${path}?erro=${encodeURIComponent(message)}`);
}

type SignupRole = "candidate" | "company";
const signupPath = (role: SignupRole, message?: string) => `/cadastro?tipo=${role}${message ? `&erro=${encodeURIComponent(message)}` : ""}`;
const digits = (input: string) => input.replace(/\D/g, "");

async function createAccount(form: FormData, role: SignupRole) {
  const common = {
    email: value(form, "email").toLowerCase(), password: value(form, "password"),
    confirm_password: value(form, "confirm_password"), phone: digits(value(form, "phone")),
    city: value(form, "city"), neighborhood: value(form, "neighborhood"), terms: form.get("terms") === "on",
  };
  const details = role === "candidate"
    ? { full_name: value(form, "full_name") }
    : { company_name: value(form, "company_name"), responsible_name: value(form, "responsible_name"), cnpj: digits(value(form, "cnpj")), industry: value(form, "industry") };
  const schema = z.object({
    email: z.email(), password: z.string().min(8).max(128), confirm_password: z.string(),
    phone: z.string().regex(/^\d{10,13}$/, "Informe um WhatsApp com DDD."),
    city: z.string().min(2).max(120), neighborhood: z.string().min(2).max(120), terms: z.literal(true),
    ...(role === "candidate"
      ? { full_name: z.string().min(2).max(120) }
      : { company_name: z.string().min(2).max(120), responsible_name: z.string().min(2).max(120), cnpj: z.string().refine((cnpj) => cnpj.length === 0 || cnpj.length === 14, "Informe um CNPJ com 14 dígitos ou deixe em branco."), industry: z.string().min(2).max(100) }),
  }).refine((data) => data.password === data.confirm_password, { path: ["confirm_password"], message: "As senhas não conferem." });
  const parsed = schema.safeParse({ ...common, ...details });
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Revise os dados informados.";
    redirect(signupPath(role, message));
  }

  const profile = Object.fromEntries(Object.entries(parsed.data).filter(([key]) => !["email", "password", "confirm_password", "terms"].includes(key)));
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { role, ...(role === "candidate" ? { candidate_profile: profile } : { company_profile: profile }) },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });
  if (error) {
    const alreadyExists = error.code === "user_already_exists" || /already registered|already exists/i.test(error.message);
    redirect(signupPath(role, alreadyExists ? "Este e-mail já possui uma conta. Entre ou recupere sua senha." : "Não foi possível criar a conta agora. Confira os dados e tente novamente."));
  }
  redirect("/entrar?aviso=Cadastro iniciado. Confira seu e-mail para confirmar a conta e continuar.");
}

export async function signUpCandidate(form: FormData) {
  await createAccount(form, "candidate");
}

export async function signUpCompany(form: FormData) {
  await createAccount(form, "company");
}

export async function signIn(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: value(form, "email"), password: value(form, "password") });
  if (error) fail("/entrar", "Não foi possível entrar. Confira e-mail, senha e confirmação da conta.");
  redirect("/painel");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(form: FormData) {
  const email = value(form, "email");
  if (!z.email().safeParse(email).success) fail("/recuperar", "Informe um e-mail válido.");
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/nova-senha` });
  redirect("/recuperar?aviso=Se existir uma conta, enviaremos um link de recuperação.");
}

export async function updatePassword(form: FormData) {
  const password = value(form, "password");
  if (password.length < 8) fail("/nova-senha", "Use pelo menos 8 caracteres.");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) fail("/nova-senha", error.message);
  redirect("/painel");
}

export async function saveCandidate(form: FormData) {
  const { supabase, user } = await requireRole("candidate");
  const parsed = z.object({ full_name: z.string().min(2).max(120), city: z.string().min(2).max(120), experience_months: z.coerce.number().int().min(0), education_level: z.coerce.number().int().min(0).max(5) }).safeParse({
    full_name: value(form, "full_name"), city: value(form, "city"), experience_months: value(form, "experience_months") || 0, education_level: value(form, "education_level") || 0,
  });
  if (!parsed.success || !parsed.data) fail("/candidato/perfil", "Revise nome, cidade, experiência e escolaridade.");
  const { error } = await supabase.from("candidate_profiles").upsert({
    user_id: user.id, ...parsed.data, phone: value(form, "phone") || null,
    neighborhood: value(form, "neighborhood") || null, desired_title: value(form, "desired_title") || null,
    areas: list(form, "areas"), skills: list(form, "skills"), courses: list(form, "courses"), certifications: list(form, "certifications"),
    experience_summary: value(form, "experience_summary") || null,
    availability: list(form, "availability"), work_modes: form.getAll("work_modes").map(String),
    first_job: form.get("first_job") === "on", visible_in_directory: form.get("visible_in_directory") === "on",
    updated_at: new Date().toISOString(),
  });
  if (error) fail("/candidato/perfil", error.message);
  revalidatePath("/candidato");
  redirect("/candidato");
}

export async function saveCompany(form: FormData) {
  const { supabase, user } = await requireRole("company");
  const name = value(form, "name"); const city = value(form, "city");
  const companyProfile = {
    company_name: name, responsible_name: value(form, "responsible_name"), cnpj: digits(value(form, "cnpj")),
    phone: digits(value(form, "phone")), city, neighborhood: value(form, "neighborhood"), industry: value(form, "industry"),
  };
  const profileSchema = z.object({
    company_name: z.string().min(2).max(120), responsible_name: z.string().min(2).max(120),
    cnpj: z.string().refine((cnpj) => cnpj.length === 0 || cnpj.length === 14),
    phone: z.string().regex(/^\d{10,13}$/), city: z.string().min(2).max(120),
    neighborhood: z.string().min(2).max(120), industry: z.string().min(2).max(100),
  }).safeParse(companyProfile);
  if (!profileSchema.success) fail("/empresa/perfil", "Revise os dados da empresa, o CNPJ e o WhatsApp.");
  const { data: existing } = await supabase.from("companies").select("id").eq("owner_id", user.id).maybeSingle();
  const payload = { name, city, description: value(form, "description") || null };
  const { error } = existing
    ? await supabase.from("companies").update(payload).eq("id", existing.id)
    : await supabase.from("companies").insert({ owner_id: user.id, ...payload });
  if (error) fail("/empresa/perfil", error.message);
  const { error: metadataError } = await supabase.auth.updateUser({ data: { company_profile: profileSchema.data } });
  if (metadataError) fail("/empresa/perfil", "A empresa foi salva, mas não foi possível atualizar os dados privados. Tente novamente.");
  revalidatePath("/empresa");
  redirect("/empresa");
}

export async function publishJob(form: FormData) {
  const { supabase, user } = await requireRole("company");
  const { data: company } = await supabase.from("companies").select("id,status").eq("owner_id", user.id).single();
  if (!company || company.status !== "approved") fail("/empresa", "A empresa precisa ser aprovada antes de publicar vagas.");
  const parsed = z.object({ title: z.string().min(2).max(120), description: z.string().min(20).max(5000), city: z.string().min(2), openings: z.coerce.number().int().min(1).max(1000), min_experience_months: z.coerce.number().int().min(0), min_education_level: z.coerce.number().int().min(0).max(5), contract_type: z.enum(["CLT", "Temporário", "Freelancer", "Diária", "Estágio", "Jovem Aprendiz", "Primeiro emprego"]), work_mode: z.enum(["presencial", "híbrido", "remoto"]) }).safeParse({
    title: value(form, "title"), description: value(form, "description"), city: value(form, "city"), openings: value(form, "openings") || 1,
    min_experience_months: value(form, "min_experience_months") || 0, min_education_level: value(form, "min_education_level") || 0,
    contract_type: value(form, "contract_type"), work_mode: value(form, "work_mode"),
  });
  if (!parsed.success || !parsed.data) fail("/empresa/nova-vaga", "Revise os campos da vaga. A descrição precisa ter pelo menos 20 caracteres.");
  const salaryMin = value(form, "salary_min") ? Number(value(form, "salary_min")) : null;
  const salaryMax = value(form, "salary_max") ? Number(value(form, "salary_max")) : null;
  if ((salaryMin !== null && (!Number.isFinite(salaryMin) || salaryMin < 0)) || (salaryMax !== null && (!Number.isFinite(salaryMax) || salaryMax < (salaryMin ?? 0)))) fail("/empresa/nova-vaga", "Faixa salarial inválida.");
  if (value(form, "deadline") && value(form, "deadline") < new Date().toISOString().slice(0, 10)) fail("/empresa/nova-vaga", "O prazo não pode estar no passado.");
  const { error } = await supabase.from("jobs").insert({
    company_id: company.id, ...parsed.data, salary_min: salaryMin, salary_max: salaryMax,
    required_skills: list(form, "required_skills"), preferred_skills: list(form, "preferred_skills"),
    availability: list(form, "availability"), benefits: list(form, "benefits"),
    deadline: value(form, "deadline") || null, first_job_friendly: form.get("first_job_friendly") === "on",
  });
  if (error) fail("/empresa/nova-vaga", error.message);
  revalidatePath("/vagas"); revalidatePath("/empresa");
  redirect("/empresa?aviso=Vaga publicada.");
}

export async function applyJob(form: FormData) {
  const { supabase } = await requireRole("candidate");
  const jobId = value(form, "job_id");
  const { error } = await supabase.rpc("apply_for_job", { target_job: jobId });
  if (error) fail(`/vagas/${jobId}`, error.message);
  revalidatePath("/candidato/candidaturas");
  redirect("/candidato/candidaturas?aviso=Candidatura enviada.");
}

export async function saveJob(form: FormData) {
  const { supabase, user } = await requireRole("candidate");
  const jobId = value(form, "job_id");
  const { error } = await supabase.from("saved_jobs").upsert({ user_id: user.id, job_id: jobId });
  if (error) fail(`/vagas/${jobId}`, error.message);
  redirect(`/vagas/${jobId}?aviso=Vaga salva.`);
}

export async function unsaveJob(form: FormData) {
  const { supabase, user } = await requireRole("candidate");
  await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", value(form, "job_id"));
  revalidatePath("/candidato/salvas");
}

export async function closeJob(form: FormData) {
  const { supabase, user } = await requireRole("company");
  const { data: company } = await supabase.from("companies").select("id,status").eq("owner_id", user.id).single();
  if (!company || company.status !== "approved") fail("/empresa", "Empresa não autorizada.");
  const { error } = await supabase.from("jobs").update({ status: "closed" }).eq("id", value(form, "job_id")).eq("company_id", company.id);
  if (error) fail("/empresa", error.message);
  revalidatePath("/empresa"); revalidatePath("/vagas");
}

export async function reportJob(form: FormData) {
  const { supabase, user } = await requireUser();
  const jobId = value(form, "job_id"); const reason = value(form, "reason");
  if (reason.length < 10) fail(`/vagas/${jobId}`, "Explique a denúncia em pelo menos 10 caracteres.");
  const { error } = await supabase.from("reports").insert({ reporter_id: user.id, job_id: jobId, reason });
  if (error) fail(`/vagas/${jobId}`, error.message);
  redirect(`/vagas/${jobId}?aviso=Denúncia recebida.`);
}

export async function moveApplication(form: FormData) {
  const { supabase } = await requireRole("company");
  const stage = value(form, "stage");
  const allowed = ["visualizada", "analise", "entrevista", "agendada", "aprovada", "contratado", "nao_selecionado", "encerrada"];
  if (!allowed.includes(stage)) fail("/empresa/candidaturas", "Etapa inválida.");
  const { error } = await supabase.rpc("move_application", { target_application: value(form, "application_id"), next_stage: stage });
  if (error) fail("/empresa/candidaturas", error.message);
  revalidatePath("/empresa/candidaturas");
}

export async function withdrawApplication(form: FormData) {
  const { supabase } = await requireRole("candidate");
  const { error } = await supabase.rpc("move_application", { target_application: value(form, "application_id"), next_stage: "retirada" });
  if (error) fail("/candidato/candidaturas", error.message);
  revalidatePath("/candidato/candidaturas");
}

export async function approveCompany(form: FormData) {
  const { supabase, user } = await requireRole("admin");
  const id = value(form, "company_id"); const status = value(form, "status");
  if (!["approved", "blocked"].includes(status)) fail("/admin", "Estado inválido.");
  const { error } = await supabase.from("companies").update({ status }).eq("id", id);
  if (error) fail("/admin", error.message);
  await supabase.from("admin_audit").insert({ actor_id: user.id, action: `company_${status}`, target_id: id });
  revalidatePath("/admin");
}

export async function markNotification(form: FormData) {
  const { supabase } = await requireUser();
  await supabase.rpc("mark_notification", { target_notification: value(form, "notification_id") });
  revalidatePath("/candidato/notificacoes");
  revalidatePath("/candidato");
}

export async function requestDeletion() {
  const { supabase, user } = await requireUser();
  const { data: existing } = await supabase.from("deletion_requests").select("id").eq("user_id", user.id).maybeSingle();
  if (existing) redirect("/conta?aviso=Sua solicitação já está registrada.");
  const { error } = await supabase.from("deletion_requests").insert({ user_id: user.id });
  if (error) fail("/conta", error.message);
  redirect("/conta?aviso=Solicitação registrada. A equipe analisará a exclusão dos dados.");
}
