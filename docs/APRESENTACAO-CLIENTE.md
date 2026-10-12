# Apresentação comercial — PombalEmprega

## Proposta

O PombalEmprega organiza oportunidades de trabalho de Ribeira do Pombal e aproxima candidatos e empresas em um único ambiente digital. O produto inclui busca pública, perfis profissionais, publicação de vagas e acompanhamento do processo seletivo.

## Roteiro de demonstração — 10 minutos

1. **Contexto e objetivo (1 min):** explicar a dificuldade de encontrar e divulgar vagas locais e a proposta de aproximar pessoas e empresas.
2. **Página inicial (1 min):** apresentar a marca, a busca por cidade e cargo e os caminhos para candidatos e empresas.
3. **Busca de oportunidades (2 min):** pesquisar vagas, mostrar filtros por área, experiência, modalidade e contratação. No Preview, identificar que os registros visíveis são dados fictícios do Staging.
4. **Compatibilidade profissional (1 min):** explicar que a pontuação compara requisitos profissionais cadastrados, habilidades, experiência, escolaridade, localização e disponibilidade. É uma recomendação e não uma decisão automática de contratação.
5. **Perfil e currículo (2 min):** mostrar o perfil, progresso calculado a partir dos campos existentes, sugestões de preenchimento e preferências de compartilhamento.
6. **Empresa e processo seletivo (2 min):** demonstrar aprovação administrativa, publicação de vaga e etapas das candidaturas, somente com conta fictícia autorizada no Staging.
7. **PWA e próximos passos (1 min):** apresentar a interface instalável e explicar que testes físicos de instalação/offline ainda estão pendentes.

## Benefícios

**Candidatos:** pesquisar oportunidades locais, organizar informações profissionais, salvar vagas e acompanhar candidaturas.

**Empresas:** publicar oportunidades após aprovação, organizar candidaturas e consultar perfis que autorizaram aparecer no diretório.

**Operação:** papéis separados, notificações internas e controles de acesso testados no Staging.

## Demonstração segura

- Use o Preview autorizado e somente contas/dados fictícios do Staging.
- O acesso à URL pode exigir aprovação do proprietário da equipe Vercel. Não desative a proteção para a apresentação.
- Não use contas, telefones, currículos ou candidaturas de pessoas reais.
- Mostre a Production separadamente: seu domínio ainda não tem Supabase configurado e não está pronto para usuários reais.

## Limites para explicar ao cliente

- Compatibilidade é apoio informativo; não decide quem pode se candidatar nem substitui avaliação humana.
- Push notifications, PDF do currículo, selo de empresa verificada baseado em análise independente e métricas de visualização não estão homologados.
- Não há preços, cobrança, limites comerciais ou SLA aprovados.
- PWA passou auditoria estática, mas não foi validada em aparelhos físicos.
- Segurança de Production depende da rotação confirmada da chave anteriormente exposta, migrações planejadas e revisão do ambiente real.

## Próximas etapas

Concluir a revisão de segurança e privacidade, validar email e PWA em aparelhos físicos, definir termos e modelo comercial, executar um piloto com participantes convidados e liberar Production somente depois da homologação.
