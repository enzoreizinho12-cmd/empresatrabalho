import { requestPasswordReset } from "@/app/actions";
import { Feedback } from "@/components/feedback";
export default async function Recover({ searchParams }: { searchParams: Promise<{ erro?: string; aviso?: string }> }) {
  const params = await searchParams;
  return <main className="container-page max-w-lg py-16"><div className="card p-8"><h1 className="text-2xl font-bold mb-5">Recuperar acesso</h1><Feedback {...params}/><form action={requestPasswordReset} className="grid gap-4"><label htmlFor="email" className="label">E-mail da conta</label><input id="email" name="email" type="email" required className="field"/><button className="btn btn-blue">Enviar link</button></form></div></main>;
}
