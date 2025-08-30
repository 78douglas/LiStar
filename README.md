# 💕 LiStar - App Gamificado para Casais

<div align="center">

![LiStar Logo](https://img.shields.io/badge/LiStar-💕-ff69b4?style=for-the-badge&logoColor=white)

**Transforme tarefas domésticas em diversão para você e seu parceiro(a)!**

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://listar-tau.vercel.app)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[🌐 Acesse o App](https://listar-tau.vercel.app) • [📖 Documentação](#-documentação) • [🚀 Deploy](#-como-fazer-deploy) • [🤝 Contribuição](#-como-contribuir)

</div>

---
body {
  display: flex; /* 1. Ativa o Flexbox no body */
  justify-content: center; /* 2. Centraliza os itens no eixo horizontal (horizontalmente) */
  align-items: center; /* 3. Centraliza os itens no eixo vertical (verticalmente) */
  height: 100vh; /* 4. Garante que o body ocupe a altura total da tela */
  margin: 0; /* 5. Remove margens padrão do body */
}
<body>
  <div class="caixa-centralizada">
    <img src="https://github.com/user-attachments/assets/3f5849fd-2dbf-41dd-9107-9be779743274" alt="Aplicativo 1" style="width: 250px; height: auto; border-radius: 12px;" />
  <img src="https://github.com/user-attachments/assets/eeb4bcab-ac45-4737-b571-b49943de1fbc" alt="Aplicativo 2" style="width: 250px; height: auto; border-radius: 12px;" />
  <img src="https://github.com/user-attachments/assets/b8160106-4a32-497d-81b5-83178d2a41e4" alt="Aplicativo 3" style="width: 250px; height: auto; border-radius: 12px;" />
  </div>
</body>



## 📱 Sobre o LiStar

O **LiStar** é um aplicativo web gamificado que ajuda casais a gerenciar tarefas domésticas de forma divertida e colaborativa. Com um sistema de pontos e recompensas, as tarefas chatas se tornam desafios divertidos!


### ✨ Funcionalidades Principais

- **🎮 Gamificação Completa**: Sistema de estrelas e pontos
- **👫 Para Casais**: Vinculação automática entre parceiros
- **📋 Gerenciamento de Tarefas**: Criar, atribuir e avaliar tarefas
- **🎁 Sistema de Recompensas**: Criar e resgatar prêmios personalizados
- **📊 Dashboard Analítico**: Estatísticas e progresso em tempo real
- **🔄 Sincronização**: Dados compartilhados entre dispositivos
- **🌙 Temas Múltiplos**: Escuro, claro, azul, verde e roxo
- **📱 Responsivo**: Funciona perfeitamente em mobile e desktop

---

## 🎯 Como Funciona

### 1. **Cadastro e Vinculação**
- Primeiro parceiro se cadastra e recebe um código único
- Segundo parceiro usa o código para se vincular automaticamente

### 2. **Gerenciamento de Tarefas**
- Criar tarefas com descrição e valor em estrelas
- Atribuir tarefas para si mesmo ou para o parceiro
- Marcar como concluída e aguardar avaliação

### 3. **Sistema de Pontuação**
- 5 estrelas automáticas ao completar qualquer tarefa
- 1-5 estrelas adicionais baseadas na avaliação do parceiro
- Estrelas acumuladas podem ser usadas para resgatar recompensas

### 4. **Recompensas Personalizadas**
- Criar recompensas customizadas (ex: "Massagem", "Escolher filme")
- Definir custo em estrelas
- Resgatar quando tiver pontos suficientes

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18.2.0** - Biblioteca JavaScript para interfaces
- **TypeScript 5.0.2** - Tipagem estática para JavaScript
- **Vite 4.4.5** - Build tool rápida para desenvolvimento
- **Tailwind CSS 3.3.3** - Framework de CSS utilitário
- **Lucide React** - Biblioteca de ícones modernos
- **React Router DOM** - Roteamento para SPA

### **Backend e Banco de Dados**
- **Supabase** - Backend-as-a-Service completo
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança a nível de linha
- **Real-time Subscriptions** - Sincronização em tempo real

### **Deploy e Hospedagem**
- **Vercel** - Plataforma de deploy para frontend
- **GitHub** - Controle de versão e CI/CD

---

## 🚀 Começando

### **📋 Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (gratuita)
- Conta no Vercel (opcional, para deploy)

### **💻 Instalação Local**

1. **Clone o repositório**
```bash
git clone https://github.com/78douglas/LiStar.git
cd LiStar
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

4. **Configure o banco de dados**
- Execute o script SQL em `database_schema.sql` no Supabase SQL Editor
- Configure as políticas RLS executando `fix_rls_final.sql`

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse `http://localhost:5173` para ver o app rodando!

---

## 🌐 Como Fazer Deploy

### **Deploy no Vercel (Recomendado)**

1. **Faça build do projeto**
```bash
npm run build
```

2. **Instale a CLI do Vercel**
```bash
npm install -g vercel
```

3. **Faça login no Vercel**
```bash
vercel login
```

4. **Deploy do projeto**
```bash
vercel --prod
```

5. **Configure as variáveis de ambiente no Vercel Dashboard**
- Vá para Settings > Environment Variables
- Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### **Outras Opções de Deploy**
- **Netlify**: Faça upload da pasta `dist` após `npm run build`
- **GitHub Pages**: Use o workflow automatizado
- **Docker**: Use o `Dockerfile` incluído

---

## 📖 Documentação

### **🔧 Configuração**
- [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) - Como configurar o Supabase
- [`CONFIGURAR_EMAIL_SUPABASE.md`](./CONFIGURAR_EMAIL_SUPABASE.md) - Configuração de emails
- [`CONFIGURAR_VARIAVEIS_VERCEL.md`](./CONFIGURAR_VARIAVEIS_VERCEL.md) - Variáveis no Vercel

### **🛠️ Resolução de Problemas**
- [`SOLUCAO_EMAIL_LOGIN.md`](./SOLUCAO_EMAIL_LOGIN.md) - Problemas de login
- [`RESOLUCAO_PROBLEMAS_AUTH.md`](./RESOLUCAO_PROBLEMAS_AUTH.md) - Autenticação
- [`CORRIGIR_RLS.md`](./CORRIGIR_RLS.md) - Problemas de permissão

### **🚀 Deploy e Produção**
- [`DEPLOY_INSTRUCTIONS.md`](./DEPLOY_INSTRUCTIONS.md) - Instruções completas
- [`GUIA_SUPABASE.md`](./GUIA_SUPABASE.md) - Integração completa

---

## 🎨 Temas Disponíveis

O LiStar suporta 5 temas diferentes:

- **🌙 Escuro** (padrão) - Tema dark moderno
- **☀️ Claro** - Tema light clean
- **💙 Azul** - Tons de azul relaxante
- **💚 Verde** - Verde natural e calmante
- **💜 Roxo** - Roxo vibrante e criativo

Troque entre os temas nas Configurações do app!

---

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Dashboard.tsx    # Tela principal
│   ├── Layout.tsx       # Layout base
│   ├── Login.tsx        # Tela de login/cadastro
│   ├── TaskManager.tsx  # Gerenciamento de tarefas
│   ├── RewardManager.tsx # Gerenciamento de recompensas
│   ├── Settings.tsx     # Configurações
│   ├── History.tsx      # Histórico
│   └── CoupleInvite.tsx # Convite do casal
├── context/             # Estado global
│   ├── AppContext.tsx   # Estado da aplicação
│   └── AuthContext.tsx  # Estado de autenticação
├── hooks/               # Hooks customizados
│   └── useSupabaseSync.ts # Sincronização Supabase
├── lib/                 # Utilitários
│   ├── supabase.ts      # Cliente Supabase
│   └── supabaseOperations.ts # Operações CRUD
├── styles/              # Estilos
│   └── themes.css       # Temas customizados
├── App.tsx              # Componente principal
├── main.tsx             # Ponto de entrada
├── types.ts             # Tipos TypeScript
└── vite-env.d.ts        # Tipos do Vite
```

---

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Aqui está como você pode ajudar:

### **🐛 Reportar Bugs**
1. Verifique se o bug já foi reportado nas [Issues](https://github.com/78douglas/LiStar/issues)
2. Se não, crie uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Screenshots se aplicável
   - Informações do ambiente (browser, OS, etc.)

### **💡 Sugerir Funcionalidades**
1. Abra uma issue com tag `enhancement`
2. Descreva a funcionalidade desejada
3. Explique por que seria útil
4. Adicione mockups se possível

### **🔧 Enviar Código**
1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### **📝 Melhorar Documentação**
- Corrigir erros de português
- Adicionar exemplos
- Melhorar explicações
- Traduzir para outros idiomas

---

## 🎯 Roadmap

### **🔄 Próximas Funcionalidades**
- [ ] **Push Notifications** - Notificações quando parceiro completa tarefa
- [ ] **Fotos de Perfil** - Upload de avatares personalizados
- [ ] **Categorias de Tarefas** - Organizar por tipo (limpeza, cozinha, etc.)
- [ ] **Estatísticas Avançadas** - Gráficos e métricas detalhadas
- [ ] **Conquistas e Badges** - Sistema de conquistas gamificado
- [ ] **Temas Personalizados** - Criar temas próprios
- [ ] **Modo Offline** - Funcionar sem internet
- [ ] **API Pública** - Integração com outros apps

### **🛠️ Melhorias Técnicas**
- [ ] **Testes Automatizados** - Jest + React Testing Library
- [ ] **Performance** - Lazy loading e otimizações
- [ ] **PWA** - Progressive Web App
- [ ] **Internationalization** - Suporte a múltiplos idiomas
- [ ] **Docker Compose** - Setup completo com um comando

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Douglas** - *Desenvolvedor Principal*
- GitHub: [@78douglas](https://github.com/78douglas)
- LinkedIn: [douglas-dev](https://linkedin.com/in/douglas-dev)

---

## 🙏 Agradecimentos

- **React Team** - Pela excelente biblioteca
- **Supabase** - Pelo backend incrível e gratuito
- **Vercel** - Pela plataforma de deploy fantástica
- **Tailwind CSS** - Pelo framework de CSS produtivo
- **Lucide** - Pelos ícones lindos e consistentes
- **Comunidade Open Source** - Por toda inspiração e aprendizado

---

## 📈 Status do Projeto

![GitHub last commit](https://img.shields.io/github/last-commit/78douglas/LiStar?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/78douglas/LiStar?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/78douglas/LiStar?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/78douglas/LiStar?style=flat-square)

---

<div align="center">

**💕 Feito com amor para casais que querem se divertir juntos! 💕**

[⬆ Voltar ao topo](#-listar---app-gamificado-para-casais)

</div>
