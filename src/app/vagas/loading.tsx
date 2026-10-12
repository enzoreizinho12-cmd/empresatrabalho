export default function JobsLoading() {
  return <main className="min-h-screen animate-pulse bg-slate-50 pb-16" aria-label="Carregando vagas">
    <section className="bg-gradient-to-br from-[#082d79] via-[#0755d9] to-[#087b5b] text-white"><div className="container-page py-14 sm:py-20"><div className="h-5 w-52 rounded-full bg-white/20"/><div className="mt-6 h-20 max-w-2xl rounded-2xl bg-white/20"/><div className="mt-4 h-12 max-w-xl rounded-xl bg-white/15"/><div className="mt-8 h-20 rounded-2xl bg-white/90"/></div></section>
    <section className="container-page py-9"><div className="h-8 w-60 rounded-lg bg-slate-200"/><div className="mt-6 grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]"><div className="h-[520px] rounded-2xl bg-white shadow-sm"/><div className="grid gap-4 sm:grid-cols-2">{[1, 2, 3, 4].map((item) => <div key={item} className="h-64 rounded-2xl bg-white shadow-sm"/> )}</div></div></section>
  </main>;
}
