# 🚀 Guia Completo de Deploy - LiStar App

## ✅ Status do Projeto
- [x] Build funcionando corretamente
- [x] Supabase configurado e integrado
- [x] Variáveis de ambiente configuradas
- [x] Configuração do Vercel pronta

## 🌐 Deploy no Vercel

### Passo 1: Login no Vercel
```bash
npx vercel login
```
*Faça login com sua conta (GitHub, GitLab, ou email)*

### Passo 2: Deploy do Projeto
```bash
npx vercel --yes
```
*O `--yes` aceita automaticamente as configurações padrão*

### Passo 3: Deploy para Produção
```bash
npx vercel --prod
```
*Deploy final para o domínio de produção*

## 🔧 Configuração das Variáveis no Vercel

Após o deploy, você precisa configurar as variáveis de ambiente no Vercel:

1. Acesse o [Dashboard do Vercel](https://vercel.com/dashboard)
2. Clique no seu projeto
3. Vá para **Settings > Environment Variables**
4. Adicione as seguintes variáveis:

```
VITE_SUPABASE_URL=https://mkrzetdeschmafesdste.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnpldGRlc2NobWFmZXNkc3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NjcxMjcsImV4cCI6MjA3MjA0MzEyN30.ZCar-jHtCPqrE7ElaecLJmww1HbFag35gr70oiRxP8k
```

5. Clique em **Add** para cada variável
6. Faça um novo deploy: `npx vercel --prod`

## 🌍 URLs do Projeto

Após o deploy bem-sucedido, você terá URLs como:
- **Principal**: `https://listar-tau.vercel.app`
- **Preview**: `https://listar-[hash].vercel.app`

## ✅ Checklist Final

Após o deploy, verifique:
- [ ] Site carregando corretamente
- [ ] Login/cadastro funcionando
- [ ] Sincronização com Supabase ativa
- [ ] Dados sendo salvos na nuvem
- [ ] Tema escuro funcionando
- [ ] Responsivo (mobile/desktop)

## 🔄 Atualizações Futuras

Para atualizar o site após mudanças:
```bash
# 1. Faça suas alterações no código
# 2. Teste localmente
npm run dev

# 3. Faça novo deploy
npx vercel --prod
```

## 🆘 Resolução de Problemas

### Erro: "Command not found"
```bash
npm install -g vercel
```

### Erro de Build no Vercel
- Verifique se `npm run build` funciona localmente
- Confirme se todas as dependências estão no `package.json`

### Erro de Variáveis
- Certifique-se de que as variáveis foram adicionadas no Dashboard do Vercel
- Verifique se os nomes estão corretos (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

### Site não carrega
- Verifique se o domínio do Supabase está correto
- Confirme se o RLS foi configurado corretamente

---

## 🎉 Sucesso!

Após seguir estes passos, seu LiStar estará disponível online para qualquer pessoa acessar!

**Compartilhe o link com seu parceiro(a) e aproveitem a gamificação das tarefas domésticas! ❤️**