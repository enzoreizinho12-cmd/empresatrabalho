import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return <main className="system-state container-page">
    <p className="system-state-code">404 · PÁGINA NÃO ENCONTRADA</p>
    <h1>Não encontramos esse endereço.</h1>
    <p>Confira o link ou volte para a página inicial para continuar procurando oportunidades.</p>
    <Link className="btn btn-blue" href="/">Ir para Início <ArrowRight size={16}/></Link>
  </main>;
}
