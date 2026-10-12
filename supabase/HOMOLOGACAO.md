# Homologação autenticada (staging)

O teste `npm run test:homologation` usa a chave pública configurada em `.env.local` e cinco contas de teste já confirmadas. Não cria usuários nem envia e-mails. Ele recusa qualquer URL cujo ref não seja o staging esperado `vctcnxvoajszeqfffcah` e exige confirmação explícita do mesmo ref em `.env.homologation`.

## Preparação única no staging

1. Confirme no painel Supabase que o projeto `vctcnxvoajszeqfffcah` é exclusivo de homologação. Não rode o teste em produção.
2. Crie manualmente no Auth cinco usuários fictícios com e-mail confirmado e metadados `{"role":"candidate"}` para João e Maria, `{"role":"company"}` para as duas empresas e conta de administrador exclusiva. Use endereços de domínio reservado, por exemplo `@homologacao.invalid`, e não selecione envio de convite.
3. O trigger cria João e Maria como candidatos e as empresas como empresas. Para o admin, execute no SQL Editor do staging, depois de confirmar o ref:

   ```sql
   update public.account_roles ar
   set role = 'admin', suspended = false
   from auth.users u
   where ar.user_id = u.id
     and lower(u.email) = lower('admin@homologacao.invalid');
   ```

4. Copie `.env.homologation.example` para `.env.homologation` e informe e-mails/senhas dessas contas. O arquivo é ignorado pelo Git. Nunca use a chave secreta; o teste usa somente `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Execute `npm run test:homologation`.

## O que o teste verifica

Com sessões autenticadas distintas, cria/atualiza perfis fictícios, registra duas empresas e duas vagas, aprova as empresas com a conta admin de teste, exercita consentimento e ranking de compatibilidade, candidaturas e duplicidade, identidade da sessão, isolamento de perfis/vagas/candidaturas/notificações, atualização de etapa e encerramento de vaga.

Os registros de homologação permanecem no staging para auditoria. Cada execução cria vagas com título único; não apaga contas nem dados. Se algum pré-requisito ou controle falhar, o teste falha e informa a verificação correspondente.

## Bloqueio administrativo atual

A conta Supabase conectada ao navegador não tem acesso ao projeto. Para rodar o teste, autentique o painel com a conta proprietária ou conceda a essa conta acesso ao projeto e ao SQL Editor. A chave secreta que foi exposta deve ser substituída e revogada pelo proprietário no painel; este teste não a consome.
