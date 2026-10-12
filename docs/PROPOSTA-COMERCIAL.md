# Proposta comercial — PombalEmprega

## Visão do produto

O PombalEmprega conecta candidatos e empresas de Ribeira do Pombal e região por meio de busca pública, perfis profissionais, publicação de vagas e organização de candidaturas.

## Recursos disponíveis

- Busca pública de oportunidades com cidade, área, modalidade, experiência e tipo de contratação.
- Cadastro e perfil de candidato e empresa.
- Currículo digital baseado nas informações fornecidas pelo candidato e indicador real de preenchimento.
- Compatibilidade profissional calculada por critérios associados à vaga, apresentada como orientação.
- Vagas salvas, candidaturas e atualização de etapas.
- Painéis distintos para candidato, empresa e administração.
- Aprovação de empresa, moderação e notificações internas.
- Interface adaptável e base PWA instalável.

Os fluxos autenticados foram testados em Staging isolado (8/8 testes de homologação). O Preview Vercel está Ready, mas exige aprovação de acesso pela equipe. Production ainda não tem integração Supabase configurada e não deve ser apresentada como ambiente operacional.

## Benefícios

**Candidatos:** encontrar oportunidades da região, manter dados profissionais organizados e acompanhar candidaturas.

**Empresas:** publicar vagas após aprovação, organizar inscrições e buscar perfis que autorizaram visibilidade.

**Gestão:** moderar empresas e denúncias e acompanhar registros administrativos.

## Condições e escopo comercial

Preços, planos, quantidade de vagas, cobrança, suporte e SLA ainda não foram aprovados. Não anunciar checkout, pagamento ou condições ainda não contratadas.

## Piloto recomendado

1. Confirmar requisitos legais, responsáveis por dados e política de retenção.
2. Validar ambiente e acessos no Staging.
3. Convidar empresas e candidatos com consentimento explícito.
4. Medir indicadores sem coletar dados além do necessário.
5. Aprovar Production após revisão de segurança e operação.

## Limites apresentados ao cliente

Rotação da chave privilegiada anteriormente exposta precisa ser confirmada; a auditoria npm está pendente por falha TLS; PWA precisa de teste em aparelhos reais; Preview requer aprovação Vercel; Production ainda mostra Supabase não configurado.
