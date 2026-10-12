# Deploy Vercel — PombalEmprega

## Estado em 12/10/2026

Build local aprovado (`npm run build`), testes unitários 20/20, lint aprovado e testes autenticados no Supabase staging 8/8. Nenhum deploy foi criado.

O painel Vercel aberto não tem projeto PombalEmprega na equipe selecionada. O uso da equipe mostra `Exceeded free resources`, com 14,33 GB de armazenamento de deployments para franquia de 10 GB. O repositório de origem é `enzoreizinho12-cmd/empresatrabalho`, mas a integração GitHub disponível está autorizada para outro escopo. Conectar a conta correta exige verificação de identidade por e-mail; o importador atual, sem essa conexão, propõe criar uma cópia do repositório. Essa cópia não foi criada.

## Para desbloquear

1. Concluir a instalação da integração Vercel no GitHub do proprietário `enzoreizinho12-cmd`, restringindo o acesso ao repositório `empresatrabalho`.
2. Liberar espaço de deployments na equipe Vercel ou resolver a franquia excedida. Não apagar deployments antigos sem identificar quais podem ser removidos.
3. Criar/vincular o projeto Vercel ao repositório existente, sem gerar uma cópia.
4. Configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_SITE_URL` para o ambiente pretendido. Preview deve usar staging. Não cadastrar `sb_secret`, `service_role`, senha de banco ou chave privada em variáveis `NEXT_PUBLIC_*`.
5. Verificar as migrations necessárias no Supabase alvo. As migrations de suspensão 002 e 003 foram aplicadas e testadas apenas no staging confirmado; produção não foi alterada nesta etapa.
6. Executar Preview HTTPS e validar Auth/callbacks antes de promover para produção.

## Variáveis usadas pelo código

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (chave publicável/anon; nome legado no código)
- `NEXT_PUBLIC_SITE_URL`

Nenhum valor de `.env` é incluído neste documento.
