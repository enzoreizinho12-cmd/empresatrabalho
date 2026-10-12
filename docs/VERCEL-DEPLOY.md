# Deploy Vercel — PombalEmprega

## Configuração validada em 12/10/2026

- Projeto: `pombal-emprega` na equipe `enzoreizinho12-cmds-projects`.
- Repositório conectado: `enzoreizinho12-cmd/empresatrabalho`.
- Branch Production: `main`.
- Branch isolada de Preview: `codex/pombalemprega-preview`.
- Supabase para Preview: projeto Staging `nzaquzpwvbyvhorfibrt`.
- Variáveis Supabase cadastradas em Preview; a chave publicável está limitada à branch `codex/pombalemprega-preview`. Production não possui configuração Supabase.
- Não há `sb_secret`, `service_role` nem senha do banco em `NEXT_PUBLIC_*`.

## URL Preview

https://pombal-emprega-cp841aa6c-enzoreizinho12-cmds-projects.vercel.app/

O deployment verificado ficou Ready e foi classificado como Preview. Cada novo push para `codex/pombalemprega-preview` cria outra prévia. Confira a branch e o ambiente no painel antes de compartilhar a URL.

### Proteção de acesso

O Vercel solicita autenticação e aprovação da equipe para contas sem acesso. A página “Request Sent” significa que os proprietários foram avisados; a pessoa proprietária deve aprovar pelo email/painel. A proteção foi mantida e não deve ser desativada para contornar a solicitação.

## Production atual

Domínio: https://pombal-emprega.vercel.app/

O domínio permanece associado ao deployment anterior. Em 12/10/2026, a rota `/vagas` indicou que o Supabase não está configurado e não apresentou vagas. O domínio não foi atualizado nesta etapa. Não promover o Preview nem cadastrar Staging no ambiente Production.

## Variáveis utilizadas pelo código

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (nome legado no código; usar somente chave publicável/anon)
- `NEXT_PUBLIC_SITE_URL` (quando necessária para os links de autenticação)

Configure os valores em Preview com a referência do Staging e escopo de branch limitado. Cadastre valores próprios de Production somente após auditoria, migrations aprovadas, callbacks Auth e consentimento operacional.

## Validação realizada

- Deployment em Preview: Ready.
- Home, `/vagas` e `/entrar`: abertas no Preview com sessão autorizada.
- `/vagas`: exibiu seis registros de teste do Supabase Staging.
- Production `/vagas`: confirmou estado Supabase não configurado.
- Branch `main` permaneceu intacta; nenhuma promoção para Production ocorreu.

## Próximas etapas

1. Proprietário aprova o acesso de apresentação ao Preview.
2. Configurar allow-list de URLs de Auth no Staging para o hostname do Preview e testar confirmação/recuperação de email.
3. Resolver erro de certificado TLS do npm registry e concluir auditoria de dependências.
4. Não alterar Production até confirmação da chave exposta, segurança, migrations e credenciais separadas.
