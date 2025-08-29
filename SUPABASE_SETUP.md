# Configuração do Supabase para o App de Casais

## Passo 1: Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login/cadastro
3. Clique em "New Project"
4. Escolha sua organização
5. Configure:
   - **Nome do projeto**: `app-casais`
   - **Database Password**: (crie uma senha segura)
   - **Region**: South America (São Paulo) - mais próximo do Brasil
6. Clique em "Create new project"

## Passo 2: Configurar o banco de dados

1. No painel do Supabase, vá para **SQL Editor**
2. Copie todo o conteúdo do arquivo `database_schema.sql`
3. Cole no editor SQL
4. Clique em **Run** para executar o script
5. Verifique se todas as tabelas foram criadas em **Table Editor**

## Passo 3: Configurar autenticação

1. Vá para **Authentication > Settings**
2. Em **Site URL**, adicione:
   - Para desenvolvimento: `http://localhost:5173`
   - Para produção: sua URL de deploy
3. Em **Auth Providers**, verifique se **Email** está habilitado
4. Em **Email Templates**, você pode personalizar os emails (opcional)

## Passo 4: Obter as chaves da API

1. Vá para **Settings > API**
2. Copie os valores:
   - **Project URL**: `https://mkrzetdeschmafesdste.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnpldGRlc2NobWFmZXNkc3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NjcxMjcsImV4cCI6MjA3MjA0MzEyN30.ZCar-jHtCPqrE7ElaecLJmww1HbFag35gr70oiRxP8k`

## Passo 5: Configurar variáveis de ambiente

1. Abra o arquivo `.env` na raiz do projeto
2. Preencha com seus valores:

```env
VITE_SUPABASE_URL=https://xxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

## Passo 6: Testar a conexão

Após configurar tudo, execute o projeto:

```bash
npm run dev
```

Tente fazer um cadastro e login. Os dados agora serão salvos no Supabase e sincronizados entre dispositivos!

## Recursos do Supabase configurados:

✅ **Autenticação**: Login/cadastro com email e senha
✅ **Banco de dados**: PostgreSQL com todas as tabelas necessárias  
✅ **Row Level Security**: Segurança para que usuários vejam apenas dados do casal
✅ **Tempo real**: Sincronização automática entre dispositivos
✅ **Índices**: Performance otimizada para consultas

## Próximos passos (opcionais):

- **Backup automático**: Configurar backups regulares
- **Monitoramento**: Acompanhar usage e performance
- **Custom Domain**: Usar seu próprio domínio (planos pagos)
- **Edge Functions**: Adicionar lógica serverless (se necessário)

---

💡 **Dica**: Mantenha suas chaves da API seguras e nunca as compartilhe publicamente!