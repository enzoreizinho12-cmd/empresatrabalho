import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
export default async function Panel() {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase.from("account_roles").select("role,suspended").eq("user_id", user.id).single();
  if (error || !data) return <main className="container-page py-12"><p role="alert" className="error">Sua conta ainda está sendo preparada. Tente entrar novamente.</p></main>;
  if (data.suspended) return <main className="container-page py-12"><p role="alert" className="error">Esta conta está suspensa. Entre em contato com a administração.</p></main>;
  redirect(data.role === "admin" ? "/admin" : data.role === "company" ? "/empresa" : "/candidato");
}
