-- Reapply owner update policies so suspended accounts cannot mutate private
-- profile or company records through the Supabase Data API.
-- Safe to run after 202610110001_initial.sql; no data is changed.

drop policy if exists profile_update on public.candidate_profiles;
create policy profile_update on public.candidate_profiles
for update to authenticated
using (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.account_roles
    where user_id = (select auth.uid())
      and role = 'candidate'
      and not suspended
  )
)
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.account_roles
    where user_id = (select auth.uid())
      and role = 'candidate'
      and not suspended
  )
);

drop policy if exists company_owner_update on public.companies;
create policy company_owner_update on public.companies
for update to authenticated
using (
  owner_id = (select auth.uid())
  and exists (
    select 1 from public.account_roles
    where user_id = (select auth.uid())
      and role = 'company'
      and not suspended
  )
)
with check (
  owner_id = (select auth.uid())
  and exists (
    select 1 from public.account_roles
    where user_id = (select auth.uid())
      and role = 'company'
      and not suspended
  )
);
