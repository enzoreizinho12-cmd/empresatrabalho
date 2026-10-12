# Deploy Vercel — PombalEmprega

## Estado em 12/10/2026

O projeto `pombal-emprega` está conectado ao repositório existente `enzoreizinho12-cmd/empresatrabalho`. A branch `codex/pombalemprega-preview` contém o commit `a70899c`; a branch `main` permanece intacta. O Vercel está configurado para usar `main` como branch de Production.

As variáveis de Supabase estão isoladas no Preview: `NEXT_PUBLIC_SUPABASE_URL` usa o projeto Staging `nzaquzpwvbyvhorfibrt`, e `NEXT_PUBLIC_SUPABASE_ANON_KEY` está limitada à branch `codex/pombalemprega-preview`. Production não tem variáveis Supabase cadastradas. Nenhum segredo ou chave de servidor foi enviado ao Vercel.

O primeiro build da branch foi rotulado pelo Vercel como Production e publicado em `https://pombal-emprega.vercel.app`. A página inicial abre, mas `/vagas` e `/entrar` avisam que o Supabase não está configurado. A branch de Production está definida como `main`, mas o primeiro deployment ainda precisa ser substituído por uma prévia claramente rotulada e validada. Não promover a prévia para Production até confirmar o esquema e as migrations no banco de produção.

Build local aprovado (`npm run build`), testes unitários 20/20, lint aprovado e testes autenticados no Supabase staging 8/8. A migrations 002 e 003 foram aplicadas e testadas apenas no Staging; produção não foi alterada nesta etapa.

## Próximas etapas

1. Gerar um novo deployment após a configuração das variáveis e confirmar que `codex/pombalemprega-preview` aparece como Preview.
2. Abrir a URL de Preview e validar home, vagas, cadastro, login, PWA e fluxos autenticados com o Supabase Staging.
3. Configurar URLs de callback do Supabase Staging para o domínio de Preview, se necessário.
4. Antes de produção, confirmar o esquema/migrations no Supabase de produção e cadastrar somente as variáveis de produção corretas em Production.

## Variáveis usadas pelo código

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (chave publicável/anon; nome legado no código)
- `NEXT_PUBLIC_SITE_URL`

Nenhum valor de `.env` é incluído neste documento. Nunca cadastrar `sb_secret`, `service_role`, senha do banco ou chave privada em variável `NEXT_PUBLIC_*`.
