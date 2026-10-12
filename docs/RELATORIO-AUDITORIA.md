# Relatório de auditoria — PombalEmprega

**Revisão:** 12/10/2026
**Escopo:** aplicação Next.js, fluxos do Supabase Staging confirmado, build, PWA e deployments Vercel. Produção foi consultada somente por HTTP; nenhuma escrita foi realizada.

## Resultado

| Área | Situação | Evidência |
|---|---|---|
| Código local | APTO COM RESSALVAS | 24/24 unitários, lint, TypeScript e build aprovados. |
| Busca e dados Preview | APTO COM RESSALVAS | `/vagas` no Preview retornou seis vagas de staging. |
| Supabase Staging | APTO COM RESSALVAS | 8/8 testes autenticados de isolamento, candidatura, etapas, notificações e suspensão. |
| PWA | APTO COM RESSALVAS | Auditoria estática aprovada; não houve ensaio em aparelhos reais. |
| Vercel Preview | APTO COM RESSALVAS | Deployment Ready e rotas públicas testadas. O acesso externo depende da aprovação Vercel. |
| Vercel Production | NÃO APTO | `/vagas` mostra que Supabase não está configurado; zero oportunidades. |
| Segurança para lançamento | NÃO APTO | Rotação da chave secreta exposta não confirmada e produção não auditada/migrada. |

## O que já existe

- Next.js App Router 16.4.0, React 19, TypeScript, Supabase Auth via `@supabase/ssr` e seis migrations no repositório.
- Perfis distintos de candidato, empresa e administrador; perfis, vagas, candidaturas, favoritos, notificações internas, denúncias e pedidos de exclusão.
- Busca pública de vagas, filtros e cálculo determinístico de compatibilidade profissional.
- Candidatura por RPC com prevenção de duplicidade e notificações internas transacionais.
- Painéis para candidato, empresa e administração; empresa só publica depois da aprovação administrativa.
- RLS coberta pela suíte de homologação em cenários de usuários e empresas separados.
- PWA com manifesto, service worker, cache limitado a recursos estáticos, fallback offline e ícones para instalação.

## Alterações desta revisão

- Adicionado cálculo explícito da completude do currículo em oito grupos de dados realmente existentes: nome, cidade, interesse profissional, habilidades, experiência ou primeiro emprego, escolaridade/formação, disponibilidade e modalidade.
- O painel do candidato agora apresenta até três próximos passos concretos. O formulário do currículo exibe a porcentagem e a primeira recomendação.
- Atualizado o relatório de lançamento e criados roteiro comercial e roadmap com estados que distinguem funcionalidades prontas, homologação e trabalho futuro.
- Nenhuma migration foi necessária ou executada. Não houve alteração de schema ou de produção.

## Testes realizados

- `npm test`: 24 testes passaram em quatro arquivos.
- `npm run test:homologation`: 8 testes passaram em uma suíte autenticada no projeto `nzaquzpwvbyvhorfibrt`, confirmado como Staging. A guarda de escrita foi habilitada apenas para essa execução. A suíte cria dados fictícios no staging.
- `npm run lint`: passou.
- `npx tsc --noEmit`: passou.
- `npm run audit:pwa`: passou para manifesto, service worker, rotas privadas/APIs e quatro ícones.
- `npm run build`: passou e gerou 31 rotas.
- `npm audit --omit=dev --audit-level=high`: não foi possível concluir; o registry rejeitou o certificado TLS. Nenhuma configuração de validação TLS foi enfraquecida.
- Preview: carregaram home, `/vagas` e `/entrar`; a busca exibiu seis registros fictícios persistidos no staging.
- Production: `/vagas` foi consultada e exibiu estado de Supabase não configurado.

## Achados e limites

1. **Preview requer aprovação Vercel.** A URL do deployment responde quando a sessão tem acesso; uma conta sem permissão vê “Request Sent” e precisa de aprovação do proprietário. A proteção não foi desativada.
2. **Production ainda não é operacional.** A página `/vagas` confirma falta de configuração Supabase. Não se deve apontar Production para Staging.
3. **Chave privilegiada exposta anteriormente.** Não foi confirmada rotação/revogação da chave `sb_secret`; trate-a como comprometida até confirmação do proprietário.
4. **Auditoria npm incompleta.** Erro TLS de registry impediu obter advisories.
5. **PWA precisa de ensaio físico.** Auditoria estática não substitui instalação e teste real em Safari iOS e Chrome Android.
6. **Lacunas de produto.** Exportação de currículo em PDF, push recebida, selo de verificação empresarial com revisão independente e métricas de visualização não foram encontrados como fluxos completos.
7. **Dados de demonstração.** O Preview exibe vagas fictícias do staging, não dados de usuários reais.

## Segurança e produção

- O frontend usa somente chave publicável; nenhum segredo de servidor foi adicionado às variáveis `NEXT_PUBLIC_*` nesta revisão.
- `.env*` permanece ignorado pelo Git. Valores de credenciais não foram exibidos.
- Os testes autenticados verificaram isolamento no staging, mas não equivalem a uma auditoria independente de políticas em produção.
- Não houve migration, escrita, publicação ou promoção em Production.
