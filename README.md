# Pombal Emprega

Plataforma de recrutamento em Next.js, TypeScript, Tailwind CSS e Supabase. Este repositório começou vazio. A primeira entrega implementa a base de autenticação, perfis, aprovação de empresas, vagas, candidaturas, compatibilidade determinística, notificações internas, diretório profissional consentido e administração básica.

## Plano técnico e arquitetura

1. **Identidade e navegação:** landing page e ambientes responsivos de candidato (azul) e empresa (verde), guiados pela referência visual fornecida. A navegação principal fica embaixo no celular e na lateral em telas maiores.
2. **Dados e permissões:** Supabase Auth, tabelas relacionais e RLS. A chave pública fica no navegador; nenhuma chave `service_role` é necessária. Operações que exigem regras transacionais usam funções SQL com validação de identidade.
3. **Fluxo do candidato:** cadastro, currículo, descoberta de vagas, pontuação explicada, candidatura, acompanhamento e notificações internas.
4. **Fluxo da empresa:** cadastro sujeito a aprovação, publicação de vagas, candidaturas e busca no diretório com autorização do candidato.
5. **Administração:** acesso pelo papel `admin`, aprovação/bloqueio de empresas, consulta a denúncias e auditoria.
6. **Homologação:** aplicar a migration somente em projeto novo de desenvolvimento ou staging; criar contas de teste; validar RLS entre usuários e empresas, e então avançar para comunicação, entrevistas, exportação e PWA.

### Entidades implementadas

`account_roles`, `candidate_profiles`, `companies`, `jobs`, `applications`, `application_events`, `notifications`, `saved_jobs`, `reports`, `admin_audit` e `deletion_requests`. As políticas e funções estão em [202610110001_initial.sql](supabase/migrations/202610110001_initial.sql).

### Compatibilidade

O algoritmo em `src/lib/match.ts` tem versão `1.0.0` e usa pesos fixos: cargo 20, cidade/remoto 15, habilidades obrigatórias 25, desejáveis 10, experiência 10, escolaridade 5, disponibilidade 10 e modalidade 5. Cada resultado mostra motivos favoráveis e lacunas. A pontuação não usa nome, foto, idade ou gênero, nem impede candidaturas. Notificações de novas vagas usam um filtro inicial mais estrito de cidade/cargo ou primeiro emprego; a pontuação completa é calculada ao exibir a vaga.

## Configuração local

Requer Node.js e npm. Crie **um projeto Supabase novo e isolado** para desenvolvimento ou staging. Não vincule este repositório a um projeto existente sem autorização explícita.

1. Preencha `.env.local` com a URL, a chave pública (`anon`/publishable) e `NEXT_PUBLIC_SITE_URL`. As credenciais do projeto Supabase informado já estão configuradas neste arquivo local ignorado pelo Git.
2. No painel do Supabase, abra **SQL Editor** e execute, em ordem, `supabase/migrations/202610110001_initial.sql`, `supabase/migrations/202610110002_data_api_privileges.sql` e `supabase/migrations/202610110003_company_match_and_alerts.sql` no projeto de desenvolvimento/staging. As duas primeiras foram executadas; a terceira adiciona compatibilidade para vagas da empresa e notificação de novas candidaturas. A chave pública não tem permissão para aplicar SQL.
3. Instale dependências com `npm install` e execute `npm run dev`.
4. Crie uma conta de empresa pelo aplicativo. Para habilitar o primeiro administrador em staging, crie uma conta normalmente e atribua seu papel manualmente no SQL Editor, usando o UUID correto: `update public.account_roles set role = 'admin' where user_id = '<uuid-da-conta>';`. O papel `admin` nunca é aceito do formulário de cadastro.
5. No painel `/admin`, aprove a empresa para que ela publique vagas. Configure a confirmação de e-mail e os URLs de redirecionamento no projeto de staging do Supabase.

Comandos de verificação: `npm test`, `npm run lint`, `npm run build`.

## Permissões principais

- Candidatos editam apenas o próprio currículo; o perfil completo não é consultável por empresas.
- O diretório é disponibilizado por função que retorna apenas campos profissionais de candidatos que ativaram a visibilidade, somente a empresas aprovadas.
- Ao receber uma candidatura, a empresa responsável pode consultar os dados profissionais necessários por função específica; outras empresas não podem.
- Somente empresas aprovadas publicam vagas; candidaturas e alterações de etapa passam por funções que conferem identidade e registram histórico.
- A rota `/admin` exige papel `admin` consultado no banco. A criação desse papel é uma operação administrativa manual.

## Pendências para produto completo

Esta é uma primeira entrega funcional do núcleo. Ainda faltam: experiências, formações e cursos normalizados em tabelas próprias; foto e exportação de currículo em PDF; convites, mensagens e entrevistas em tempo real; notificações push/PWA; disponibilidade temporária com prazo; moderação administrativa de vagas no painel; tratamento administrativo completo de denúncias e solicitações de exclusão; proteção contra spam e limitação de tentativas; testes integrados de RLS com duas empresas e múltiplos candidatos; revisão jurídica final dos textos de privacidade/termos e identificação do responsável. Botões dessas funções ainda não foram exibidos como se estivessem prontas.

Falta aplicar a migration `202610110003_company_match_and_alerts.sql` e validar os fluxos autenticados com contas isoladas de homologação. O Auth do projeto exige confirmação de e-mail e o Docker local não iniciou; não foram criados usuários nem enviados e-mails. **Não houve alteração de dados ou deploy remoto por esta sessão.** A chave secreta compartilhada na conversa não é necessária para a aplicação e deve ser rotacionada no painel do Supabase.

Referências técnicas: [Next.js App Router](https://nextjs.org/docs/app/getting-started) e [Supabase SSR](https://supabase.com/docs/guides/auth/server-side). Para os direitos do titular, consultar a [ANPD](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares).
