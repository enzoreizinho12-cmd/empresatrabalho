export function Feedback({ erro, aviso }: { erro?: string; aviso?: string }) {
  return <>{erro && <p role="alert" className="error mb-5">{erro}</p>}{aviso && <p role="status" className="notice mb-5">{aviso}</p>}</>;
}
