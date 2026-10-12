-- Allow active platform administrators to change only the suspension flag.
-- The existing roles_admin_update RLS policy limits affected rows to active admins.
grant update (suspended) on public.account_roles to authenticated;
