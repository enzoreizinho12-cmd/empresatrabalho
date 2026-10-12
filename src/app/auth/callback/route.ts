import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/painel";
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: account } = await supabase.from("account_roles").select("role,suspended").eq("user_id", user.id).maybeSingle();
        const metadata = user.user_metadata ?? {};
        if (account?.role === "candidate" && !account.suspended) {
          const profile = metadata.candidate_profile;
          if (profile && typeof profile.full_name === "string" && typeof profile.city === "string") {
            const { data: existing } = await supabase.from("candidate_profiles").select("user_id").eq("user_id", user.id).maybeSingle();
            if (!existing) {
              const { error: saveError } = await supabase.from("candidate_profiles").insert({
                user_id: user.id, full_name: profile.full_name, phone: profile.phone,
                city: profile.city, neighborhood: profile.neighborhood,
              });
              if (saveError) return NextResponse.redirect(new URL("/candidato/perfil?erro=Conclua+seu+curr%C3%ADculo+para+continuar.", url.origin));
            }
          }
        } else if (account?.role === "company" && !account.suspended) {
          const profile = metadata.company_profile;
          if (profile && typeof profile.company_name === "string" && typeof profile.city === "string") {
            const { data: existing } = await supabase.from("companies").select("id").eq("owner_id", user.id).maybeSingle();
            if (!existing) {
              const { error: saveError } = await supabase.from("companies").insert({ owner_id: user.id, name: profile.company_name, city: profile.city });
              if (saveError) return NextResponse.redirect(new URL("/empresa/perfil?erro=Conclua+o+perfil+da+empresa+para+continuar.", url.origin));
            }
          }
        }
      }
      return NextResponse.redirect(new URL(next.startsWith("/") && !next.startsWith("//") ? next : "/painel", url.origin));
    }
  }
  return NextResponse.redirect(new URL("/entrar?erro=Link%20inválido%20ou%20expirado.", url.origin));
}
