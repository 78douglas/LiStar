# 📤 Como Fazer Upload do Seu Projeto para o GitHub

## Opção 1: Usando GitHub Desktop (Mais Fácil)

### Passo 1: Instalar GitHub Desktop
1. Baixe de: https://desktop.github.com/
2. Instale e faça login com sua conta do GitHub

### Passo 2: Criar Repositório
1. Abra o GitHub Desktop
2. Clique em "Create a New Repository on your hard drive"
3. Nome: `LiStar`
4. Descrição: `Aplicativo LiStar - App gamificado para gerenciamento de tarefas de casais`
5. Escolha esta pasta como localização: `C:\Users\Douglas\OneDrive\Imagens\app`
6. Marque "Initialize this repository with a README" (já temos um)
7. Clique em "Create Repository"

### Passo 3: Publicar no GitHub
1. Clique no botão "Publish repository"
2. Desmarque "Keep this code private" se quiser que seja público
3. Clique em "Publish Repository"

## Opção 2: Usando Linha de Comando Git

### Passo 1: Instalar Git
Baixe e instale o Git de: https://git-scm.com/download/windows

### Passo 2: Inicializar Repositório
Abra o Prompt de Comando na pasta do seu projeto e execute:
```bash
git init
git add .
git commit -m "Commit inicial: LiStar - App Gamificado para Casais"
```

### Passo 3: Criar Repositório no GitHub
1. Vá para https://github.com/new
2. Nome do repositório: `LiStar`
3. Descrição: `Aplicativo LiStar - App gamificado para gerenciamento de tarefas de casais`
4. Escolha Público ou Privado
5. Não inicialize com README (já temos um)
6. Clique em "Create repository"

### Passo 4: Enviar para o GitHub
Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub:
```bash
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/LiStar.git
git push -u origin main
```

## Opção 3: Usando Interface Web do GitHub (Arrastar e Soltar)

### Passo 1: Criar Repositório
1. Vá para https://github.com/new
2. Nome do repositório: `LiStar`
3. Descrição: `Aplicativo LiStar - App gamificado para gerenciamento de tarefas de casais`
4. Escolha Público ou Privado
5. Clique em "Create repository"

### Passo 2: Fazer Upload dos Arquivos
1. Clique em "uploading an existing file"
2. Arraste todos os arquivos do seu projeto para a área de upload
3. Mensagem do commit: "Commit inicial: LiStar - App Gamificado para Casais"
4. Clique em "Commit new files"

## 📁 Arquivos Prontos para Upload

Seu projeto inclui:
- ✅ Código fonte (React + TypeScript)
- ✅ README.md com documentação completa
- ✅ .gitignore para excluir arquivos desnecessários
- ✅ Package.json com todas as dependências
- ✅ Configurações de deploy (Vercel, Netlify, Docker)
- ✅ Workflow do GitHub Actions para deploy automático

## 🚀 Após o Upload

Uma vez enviado, seu repositório automaticamente:
- 📖 Exibirá o README bonito com informações do projeto
- 🚀 Estará pronto para deploy automático via GitHub Pages
- 📱 Mostrará que o app é responsivo para mobile
- 🇧🇷 Destacará a interface em português brasileiro
- 🌙 Demonstrará o sistema de tema escuro/claro

## 🌐 Habilitar GitHub Pages (Opcional)

Após fazer o upload:
1. Vá para seu repositório no GitHub
2. Clique na aba "Settings"
3. Role até a seção "Pages"
4. Source: "Deploy from a branch"
5. Branch: "main" (será criada automaticamente)
6. Pasta: "/ (root)"
7. Clique em "Save"

Seu app estará disponível em: `https://SEU_USUARIO.github.io/LiStar`

## 🔗 Estrutura da URL do Repositório

Seu repositório estará disponível em:
`https://github.com/SEU_USUARIO/LiStar`

Substitua `SEU_USUARIO` pelo seu nome de usuário real do GitHub.

---

**Escolha o método que achar mais confortável! 🎉**