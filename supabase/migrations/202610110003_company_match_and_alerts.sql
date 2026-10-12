-- Let approved employers discover only candidates who opted into the directory,
-- ranked in the application by the same deterministic matching algorithm.
create function public.company_job_candidates(target_job uuid)
returns table(
  user_id uuid,
  full_name text,
  city text,
  desired_title text,
  skills text[],
  experience_months int,
  education_level int,
  availability text[],
  work_modes text[],
  first_job boolean
)
language sql stable security definer set search_path = '' as $$
  select p.user_id, p.full_name, p.city, p.desired_title, p.skills,
    p.experience_months, p.education_level, p.availability, p.work_modes, p.first_job
  from public.jobs j
  join public.companies c on c.id = j.company_id
  join public.candidate_profiles p on p.visible_in_directory
  join public.account_roles r on r.user_id = p.user_id and r.role = 'candidate' and not r.suspended
  where j.id = target_job
    and j.status = 'active'
    and public.is_company_owner(c.id)
    and not exists (
      select 1 from public.applications a
      where a.job_id = j.id and a.candidate_id = p.user_id
    )
  limit 200;
$$;

revoke all on function public.company_job_candidates(uuid) from public, anon;
grant execute on function public.company_job_candidates(uuid) to authenticated;

-- Keep the candidate application and both parties' notification in one transaction.
create or replace function public.apply_for_job(target_job uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  result uuid;
  target_company_owner uuid;
  target_candidate_name text;
  target_job_title text;
begin
  if not exists(
    select 1 from public.account_roles
    where user_id = auth.uid() and role = 'candidate' and not suspended
  ) then raise exception 'Forbidden'; end if;

  if not exists(select 1 from public.candidate_profiles where user_id = auth.uid()) then
    raise exception 'Complete candidate profile first';
  end if;

  select c.owner_id, j.title into target_company_owner, target_job_title
  from public.jobs j
  join public.companies c on c.id = j.company_id
  where j.id = target_job and j.status = 'active' and c.status = 'approved'
    and (j.deadline is null or j.deadline >= current_date);
  if not found then raise exception 'Job unavailable'; end if;

  select p.full_name into target_candidate_name
  from public.candidate_profiles p where p.user_id = auth.uid();

  insert into public.applications(job_id, candidate_id)
  values(target_job, auth.uid())
  on conflict(job_id, candidate_id) do nothing
  returning id into result;
  if result is null then raise exception 'Application already exists'; end if;

  insert into public.application_events(application_id, actor_id, to_stage)
  values(result, auth.uid(), 'enviada');

  insert into public.notifications(user_id, kind, title, body, href, dedupe_key)
  values
    (auth.uid(), 'application', 'Candidatura enviada', 'Sua candidatura para ' || target_job_title || ' foi enviada.', '/candidato/candidaturas', 'application-sent:' || result::text),
    (target_company_owner, 'application', 'Nova candidatura', coalesce(target_candidate_name, 'Um candidato') || ' se candidatou à vaga ' || target_job_title || '.', '/empresa/candidaturas', 'application-received:' || result::text)
  on conflict(user_id, dedupe_key) do nothing;

  return result;
end;
$$;
