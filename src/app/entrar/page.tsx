import Link from "next/link";
import { signIn } from "@/app/actions";
import { Feedback } from "@/components/feedback";

export default async function Login({ searchParams }: { searchParams: Promise<{ erro?: string; aviso?: string; next?: string }> }) {
  const params = await searchParams;
  const configured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return <main className="container-page max-w-lg py-16"><div className="card p-7 sm:p-9"><h1 className="text-3xl font-bold mb-2">Entrar</h1><p className="text-slate-600 mb-7">Acesse suas vagas, candidaturas e notificações da plataforma.</p><Feedback {...params}/>{!configured && <p className="notice mb-5">O ambiente Supabase de desenvolvimento ainda não foi configurado.</p>}<form action={signIn} className="grid gap-4">{params.next && <input type="hidden" name="next" value={params.next}/>}<div><label htmlFor="email" className="label">E-mail</label><input id="email" name="email" type="email" required className="field" autoComplete="email"/></div><div><label htmlFor="password" className="label">Senha</label><input id="password" name="password" type="password" required className="field" autoComplete="current-password"/></div><button disabled={!configured} className="btn btn-blue mt-2 disabled:opacity-50">Entrar</button></form><div className="flex flex-wrap justify-between gap-3 mt-6 text-sm"><Link href="/recuperar" className="text-blue-700">Esqueci minha senha</Link><Link href={params.next ? `/cadastro?tipo=candidate&next=${encodeURIComponent(params.next)}` : "/cadastro"} className="text-blue-700">Criar conta</Link></div></div></main>;
}
