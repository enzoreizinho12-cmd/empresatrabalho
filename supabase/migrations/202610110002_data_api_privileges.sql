-- Correct missing Data API permissions used by the application.
-- RLS continues to constrain account_roles and saved_jobs to the current user.
grant select on public.account_roles to authenticated;

grant update on public.saved_jobs to authenticated;

create policy saved_update
  on public.saved_jobs
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
