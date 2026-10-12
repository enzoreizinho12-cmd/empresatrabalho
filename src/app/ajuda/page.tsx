import type { Metadata } from "next";
import HelpCenter from "./help-center";

export const metadata: Metadata = {
  title: "Ajuda | Pombal Emprega",
  description: "Encontre orientações sobre sua conta, currículo, vagas, candidaturas, empresas e privacidade no Pombal Emprega.",
};

export default function HelpPage() {
  return <main className="overflow-hidden bg-white text-slate-900"><HelpCenter/></main>;
}
