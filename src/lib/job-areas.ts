export const jobAreas = {
  alimentacao: { label: "Restaurantes e Alimentação", terms: ["restaurante", "cozinha", "cozin", "garç", "aliment", "pizz", "confeit", "barista"] },
  comercio: { label: "Comércio e Vendas", terms: ["vendedor", "vendas", "loja", "comércio", "caixa", "atendent"] },
  construcao: { label: "Construção Civil", terms: ["obra", "constru", "pedreiro", "eletric", "encanador", "pintor"] },
  saude: { label: "Saúde e Estética", terms: ["saúde", "enferm", "farmácia", "estética", "beleza", "cabeleir"] },
  educacao: { label: "Educação", terms: ["professor", "educa", "escola", "pedagog", "instrutor"] },
  transporte: { label: "Transporte e Logística", terms: ["motorista", "entrega", "logíst", "transporte", "estoque"] },
  administrativo: { label: "Administrativo", terms: ["administ", "assistente", "escritório", "recepcion", "financeiro"] },
  servicos: { label: "Serviços Gerais", terms: ["serviç", "limpeza", "manuten", "auxiliar", "zelador"] },
} as const;

export type JobArea = keyof typeof jobAreas;

export function isJobArea(value: string | undefined): value is JobArea {
  return Boolean(value && Object.hasOwn(jobAreas, value));
}
