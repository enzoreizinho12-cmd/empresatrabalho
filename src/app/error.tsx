"use client";

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <main className="system-state container-page" role="alert">
    <p className="system-state-code">ERRO TEMPORÁRIO</p>
    <h1>Não foi possível carregar esta página.</h1>
    <p>Tente novamente. Seus dados e credenciais não são exibidos nesta mensagem.</p>
    <button className="btn btn-blue" onClick={() => retry()}>Tentar novamente</button>
  </main>;
}
