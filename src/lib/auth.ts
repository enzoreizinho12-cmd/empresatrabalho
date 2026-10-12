import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect("/entrar?erro=Configure%20o%20Supabase%20para%20acessar%20o%20painel.");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");
  return { supabase, user };
}

export async function requireRole(role: "candidate" | "company" | "admin") {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("account_roles").select("role,suspended").eq("user_id", user.id).single();
  if (data?.role !== role || data?.suspended) redirect("/painel");
  return { supabase, user };
}
