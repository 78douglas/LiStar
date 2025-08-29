# 🔧 Configurar Variáveis de Ambiente no Vercel

## ⚠️ IMPORTANTE - Último Passo Obrigatório

Seu projeto foi deployado com sucesso, mas ainda precisa das variáveis do Supabase para funcionar corretamente.

## 🌐 URLs do Seu Projeto

✅ **Site Principal**: https://listar-tau.vercel.app
✅ **URLs Alternativas**: 
- https://listar-zemys-projects.vercel.app
- https://listar-78douglas-2061-zemys-projects.vercel.app

## 🔑 Configurar Variáveis (OBRIGATÓRIO)

### Passo 1: Acessar o Dashboard
1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **listar**

### Passo 2: Configurar Variáveis
1. Vá para **Settings** (no menu lateral)
2. Clique em **Environment Variables**
3. Adicione as seguintes variáveis:

#### Variável 1:
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://mkrzetdeschmafesdste.supabase.co`
- **Environment**: Marque todos (Production, Preview, Development)

#### Variável 2:
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnpldGRlc2NobWFmZXNkc3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NjcxMjcsImV4cCI6MjA3MjA0MzEyN30.ZCar-jHtCPqrE7ElaecLJmww1HbFag35gr70oiRxP8k`
- **Environment**: Marque todos (Production, Preview, Development)

### Passo 3: Re-deploy
Após adicionar as variáveis, execute no terminal:
```bash
npx vercel --prod
```

## ✅ Verificação Final

Depois da configuração, teste:

1. **Acesse**: https://listar-tau.vercel.app
2. **Verifique se**:
   - [ ] Site carrega sem erros
   - [ ] Formulário de cadastro aparece
   - [ ] Consegue fazer login/cadastro
   - [ ] Dados são salvos (teste criando tarefa)

## 🎯 Como Usar o App

### Para Casais Novos:
1. **Primeiro parceiro**:
   - Acesse https://listar-tau.vercel.app
   - Cadastre-se com email e senha
   - Anote o **código do casal** que aparece
   
2. **Segundo parceiro**:
   - Acesse o mesmo link
   - Cadastre-se usando o **código do casal**
   - Agora vocês estão conectados!

### Funcionalidades:
- ✅ Criar e atribuir tarefas
- ✅ Sistema de estrelas e gamificação  
- ✅ Recompensas personalizadas
- ✅ Sincronização entre dispositivos
- ✅ Tema escuro/claro
- ✅ Histórico completo

## 🔄 Atualizações Futuras

Para fazer mudanças no projeto:
1. Edite o código localmente
2. Execute: `npx vercel --prod`
3. O site será atualizado automaticamente

## 🆘 Problemas Comuns

### Site carrega mas não funciona login:
- Certifique-se de que as variáveis foram adicionadas corretamente
- Verifique se o Supabase está ativo

### Erro 404 ou página em branco:
- Aguarde alguns minutos (propagação DNS)
- Limpe o cache do navegador

---

## 🎉 Pronto!

Seu **LiStar** está agora online e acessível para qualquer pessoa!

**Compartilhe o link**: https://listar-tau.vercel.app

**Aproveitem a gamificação das tarefas domésticas! ❤️**