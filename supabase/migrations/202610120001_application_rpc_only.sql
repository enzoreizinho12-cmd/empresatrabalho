-- Applications must be created through apply_for_job so the profile, event,
-- and notification checks run atomically for every client.
drop policy if exists applications_insert on public.applications;
revoke insert on table public.applications from public, anon, authenticated;

