# Roadmap — PombalEmprega

## Recursos concluídos no código

- Página pública e navegação principal com Início em primeiro lugar.
- Busca de vagas com filtros e detalhe da oportunidade.
- Cadastro e login de candidato/empresa com Supabase Auth.
- Perfil profissional com cursos, habilidades, experiência, disponibilidade e controle de visibilidade.
- Cálculo determinístico de compatibilidade e vagas recomendadas.
- Candidaturas com prevenção de duplicidade, etapas e notificações internas.
- Painel do candidato, da empresa e do administrador.
- Aprovação de empresa antes da publicação; denúncias e auditoria administrativa.
- Selo de progresso do currículo calculado a partir de oito grupos preenchidos e orientações de conclusão.
- Manifesto PWA, service worker, cache estático limitado e tela offline.

## Em homologação

- Fluxos Supabase autenticados: 8/8 testes passaram no Staging isolado; continuar validação manual de cadastro, confirmação de email, login, recuperação de conta e experiência entre sessões.
- Preview Vercel conectado ao Staging e Ready. Aprovação do proprietário é necessária para contas sem acesso.
- Verificação de domínio/callbacks do Supabase Auth para o Preview.
- Instalação, atualização, offline e acessibilidade do PWA em aparelhos Android e iOS.
- Auditoria de dependências npm, bloqueada nesta execução por erro TLS ao consultar o registry.
- Revisão de produção: migrações, RLS, callbacks, segredos, retenção e plano de rollback.

## Melhorias futuras

- Currículo PDF com revisão de privacidade e teste de exportação.
- Alertas de vagas persistentes com preferências, deduplicação e entrega observável; push só após validar assinatura e recebimento.
- Fluxo separado de verificação empresarial com estado de revisão e selo somente após evidência administrativa.
- Indicadores de visualização e conversão de vagas, com métricas reais e retenção definida.
- Filtros e preferências avançados para recomendações, preservando transparência e revisão humana.
- Definição de planos, preços, suporte e termos comerciais.
- Teste E2E responsivo e auditoria de acessibilidade com ferramenta dedicada.
