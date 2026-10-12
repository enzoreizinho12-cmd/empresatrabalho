# Estado de lançamento — PombalEmprega

**Atualizado:** 12/10/2026

## Classificação atual

- **Desenvolvimento: APTO COM RESSALVAS.** 24 testes unitários, lint, TypeScript, build de produção e auditoria estática PWA passaram nesta revisão. A auditoria do npm não conseguiu consultar o registry por erro TLS.
- **Supabase Staging: APTO COM RESSALVAS.** O ref `nzaquzpwvbyvhorfibrt` foi confirmado como isolado. A suíte autenticada passou com 8/8 testes nesta revisão, incluindo isolamento, candidaturas, notificações e suspensão. Os registros de teste são fictícios e permanecem no staging.
- **Vercel Preview: APTO COM RESSALVAS.** Deployment Ready na branch `codex/pombalemprega-preview`; home, vagas e login foram verificadas. A rota `/vagas` carregou seis registros de homologação. O Preview exige aprovação dos proprietários da equipe Vercel para contas sem acesso.
- **PWA: APTO COM RESSALVAS.** Manifesto, service worker, tela offline e quatro ícones passaram auditoria estática. Instalação e comportamento em aparelhos físicos não foram verificados.
- **Segurança para produção: NÃO APTO.** Ainda não foi confirmada a rotação da chave `sb_secret` anteriormente exposta; produção não foi migrada nem ligada ao Supabase nesta etapa.
- **Production: NÃO APTO.** O domínio `pombal-emprega.vercel.app` ainda informa que o Supabase não está configurado em `/vagas` e não exibe oportunidades.
- **Apresentação comercial: APTO COM RESSALVAS.** O produto pode ser demonstrado no Preview após aprovação de acesso, com recursos de homologação identificados. Condições comerciais e validação legal permanecem pendentes.

## Evidência executada nesta revisão

- `npm test`: 24/24 testes unitários aprovados.
- `npm run test:homologation`: 8/8 testes autenticados no Supabase Staging confirmado. A guarda de escrita foi habilitada apenas no processo desta execução.
- `npm run lint`: aprovado.
- `npx tsc --noEmit`: aprovado.
- `npm run audit:pwa`: aprovado; manifesto, rotas privadas/APIs, service worker e quatro ícones.
- `npm run build`: aprovado; 31 rotas geradas.
- `npm audit --omit=dev --audit-level=high`: **não concluído**, porque o registry apresentou `unable to verify the first certificate`. A validação TLS não foi desativada.
- Vercel Preview: deployment Ready na branch isolada. Home, `/vagas` e `/entrar` abriram. `/vagas` exibiu seis vagas fictícias de staging.
- Vercel Production: leitura direta de `/vagas` confirmou aviso de Supabase não configurado e zero oportunidades.

## Pendências

- Confirmar com o proprietário que a chave secreta exposta foi revogada e substituída no projeto correto.
- Auditar produção e aplicar nela migrations manualmente só após aprovação; nenhuma migration foi executada nesta revisão.
- Aprovar a solicitação de acesso ao Preview enviada pelo painel Vercel. O controle de proteção foi mantido.
- Completar a auditoria de dependências quando o acesso TLS ao registry estiver operacional.
- Verificar autenticação por email, recuperação de senha e redirecionamentos no domínio público do Preview.
- Testar instalação, navegação offline, atualizações, responsividade e acessibilidade em aparelhos reais.
- Definir responsáveis por dados, termos, privacidade, retenção, preços, limites e suporte.
- Funcionalidades não implementadas ou não verificadas: exportação de currículo em PDF, push notifications, selo de empresa verificada baseado em revisão independente, métricas de visualizações e testes completos de teclado/PWA em aparelhos.

## Limite do deploy

Somente a branch de Preview foi atualizada. `main` e o banco de produção não foram alterados. O domínio de produção continua no deployment anterior.
