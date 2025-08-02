# SacaRolha - Confraria

**Desafio Técnico – Aplicação Full Stack** com React, Node.js e Firebase para gerenciamento de formulários de confraria de vinhos.

## 🎯 Objetivo

Criar um aplicativo web baseado em formulário que permita o cadastro, listagem e visualização dos dados dos usuários. O app possui interface moderna, é responsivo e conta com backend próprio e persistência em banco de dados.

## 🚀 Como instalar e rodar o projeto localmente

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Firebase (para configuração do Firestore)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/jhuan-gg/sacaRolha.git
cd sacaRolha
```

2. Instale as dependências do frontend:
```bash
npm install
# ou
yarn install
```

3. Configure o Firebase:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative o Firestore Database
   - Copie as configurações do Firebase para um arquivo `.env`

4. Instale as dependências do backend:
```bash
cd backend
npm install
```

5. Execute o backend:
```bash
cd backend
npm start
```

6. Execute o frontend (em outro terminal):
```bash
npm run dev
# ou
yarn dev
```

7. Abra o navegador e acesse `http://localhost:5173`

### Scripts disponíveis

#### Frontend
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter ESLint

#### Backend
- `npm start` - Inicia o servidor Express
- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon

## 🛠️ Tecnologias utilizadas

### Frontend
- **React 19.1.0** - Biblioteca JavaScript para construção de interfaces
- **Vite 7.0.4** - Build tool e servidor de desenvolvimento
- **Material-UI (MUI) 6.x** - Biblioteca de componentes React baseada no Material Design
- **React Router** - Roteamento para SPA
- **Emotion** - CSS-in-JS para estilização dos componentes

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web para Node.js
- **Firebase Admin SDK** - SDK para integração com Firebase
- **CORS** - Middleware para Cross-Origin Resource Sharing

### Banco de Dados
- **Firebase Firestore** - Banco de dados NoSQL em tempo real

### Design System
- **Paleta de cores personalizada:**
  - Primary: `#395a4f` (Verde escuro)
  - Secondary: `#853c43` (Vinho)
  - Tertiary: `#432330` (Marrom escuro)
  - Accent: `#f25c5e` (Coral)
  - Warning: `#ffa566` (Laranja claro)

## 📱 Responsividade

O projeto foi desenvolvido com foco em responsividade, oferecendo uma experiência otimizada para:
- **Desktop** - Layout completo com todas as funcionalidades
- **Tablet** - Interface adaptada para telas médias
- **Mobile** - Design mobile-first com navegação otimizada
- **Mobile Landscape** - Adaptações específicas para orientação paisagem

## 🎨 Funcionalidades

### Estrutura de Navegação
- **Menu lateral** com opções de navegação: Listagem e Cadastrar
- **Roteamento** implementado com React Router

### 📋 Primeira Página – Listagem de Respostas
**Rota:** `/listagem`
- Exibe registros dos usuários em tabela responsiva
- **Colunas obrigatórias:**
  - ID
  - Data e Hora da Resposta
  - Ações
- Botão de ações redireciona para `/visualizar?id=ID_DO_REGISTRO`

### ➕ Segunda Página – Cadastro de Resposta
**Rota:** `/cadastrar`
- Formulário baseado no modelo fornecido
- **Validação de campos obrigatórios**
- **Feedback de erro** para o usuário
- **Submissão via POST** para o backend
- **Persistência no Firebase Firestore**
- **Redirecionamento** automático para `/visualizar?id=ID` após sucesso

### 👁️ Terceira Página – Visualização dos Dados
**Rota:** `/visualizar?id=ID`
- Verificação de parâmetro `id` na URL
- **Requisição ao backend** para buscar dados no Firebase
- **Exibição organizada** dos dados (tabela/cards)

### 🔐 Tela de Login
- Interface inspirada no design fornecido
- Campos de usuário e senha com validação
- Botão de visualização/ocultação de senha
- Animações suaves de entrada
- Responsividade completa para todos os dispositivos

## 📋 Observações relevantes

### Estrutura do projeto
```
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes React reutilizáveis
│   │   │   ├── Login.jsx       # Componente de autenticação
│   │   │   ├── Sidebar.jsx     # Menu lateral de navegação
│   │   │   └── ...
│   │   ├── pages/              # Páginas principais
│   │   │   ├── Listagem.jsx    # Página de listagem
│   │   │   ├── Cadastrar.jsx   # Página de cadastro
│   │   │   └── Visualizar.jsx  # Página de visualização
│   │   ├── theme/              # Configuração do tema Material-UI
│   │   │   └── theme.js        # Tema personalizado
│   │   ├── services/           # Serviços de API
│   │   └── utils/              # Utilitários e helpers
├── backend/
│   ├── routes/                 # Rotas da API
│   ├── controllers/            # Controladores
│   ├── services/               # Serviços (Firebase)
│   └── middleware/             # Middlewares
└── README.md
```

### Padrões de desenvolvimento
- **Componentes funcionais** com React Hooks
- **Styled Components** com Material-UI
- **Validação de formulários** no frontend
- **API RESTful** com Express.js
- **Tratamento de erros** e feedback ao usuário
- **Responsividade** com breakpoints do MUI

### Requisitos implementados
- ✅ Frontend em ReactJS
- ✅ Componentes MUI (Material-UI)
- ✅ Backend NodeJS com Express
- ✅ Banco Firebase Firestore
- ✅ Responsividade completa
- ✅ Menu lateral de navegação
- ✅ Roteamento com React Router
- ✅ Validação de campos
- ✅ Persistência de dados
- ✅ Interface moderna e organizada

### Diferenciais implementados
- ✅ **Edição de registros** (funcionalidade extra)
- ✅ **Tema personalizado** com paleta de cores
- ✅ **Animações suaves** de interface
- ✅ **Feedback visual** completo
- 🚧 **Deploy funcional** (em desenvolvimento)

### API Endpoints
```
GET    /api/registros          # Lista todos os registros
POST   /api/registros          # Cria novo registro
GET    /api/registros/:id      # Busca registro por ID
PUT    /api/registros/:id      # Atualiza registro
DELETE /api/registros/:id      # Remove registro
``` 
gerenciamento de estado
- Componentes funcionais com styled-components
- Breakpoints responsivos definidos no tema MUI
- Animações com Fade e Zoom do Material-UI

### Próximos passos
- [ ] Implementação do backend Node.js com Express
- [ ] Configuração do Firebase Firestore
- [ ] Criação das páginas Listagem, Cadastrar e Visualizar
- [ ] Implementação do menu lateral de navegação
- [ ] Sistema de roteamento com React Router
- [ ] Validação completa de formulários
- [ ] Implementação da edição de registros
- [ ] Deploy da aplicação

### Contribuição
Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

**Desafio Técnico Full Stack** - Desenvolvido com ❤️ para a comunidade de apreciadores de vinho.
