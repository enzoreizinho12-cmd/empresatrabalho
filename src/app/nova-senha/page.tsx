import { updatePassword } from "@/app/actions";
import { Feedback } from "@/components/feedback";
export default async function NewPassword({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const params = await searchParams;
  return <main className="container-page max-w-lg py-16"><div className="card p-8"><h1 className="text-2xl font-bold mb-5">Nova senha</h1><Feedback erro={params.erro}/><form action={updatePassword} className="grid gap-4"><label htmlFor="password" className="label">Nova senha</label><input id="password" name="password" type="password" minLength={8} required className="field"/><button className="btn btn-blue">Atualizar senha</button></form></div></main>;
}
