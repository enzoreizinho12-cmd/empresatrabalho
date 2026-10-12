# Estado de lançamento — PombalEmprega

**Atualizado:** 12/10/2026

## Classificação

- **Desenvolvimento local: APTO COM RESSALVAS.** 20 testes unitários, lint, TypeScript, auditoria PWA e build de produção passaram.
- **Homologação funcional Supabase: APTO COM RESSALVAS.** Ref `nzaquzpwvbyvhorfibrt` confirmado como staging isolado; suíte autenticada (8/8) passou após aplicar as migrations 002 e 003. Os registros de teste permanecem somente nesse staging.
- **Vercel: BLOQUEADO.** Não existe projeto PombalEmprega nessa equipe Vercel. O painel indica armazenamento de deployments acima da franquia (14,33 GB/10 GB) e instalar a integração GitHub no proprietário do repositório exige verificação de identidade por e-mail.
- **Segurança para lançamento: NÃO APTO.** Migrations 002 e 003 de proteção RLS aplicadas em staging e teste 8/8 aprovado; banco de produção ainda não verificado e rotação/revogação da chave `sb_secret` exposta ainda não confirmada.
- **Apresentação comercial: APTO COM RESSALVAS.** Proposta e roteiro estão prontos; relatar os limites de homologação, segurança e implantação.

## Checklist de saída

- [x] Build de produção local com 31 rotas.
- [x] Lint e TypeScript.
- [x] Testes unitários (20/20).
- [x] Auditoria estática PWA.
- [x] Suíte autenticada de staging (8/8).
- [x] Isolamento de perfis, vagas, candidaturas, notificações e empresas nos cenários cobertos.
- [x] Proteção contra gravação acidental em projeto de homologação não confirmado.
- [x] Proposta e roteiro sem preços inventados.
- [x] Migration `202610120002_active_owner_update_policies.sql` aplicada no staging (`Success. No rows returned`).
- [x] Migration `202610120003_account_role_suspension_privilege.sql` aplicada no staging; teste de suspensão passou.
- [ ] Auditoria npm concluída; registry falhou por validação TLS nesta sessão.
- [ ] Rotação da chave secreta exposta confirmada.
- [ ] Vercel configurado e deploy validado sob HTTPS (bloqueado: vínculo GitHub, armazenamento excedido e variáveis de ambiente ainda sem projeto).
- [ ] Instalação PWA e telas móveis verificadas em aparelhos reais.
- [ ] Revisão final de termos, privacidade, retenção e condições comerciais.

**Deploy não concluído nesta sessão. O código passou build e testes; conexão Vercel e franquia precisam ser regularizadas.**
