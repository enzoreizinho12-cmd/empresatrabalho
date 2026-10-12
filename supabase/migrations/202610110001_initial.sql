-- Pombal Emprega. Apply only to a new development/staging project after review.
create extension if not exists pgcrypto;

create type public.account_role as enum ('candidate', 'company', 'admin');
create type public.application_stage as enum ('enviada', 'visualizada', 'analise', 'entrevista', 'agendada', 'aprovada', 'contratado', 'nao_selecionado', 'encerrada', 'retirada');

create table public.account_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.account_role not null,
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);

create function public.create_account_role() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.account_roles(user_id, role)
  values (new.id, case when new.raw_user_meta_data ->> 'role' = 'company' then 'company'::public.account_role else 'candidate'::public.account_role end);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.create_account_role();

create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.account_roles where user_id = (select auth.uid()) and role = 'admin' and not suspended);
$$;
create table public.candidate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (length(full_name) between 2 and 120),
  phone text,
  city text not null,
  neighborhood text,
  desired_title text,
  areas text[] not null default '{}',
  skills text[] not null default '{}',
  courses text[] not null default '{}',
  certifications text[] not null default '{}',
  experience_summary text,
  experience_months int not null default 0 check (experience_months >= 0),
  education_level int not null default 0 check (education_level between 0 and 5),
  availability text[] not null default '{}',
  work_modes text[] not null default '{}',
  expected_salary numeric(12,2),
  first_job boolean not null default false,
  visible_in_directory boolean not null default false,
  available_until timestamptz,
  updated_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null check(length(name) between 2 and 120),
  city text not null,
  description text,
  status text not null default 'pending' check(status in ('pending','approved','blocked')),
  created_at timestamptz not null default now()
);

create function public.is_company_owner(company uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.companies c join public.account_roles r on r.user_id = c.owner_id
    where c.id = company and c.owner_id = (select auth.uid()) and c.status = 'approved' and r.role = 'company' and not r.suspended);
$$;

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null check(length(title) between 2 and 120),
  description text not null check(length(description) between 20 and 5000),
  openings int not null default 1 check(openings between 1 and 1000),
  contract_type text not null check(contract_type in ('CLT','Temporário','Freelancer','Diária','Estágio','Jovem Aprendiz','Primeiro emprego')),
  salary_min numeric(12,2) check(salary_min >= 0),
  salary_max numeric(12,2) check(salary_max >= 0 and (salary_min is null or salary_max >= salary_min)),
  min_experience_months int not null default 0 check(min_experience_months >= 0),
  min_education_level int not null default 0 check(min_education_level between 0 and 5),
  required_skills text[] not null default '{}',
  preferred_skills text[] not null default '{}',
  city text not null,
  work_mode text not null check(work_mode in ('presencial','híbrido','remoto')),
  availability text[] not null default '{}',
  benefits text[] not null default '{}',
  deadline date,
  first_job_friendly boolean not null default false,
  status text not null default 'active' check(status in ('active','closed','hidden')),
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  candidate_id uuid not null references auth.users(id) on delete cascade,
  stage public.application_stage not null default 'enviada',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(job_id, candidate_id)
);

create function public.has_applied(job uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.applications where job_id = job and candidate_id = (select auth.uid()));
$$;

create table public.application_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  from_stage public.application_stage,
  to_stage public.application_stage not null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  href text,
  dedupe_key text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, dedupe_key)
);

create table public.saved_jobs (
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, job_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  reason text not null check(length(reason) between 10 and 2000),
  status text not null default 'open' check(status in ('open','reviewed','dismissed')),
  created_at timestamptz not null default now()
);

create table public.admin_audit (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id),
  action text not null,
  target_id uuid,
  created_at timestamptz not null default now()
);

create table public.deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check(status in ('pending','completed')),
  requested_at timestamptz not null default now(),
  unique(user_id)
);

create index jobs_public_index on public.jobs(status, city, created_at desc);
create index applications_company_index on public.applications(job_id, stage);
create index notifications_user_index on public.notifications(user_id, created_at desc);

alter table public.account_roles enable row level security;
alter table public.candidate_profiles enable row level security;
alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.application_events enable row level security;
alter table public.notifications enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.reports enable row level security;
alter table public.admin_audit enable row level security;
alter table public.deletion_requests enable row level security;

-- Expose only the tables used by the app through the Data API. Row access is
-- still restricted by the RLS policies below.
grant usage on schema public to anon, authenticated;
grant select on public.jobs, public.companies to anon, authenticated;
grant select, insert, update on public.candidate_profiles to authenticated;
grant select, insert, update on public.companies to authenticated;
grant select, insert, update on public.jobs to authenticated;
grant select, insert on public.applications to authenticated;
grant select on public.application_events, public.notifications to authenticated;
grant select, insert, delete on public.saved_jobs to authenticated;
grant select, insert, update on public.reports to authenticated;
grant select, insert on public.admin_audit to authenticated;
grant select, insert on public.deletion_requests to authenticated;

create policy roles_read on public.account_roles for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
create policy roles_admin_update on public.account_roles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy profile_read on public.candidate_profiles for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
create policy profile_insert on public.candidate_profiles for insert to authenticated with check (user_id = (select auth.uid()) and exists(select 1 from public.account_roles where user_id = (select auth.uid()) and role = 'candidate' and not suspended));
create policy profile_update on public.candidate_profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy company_read on public.companies for select using (status = 'approved' or owner_id = (select auth.uid()) or public.is_admin());
create policy company_insert on public.companies for insert to authenticated with check (owner_id = (select auth.uid()) and status = 'pending' and exists(select 1 from public.account_roles where user_id = (select auth.uid()) and role = 'company' and not suspended));
create policy company_owner_update on public.companies for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy company_admin_update on public.companies for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy job_read on public.jobs for select using ((status = 'active' and (deadline is null or deadline >= current_date) and exists(select 1 from public.companies where id = company_id and status = 'approved')) or (status = 'closed' and public.has_applied(id)) or public.is_company_owner(company_id) or public.is_admin());
create policy job_insert on public.jobs for insert to authenticated with check (public.is_company_owner(company_id) and status = 'active');
create policy job_update on public.jobs for update to authenticated using (public.is_company_owner(company_id) or public.is_admin()) with check (public.is_company_owner(company_id) or public.is_admin());
create policy applications_read on public.applications for select to authenticated using (candidate_id = (select auth.uid()) or exists(select 1 from public.jobs where id = job_id and public.is_company_owner(company_id)) or public.is_admin());
create policy applications_insert on public.applications for insert to authenticated with check (candidate_id = (select auth.uid()) and stage = 'enviada' and exists(select 1 from public.account_roles where user_id = (select auth.uid()) and role = 'candidate' and not suspended) and exists(select 1 from public.jobs where id = job_id and status = 'active' and (deadline is null or deadline >= current_date)));
create policy events_read on public.application_events for select to authenticated using (exists(select 1 from public.applications where id = application_id and (candidate_id = (select auth.uid()) or exists(select 1 from public.jobs where id = job_id and public.is_company_owner(company_id)))) or public.is_admin());
create policy notification_read on public.notifications for select to authenticated using (user_id = (select auth.uid()));
create policy saved_read on public.saved_jobs for select to authenticated using (user_id = (select auth.uid()));
create policy saved_insert on public.saved_jobs for insert to authenticated with check (user_id = (select auth.uid()));
create policy saved_delete on public.saved_jobs for delete to authenticated using (user_id = (select auth.uid()));
create policy reports_read on public.reports for select to authenticated using (reporter_id = (select auth.uid()) or public.is_admin());
create policy reports_insert on public.reports for insert to authenticated with check (reporter_id = (select auth.uid()) and status = 'open');
create policy reports_admin_update on public.reports for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy audit_read on public.admin_audit for select to authenticated using (public.is_admin());
create policy audit_insert on public.admin_audit for insert to authenticated with check (public.is_admin() and actor_id = (select auth.uid()));
create policy deletion_read on public.deletion_requests for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
create policy deletion_insert on public.deletion_requests for insert to authenticated with check (user_id = (select auth.uid()) and status = 'pending');

-- Prevent clients from changing approval, ownership, candidate identity or application stage directly.
create function public.protect_company() returns trigger language plpgsql set search_path = '' as $$
begin
  if not public.is_admin() and (new.status is distinct from old.status or new.owner_id is distinct from old.owner_id) then
    raise exception 'Approval and ownership require an administrator';
  end if;
  return new;
end; $$;
create trigger protect_company before update on public.companies for each row execute function public.protect_company();

create function public.protect_job() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.company_id is distinct from old.company_id then raise exception 'Company cannot change'; end if;
  if old.status = 'hidden' and new.status <> 'hidden' and not public.is_admin() then raise exception 'Moderated job cannot be reopened'; end if;
  if old.status = 'closed' and new.status = 'active' and not public.is_admin() then raise exception 'Closed job cannot be reopened'; end if;
  return new;
end; $$;
create trigger protect_job before update on public.jobs for each row execute function public.protect_job();

create function public.close_job_applications() returns trigger language plpgsql security definer set search_path = '' as $$
declare changed record;
begin
  if old.status = 'active' and new.status in ('closed','hidden') then
    for changed in select id, candidate_id, stage from public.applications
      where job_id = new.id and stage not in ('contratado','nao_selecionado','encerrada','retirada') for update
    loop
      update public.applications set stage = 'encerrada', updated_at = now() where id = changed.id;
      insert into public.application_events(application_id, actor_id, from_stage, to_stage) values(changed.id, auth.uid(), changed.stage, 'encerrada');
      insert into public.notifications(user_id, kind, title, body, href, dedupe_key)
        values(changed.candidate_id, 'application', 'Vaga encerrada', new.title || ' não recebe mais candidaturas.', '/candidato/candidaturas', 'closed:' || new.id::text)
        on conflict(user_id, dedupe_key) do nothing;
    end loop;
  end if;
  return new;
end; $$;
create trigger close_job_applications after update of status on public.jobs for each row execute function public.close_job_applications();

create function public.apply_for_job(target_job uuid) returns uuid language plpgsql security definer set search_path = '' as $$
declare result uuid;
begin
  if not exists(select 1 from public.account_roles where user_id = auth.uid() and role = 'candidate' and not suspended) then raise exception 'Forbidden'; end if;
  if not exists(select 1 from public.candidate_profiles where user_id = auth.uid()) then raise exception 'Complete candidate profile first'; end if;
  insert into public.applications(job_id, candidate_id)
  select j.id, auth.uid() from public.jobs j join public.companies c on c.id = j.company_id where j.id = target_job and j.status = 'active' and c.status = 'approved' and (j.deadline is null or j.deadline >= current_date)
  on conflict(job_id, candidate_id) do nothing returning id into result;
  if result is null then raise exception 'Job unavailable or application already exists'; end if;
  insert into public.application_events(application_id, actor_id, to_stage) values(result, auth.uid(), 'enviada');
  return result;
end; $$;

create function public.move_application(target_application uuid, next_stage public.application_stage) returns void language plpgsql security definer set search_path = '' as $$
declare current_row public.applications%rowtype;
begin
  select * into current_row from public.applications where id = target_application for update;
  if not found then raise exception 'Application not found'; end if;
  if next_stage = 'retirada' then
    if current_row.candidate_id <> auth.uid() then raise exception 'Forbidden'; end if;
  elsif not exists(select 1 from public.jobs where id = current_row.job_id and public.is_company_owner(company_id)) then
    raise exception 'Forbidden';
  end if;
  if current_row.stage in ('contratado','nao_selecionado','encerrada','retirada') then raise exception 'Application is final'; end if;
  if current_row.stage = next_stage then raise exception 'Application is already in this stage'; end if;
  if next_stage <> 'retirada' and next_stage not in ('visualizada','analise','entrevista','agendada','aprovada','contratado','nao_selecionado','encerrada') then raise exception 'Invalid stage'; end if;
  update public.applications set stage = next_stage, updated_at = now() where id = target_application;
  insert into public.application_events(application_id, actor_id, from_stage, to_stage) values(target_application, auth.uid(), current_row.stage, next_stage);
  insert into public.notifications(user_id, kind, title, body, href, dedupe_key)
    values(current_row.candidate_id, 'application', 'Candidatura atualizada', 'Sua candidatura mudou para ' || next_stage::text, '/candidato/candidaturas', 'stage:' || target_application::text || ':' || next_stage::text)
    on conflict(user_id, dedupe_key) do nothing;
end; $$;

create function public.recommend_new_job() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.notifications(user_id, kind, title, body, href, dedupe_key)
  select p.user_id, 'job', 'Nova oportunidade para você', new.title || ' em ' || new.city, '/vagas/' || new.id::text, 'job:' || new.id::text
  from public.candidate_profiles p
  join public.account_roles r on r.user_id = p.user_id and r.role = 'candidate' and not r.suspended
  where new.status = 'active' and (lower(p.city) = lower(new.city) or new.work_mode = 'remoto')
    and (lower(p.desired_title) = lower(new.title) or (p.first_job and new.first_job_friendly))
  on conflict(user_id, dedupe_key) do nothing;
  return new;
end; $$;
create trigger recommend_job after insert on public.jobs for each row execute function public.recommend_new_job();

create function public.directory_search(search_city text default null, search_title text default null)
returns table(user_id uuid, full_name text, city text, desired_title text, skills text[], experience_months int, availability text[], work_modes text[])
language sql stable security definer set search_path = '' as $$
  select p.user_id, p.full_name, p.city, p.desired_title, p.skills, p.experience_months, p.availability, p.work_modes
  from public.candidate_profiles p
  where exists(select 1 from public.companies c where c.owner_id = auth.uid() and public.is_company_owner(c.id))
    and p.visible_in_directory
    and exists(select 1 from public.account_roles r where r.user_id = p.user_id and r.role = 'candidate' and not r.suspended)
    and (search_city is null or p.city ilike '%' || search_city || '%')
    and (search_title is null or p.desired_title ilike '%' || search_title || '%')
  limit 100;
$$;

create function public.company_applicants()
returns table(application_id uuid, job_id uuid, job_title text, candidate_name text, candidate_city text, candidate_title text, candidate_skills text[], stage public.application_stage, applied_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select a.id, j.id, j.title, p.full_name, p.city, p.desired_title, p.skills, a.stage, a.created_at
  from public.applications a
  join public.jobs j on j.id = a.job_id
  join public.candidate_profiles p on p.user_id = a.candidate_id
  where public.is_company_owner(j.company_id)
  order by a.created_at desc;
$$;

create function public.mark_notification(target_notification uuid) returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.notifications set read_at = now() where id = target_notification and user_id = auth.uid() and read_at is null;
end; $$;

revoke all on function public.apply_for_job(uuid) from public, anon;
revoke all on function public.move_application(uuid, public.application_stage) from public, anon;
revoke all on function public.directory_search(text,text) from public, anon;
revoke all on function public.company_applicants() from public, anon;
revoke all on function public.mark_notification(uuid) from public, anon;
revoke all on function public.create_account_role() from public, anon, authenticated;
revoke all on function public.protect_company() from public, anon, authenticated;
revoke all on function public.protect_job() from public, anon, authenticated;
revoke all on function public.close_job_applications() from public, anon, authenticated;
revoke all on function public.recommend_new_job() from public, anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_company_owner(uuid) to anon, authenticated;
grant execute on function public.has_applied(uuid) to authenticated;
grant execute on function public.apply_for_job(uuid) to authenticated;
grant execute on function public.move_application(uuid, public.application_stage) to authenticated;
grant execute on function public.directory_search(text,text) to authenticated;
grant execute on function public.company_applicants() to authenticated;
grant execute on function public.mark_notification(uuid) to authenticated;
