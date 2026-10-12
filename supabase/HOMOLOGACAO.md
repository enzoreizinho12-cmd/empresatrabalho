# Homologação autenticada — PombalEmprega

## Projeto confirmado

O usuário confirmou que o projeto Supabase `nzaquzpwvbyvhorfibrt` é o staging isolado. `.env.local` ainda aponta para `vctcnxvoajszeqfffcah`; a suíte usa somente a URL/chave pública e contas de teste em `.env.homologation`, nunca essas credenciais de produção.

## Proteção contra gravações acidentais

A suíte verifica o ref fixado em `scripts/homologation.test.ts`, exige `POMBALEMPREGA_CONFIRM_STAGING` com o mesmo ref e também exige uma confirmação transitória no processo:

`POMBALEMPREGA_ALLOW_STAGING_WRITES=I_CONFIRM_STAGING_ISOLATED`

A confirmação transitória não está salva nos arquivos `.env`. O usuário confirmou o ambiente e a suíte autenticada foi executada. Criou/atualizou perfis, empresas, vagas e candidaturas fictícias. Esses registros permanecem no staging; não foram apagados.

## Resultado da execução

`npm run test:homologation`: **8/8 aprovados** depois de aplicar as migrations 002 e 003 no staging. A suíte cobriu compatibilidade/consentimento, duas empresas, candidaturas por RPC, duplicidade, identidade, notificações, etapas, suspensão de contas, escopo admin e isolamento RLS.

As migrations `202610120002_active_owner_update_policies.sql` e `202610120003_account_role_suspension_privilege.sql` foram aplicadas manualmente no staging. O teste confirmou que perfis e empresas não aceitam updates enquanto a conta está suspensa e que os valores permanecem inalterados. Produção não foi modificada. A suíte não valida atualização Realtime entre navegadores, email, push ou PWA em aparelhos reais.

## Contas e privacidade

As contas usadas são as cinco contas fictícias descritas nos nomes de variáveis `PE_TEST_*` do arquivo `.env.homologation`. Nunca exiba senha, chave ou token em logs/relatórios. Não copie dados pessoais reais para staging.
