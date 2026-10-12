import Link from "next/link";
import { markNotification } from "@/app/actions";
import { requireRole } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";
export default async function CandidateNotifications() {
  const { supabase, user } = await requireRole("candidate");
  const { data: notifications } = await supabase.from("notifications").select("id,title,body,href,read_at,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
  return <main className="container-page py-10 mobile-bottom"><div className="grid sm:grid-cols-[220px_1fr] gap-7"><DashboardNav role="candidate"/><div><h1 className="text-3xl font-black mb-6">Notificações</h1>{notifications?.length ? <div className="grid gap-3">{notifications.map(item => <div key={item.id} className={`card p-5 ${item.read_at ? "opacity-70" : "border-blue-300"}`}><div className="flex justify-between gap-3"><strong>{item.title}</strong><time className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString("pt-BR")}</time></div><p className="text-slate-600 mt-2">{item.body}</p><div className="flex gap-4 mt-4 text-sm">{item.href && <Link href={item.href} className="text-blue-700 font-bold">Ver detalhes</Link>}{!item.read_at && <form action={markNotification}><input type="hidden" name="notification_id" value={item.id}/><button className="text-slate-600">Marcar como lida</button></form>}</div></div>)}</div> : <p className="card p-6 text-slate-600">Nenhuma notificação ainda.</p>}</div></div></main>;
}
