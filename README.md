# 💕 LiStar - App Gamificado para Casais

Um aplicativo web gamificado onde marido e esposa podem gerenciar tarefas domésticas de forma divertida e recompensadora!

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue)
![Vite](https://img.shields.io/badge/Vite-4.4.5-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.3-cyan)

## 🌟 Funcionalidades

### 🎯 Sistema de Tarefas
- ✅ **Criação de tarefas**: Um cônjuge cria tarefas para o outro executar
- ✅ **Atribuição automática**: Tarefas criadas pelo marido são automaticamente atribuídas à esposa e vice-versa
- ✅ **Execução controlada**: Apenas quem recebeu a tarefa pode marcá-la como concluída
- ✅ **Sistema de avaliação**: O criador da tarefa avalia com 1-5 estrelas após a conclusão

### 🎁 Sistema de Recompensas
- ✅ **Criação de recompensas**: Cada cônjuge pode criar recompensas para o parceiro
- ✅ **Resgate com estrelas**: Use estrelas acumuladas para resgatar recompensas
- ✅ **Avaliação de recompensas**: Avalie recompensas resgatadas (opcional)
- ✅ **Histórico completo**: Acompanhe todos os resgates e avaliações

### 🌟 Sistema de Gamificação
- ⭐ **Acúmulo de estrelas**: Ganhe estrelas baseadas na avaliação das tarefas executadas
- 📊 **Dashboard personalizado**: Visualize estatísticas, tarefas pendentes e recompensas disponíveis
- 🏆 **Sistema de balanço**: Controle automático do saldo de estrelas

### 🎨 Interface Moderna
- 🌙 **Tema escuro por padrão** com alternância para tema claro
- 📱 **Design responsivo** - funciona perfeitamente em dispositivos móveis
- 🇧🇷 **Interface em português brasileiro**
- 🎯 **UX intuitiva** com navegação simples

## 🚀 Começando

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/LiStar.git
cd LiStar
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em modo de desenvolvimento**
```bash
npm run dev
```

4. **Acesse o aplicativo**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🔐 Contas de Teste

Para testar o aplicativo, use estas contas:

- **Marido**: usuário `husband`, senha `123`
- **Esposa**: usuário `wife`, senha `123`

## 🏗️ Tecnologias Utilizadas

- **Frontend**: React 18 com TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router DOM
- **Ícones**: Lucide React
- **Gerenciamento de Estado**: React Context
- **Armazenamento**: LocalStorage
- **Tema**: Sistema dark/light mode

## 📱 Como Usar

### 1. **Login**
- Faça login com uma das contas de teste (`husband` ou `wife`)

### 2. **Criar Tarefas**
- Vá para a seção "Tarefas"
- Clique em "Nova Tarefa"
- Preencha título e descrição
- A tarefa será automaticamente atribuída ao seu parceiro

### 3. **Executar Tarefas**
- Visualize suas tarefas pendentes
- Marque como concluída quando terminar
- Aguarde a avaliação do seu parceiro

### 4. **Avaliar Tarefas**
- Avalie tarefas criadas por você após serem concluídas
- Dê de 1 a 5 estrelas baseado na qualidade da execução

### 5. **Criar Recompensas**
- Vá para a seção "Recompensas"
- Crie recompensas que seu parceiro pode resgatar
- Defina o custo em estrelas

### 6. **Resgatar Recompensas**
- Use suas estrelas acumuladas para resgatar recompensas
- Avalie a recompensa após o resgate (opcional)

## 🚀 Deploy

### Deploy Automático (Recomendado)

**Vercel:**
```bash
npx vercel
```

**Netlify:**
```bash
npm run build
# Depois arraste a pasta 'dist' para https://app.netlify.com/drop
```

### GitHub Pages
O projeto inclui workflow automático para GitHub Pages. Basta fazer push para a branch `main`.

### Docker
```bash
docker build -t couples-app .
docker run -p 3000:80 couples-app
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── Layout.tsx       # Layout da aplicação
│   ├── Login.tsx        # Tela de login
│   ├── TaskManager.tsx  # Gerenciamento de tarefas
│   └── RewardManager.tsx # Gerenciamento de recompensas
├── context/             # Contextos React
│   ├── AppContext.tsx   # Estado global da aplicação
│   └── AuthContext.tsx  # Contexto de autenticação
├── types.ts             # Definições TypeScript
├── App.tsx              # Componente principal
└── main.tsx             # Ponto de entrada
```

## 🔄 Funcionalidade de Reset

O aplicativo inclui uma função de reset completo que:
- Apaga todas as tarefas
- Remove todas as recompensas
- Zera saldos de estrelas
- Limpa histórico de avaliações
- Restaura o estado inicial

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 💝 Créditos

Desenvolvido com ❤️ para casais que querem tornar suas tarefas domésticas mais divertidas e colaborativas!

---

**Transforme tarefas em diversão! 🎉**