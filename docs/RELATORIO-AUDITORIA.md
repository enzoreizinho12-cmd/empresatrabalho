# Relatório de auditoria — PombalEmprega

**Data:** 12/10/2026
**Escopo:** código local, build, autenticação, Supabase, PWA e preparação de apresentação. Nenhum deploy foi feito. O staging `nzaquzpwvbyvhorfibrt` foi confirmado pelo usuário como isolado; os testes autenticados gravaram somente nele.

## Resultado resumido

| Área | Situação | Evidência |
|---|---|---|
| Código local | **APTO COM RESSALVAS** | `npm test` (20/20), lint, TypeScript e build de produção passaram. |
| PWA | **APTO COM RESSALVAS** | Auditoria estática aprovada; instalação/offline em aparelhos reais não verificada. |
| Supabase e fluxos autenticados | **APTO COM RESSALVAS** | 8/8 testes autenticados passaram no staging confirmado depois da aplicação das migrations 002 e 003. Cobrem duas contas candidatas, duas empresas e admin. |
| Vercel Preview | **NÃO VALIDADO** | Não houve deploy; não há configuração local `.vercel` nem CLI para provar vínculo. |
| Segurança para lançamento | **NÃO APTO** | As migrations de suspensão foram aplicadas no staging e o reteste passou; produção não foi migrada/verificada nesta etapa e a rotação da chave secreta anteriormente exposta não foi confirmada. |
| Demonstração comercial | **APTO COM RESSALVAS** | Roteiro e proposta preparados; preços e condições não definidos. |

## O que foi encontrado

- Next.js App Router 16.4.0, React 19, TypeScript e Supabase Auth via `@supabase/ssr`; seis migrations de banco existem agora no projeto local, incluindo as duas migrations desta etapa.
- O schema local define 11 entidades. RLS restringe leitura/escrita por papel. Candidaturas transacionais passam por RPC; a migration `202610120001_application_rpc_only.sql` remove inserção direta.
- O cliente usa somente URL e chave publicável. A busca local não encontrou `sb_secret` nem `service_role` em código/scripts; valores de arquivos `.env` não foram exibidos.
- `.env.example` é genérico e `.gitignore` ignora `.env*`, exceto exemplos sem credenciais.
- O projeto tem manifesto, service worker com cache limitado a arquivos estáticos, tela offline e ícones 192, 512, maskable 512 e Apple 180.
- Foram adicionados `robots.ts`, `sitemap.ts`, `metadataBase` e telas próprias de erro/404. O sitemap lista páginas públicas principais e `/vagas`; não contém URLs individuais das vagas nem páginas privadas.
- Textos de demonstração estão marcados como prévias/ilustrativos. Preços, limites e condições comerciais não foram definidos.

## Correções desta etapa

1. O callback aceitava caminhos com barras invertidas que podiam escapar para outro host. Agora destinos são resolvidos e comparados à origem; barras codificadas são recusadas.
2. Links de confirmação e recuperação usam URL validada; Vercel Preview usa o hostname da implantação. Localhost é recusado no runtime de produção Vercel.
3. Ações de servidor deixaram de expor mensagens técnicas brutas do Supabase.
4. As migrations `202610120002_active_owner_update_policies.sql` e `202610120003_account_role_suspension_privilege.sql` foram aplicadas manualmente no staging e verificadas pela suíte autenticada 8/8.
5. A suíte integrada exige confirmação explícita por execução antes de permitir gravações. As migrations 002 e 003 foram aplicadas somente no staging.

## Testes autenticados no staging

O usuário confirmou `nzaquzpwvbyvhorfibrt` como staging isolado. Os cinco usuários fictícios e a chave publicável estavam configurados localmente. `npm run test:homologation` passou com 8/8 após a migration 003. O caso de suspensão confirmou bloqueio de atualizações de perfil e empresa.

- ranking determinístico e consulta apenas de candidatos com consentimento;
- bloqueio de uma empresa consultando candidatos de vaga de outra;
- candidatura somente via RPC, rejeição de duplicidade e de identidade forjada;
- isolamento de perfis, candidaturas, notificações e vagas entre contas;
- notificação aos destinatários, movimentação de etapa, encerramento de vaga e bloqueio de nova candidatura após fechamento;
- bloqueio de alteração de papéis por contas comuns e escopo de administração;
- encerramento das sessões de teste.

O teste criou/atualizou perfis, empresas e vagas fictícias e registrou candidaturas no staging. Os dados permanecem no staging para auditoria. Não foram usadas contas ou dados pessoais de produção.

## Limites e riscos pendentes

- `.env.local` ainda referencia `vctcnxvoajszeqfffcah`; `.env.homologation` e suíte usam `nzaquzpwvbyvhorfibrt`. A confirmação do usuário identifica o segundo como staging isolado. Não houve gravação no primeiro.
- A policy RLS e o privilégio mínimo de `UPDATE (suspended)` foram aplicados e verificados no staging. As mesmas migrations ainda precisam de avaliação/aplicação no banco de produção antes de promover mudanças que dependam delas. Também não é um teste de atualização Realtime entre navegador cliente e painel web.
- Não houve teste de email, instalação PWA em iOS/Android, dispositivos físicos ou métricas Lighthouse/Core Web Vitals.
- `npm audit --omit=dev --audit-level=high` falhou ao acessar o registry por certificado TLS (`unable to verify the first certificate`). A validação TLS não foi desativada; CVEs de dependências continuam sem resultado.
- Uma chave `sb_secret` foi compartilhada anteriormente. Não foi rotacionada nesta sessão; considere-a comprometida até o proprietário confirmar sua revogação no projeto correto.
- O deploy solicitado não foi concluído: a equipe Vercel não contém projeto PombalEmprega, mostra armazenamento de deployments excedido (14,33 GB/10 GB) e a instalação GitHub para o proprietário do repositório está pendente de verificação de identidade.

## Verificações locais

- `npm test`: 3 arquivos, 20 testes aprovados.
- `npm run lint`: aprovado.
- `npx tsc --noEmit`: aprovado.
- `npm run audit:pwa`: aprovado.
- `npm run build`: compilação, TypeScript e geração das 31 rotas concluídos em diretório isolado, sem interferir nos servidores locais já abertos.
- `git diff --check`: sem erros de whitespace; Git emitiu somente avisos de normalização LF/CRLF.

## Próximas etapas

1. Conectar o projeto Vercel ao repositório existente e resolver a quota de armazenamento excedida.
2. Antes de produção, verificar/aplicar manualmente as migrations necessárias no Supabase alvo e configurar as variáveis Vercel do ambiente escolhido.
3. Rotacionar/revogar a chave secreta exposta e confirmar.
4. Configurar e validar Vercel Preview isolado, domínio HTTPS e callbacks Auth.
5. Testar instalação PWA, responsividade e recuperação de erro em aparelhos reais.
6. Concluir revisão legal, privacidade, retenção e termos comerciais.
