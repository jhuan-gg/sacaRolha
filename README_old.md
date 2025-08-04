# 🍷 SacaRolha

**Teste Técnico para Vaga de Desenvolvedor Frontend**

Progressive Web App (PWA) de gestão de vinhos desenvolvida com React, Material-UI e Firebase.

## � Tecnologias

- **React 19** - Hooks e Context API
- **Material-UI 7** - Design System e responsividade
- **Firebase** - Autenticação e banco de dados
- **Vite** - Build tool e desenvolvimento
- **PWA** - Service Worker e instalação offline

## 📋 Funcionalidades

- ✅ Sistema de login/logout
- ✅ Dashboard com gráficos
- ✅ CRUD completo de vinhos
- ✅ PWA instalável
- ✅ Totalmente responsivo

## 🛠️ Como Rodar

### Pré-requisitos
- Node.js 18+
- Conta no Firebase

### Instalação
```bash
# Clone o repositório
git clone https://github.com/jhuan-gg/sacaRolha.git
cd sacaRolha

# Instale as dependências
npm install

# Configure o Firebase em src/firebase/config.js

# Execute o projeto
npm run dev
```

### Build de Produção
```bash
npm run build
npm run preview
```

## 🎯 Sobre o Teste

Este projeto foi desenvolvido para demonstrar habilidades em:
- React moderno com hooks
- PWA e responsividade
- Firebase integration
- Material-UI customização
- Código limpo e organizção

---

**Desenvolvido por [Jhuan Gabriel](https://github.com/jhuan-gg)** para teste técnico de vaga de emprego.

## ✨ Principais Características (Demonstradas no Teste)

- 📱 **Progressive Web App (PWA)** - Instalável em dispositivos móveis
- 🔐 **Sistema de Autenticação** completo com Firebase Auth
- 🍷 **CRUD Completo** - Create, Read, Update, Delete
- 🎨 **Interface Moderna** com Material-UI e tema personalizado
- 📊 **Dashboard Interativo** com gráficos e estatísticas
- 🌓 **Animações Suaves** em todas as transições de página
- 📱 **Totalmente Responsivo** para todos os dispositivos
- ⚡ **Performance Otimizada** com Vite e PWA caching
- 🔒 **Rotas Protegidas** com sistema de autenticação
- 🎯 **UX/UI Polido** com feedback visual e loading states

## 🚀 Tecnologias Utilizadas (Stack Técnico)

### Frontend
- **React 19.1.0** - Biblioteca JavaScript moderna com hooks
- **Vite 7.x** - Build tool ultra-rápido para desenvolvimento
- **Material-UI 7.x** - Design System completo e responsivo
- **React Router 7.x** - Roteamento SPA com proteção de rotas
- **Emotion** - CSS-in-JS para estilização avançada
- **PWA Plugin** - Service Worker e manifest automático

### Backend/Database
- **Firebase Auth** - Autenticação segura e escalável
- **Firebase Firestore** - Banco NoSQL em tempo real
- **Firebase Hosting** - Deploy com CDN global

### Ferramentas de Desenvolvimento
- **ESLint** - Linting e padronização de código
- **Vite PWA Plugin** - Geração automática de PWA
- **Git** - Controle de versão com boas práticas
- **Chrome DevTools** - Debug e otimização de performance

### PWA Features
- **Service Worker** automático
- **Manifest.json** configurado
- **Instalação offline** em dispositivos
- **Cache inteligente** de recursos
- **Push notifications** (preparado)

## 🎨 Design System

### Paleta de Cores
- **Primary:** `#395a4f` - Verde nobre
- **Secondary:** `#853c43` - Vinho bordô  
- **Tertiary:** `#432330` - Marrom escuro
- **Accent:** `#f25c5e` - Coral vibrante
- **Warning:** `#ffa566` - Laranja suave

### Componentes Personalizados
- Cards com gradientes e sombras
- Botões com animações hover
- Inputs com bordas melhoradas
- Transições de página suaves
- Sidebar responsiva com overlay

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Firebase

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/jhuan-gg/sacaRolha.git
cd sacaRolha
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o Firebase:**
   - Acesse o [Firebase Console](https://console.firebase.google.com/)
   - Crie um novo projeto
   - Ative Authentication (Email/Password)
   - Ative Firestore Database
   - Configure as regras de segurança
   - Copie as configurações para `src/firebase/config.js`

4. **Execute em desenvolvimento:**
```bash
npm run dev
```

5. **Acesse:** `http://localhost:5173`

### Build de Produção

```bash
# Gerar build PWA
npm run build

# Visualizar build
npm run preview

# Deploy Firebase (opcional)
firebase deploy
```

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento com hot reload
- `npm run build` - Build de produção com PWA
- `npm run preview` - Preview da build de produção
- `npm run lint` - Verificação de código com ESLint

## 📱 Funcionalidades Principais

### 🔐 Sistema de Autenticação
- **Login/Logout** com Firebase Auth
- **Proteção de rotas** automática
- **Redirecionamento inteligente** pós-login
- **Persistência de sessão** segura

### 🏠 Dashboard Principal (`/home`)
- **Gráficos interativos** de estatísticas
- **Cards informativos** com resumos
- **Navegação rápida** para funcionalidades
- **Interface responsiva** adaptativa

### 📋 Listagem de Vinhos (`/listagem`)
- **Tabela responsiva** com todos os vinhos
- **Busca e filtros** avançados
- **Ações rápidas** (visualizar, editar, excluir)
- **Paginação** para grandes volumes
- **Ordenação** por colunas

### ➕ Cadastro de Vinhos (`/cadastrar`)
- **Formulário completo** com validações
- **Upload de imagens** (preparado)
- **Campos obrigatórios** destacados
- **Feedback visual** de erros
- **Salvamento automático** no Firestore

### 👁️ Visualização Detalhada (`/visualizar/:id`)
- **Cards organizados** com informações
- **Layout responsivo** otimizado
- **Ações contextuais** (editar, voltar)
- **Loading states** suaves

### ⚙️ Configurações (`/configuracoes`)
- **Painel de usuário** personalizado
- **Preferências** da aplicação
- **Gestão de conta** Firebase

## 🛠️ Arquitetura do Projeto

### Estrutura de Pastas
```
src/
├── components/              # Componentes reutilizáveis
│   ├── common/             # Componentes gerais
│   │   ├── AppLoading.jsx  # Loading da aplicação
│   │   ├── ErrorBoundary.jsx # Tratamento de erros
│   │   ├── LoadingScreen.jsx # Tela de carregamento
│   │   ├── NavigationGuard.jsx # Proteção de rotas
│   │   ├── PageTransition.jsx # Transições de página
│   │   └── ProtectedRoute.jsx # Rotas protegidas
│   ├── layout/             # Layout da aplicação
│   │   ├── MainLayout.jsx  # Layout principal
│   │   └── Sidebar.jsx     # Menu lateral
│   ├── pages/              # Páginas principais
│   │   ├── Cadastrar.jsx   # Página de cadastro
│   │   ├── Home.jsx        # Dashboard principal
│   │   ├── Listagem.jsx    # Lista de vinhos
│   │   ├── Login.jsx       # Autenticação
│   │   └── Visualizar.jsx  # Detalhes do vinho
│   └── routes/             # Configuração de rotas
│       └── AppRoutes.jsx   # Rotas da aplicação
├── contexts/               # Contextos React
│   └── AuthContext.jsx     # Contexto de autenticação
├── firebase/               # Configuração Firebase
│   ├── config.js          # Configurações
│   └── connectionTest.js   # Teste de conexão
├── hooks/                  # Hooks personalizados
│   ├── useAuthRedirect.js  # Redirecionamento auth
│   └── useErrorNavigation.js # Navegação de erro
└── theme/                  # Tema Material-UI
    └── theme.js           # Configurações do tema
```

### Padrões de Desenvolvimento
- **Componentes Funcionais** com React Hooks
- **Context API** para gerenciamento de estado
- **Custom Hooks** para lógica reutilizável
- **Styled Components** com Material-UI
- **Error Boundaries** para tratamento de erros
- **Code Splitting** automático com Vite
- **TypeScript ready** (preparado para migração)

## 📱 PWA - Progressive Web App

### Características PWA
- ✅ **Instalável** em dispositivos móveis e desktop
- ✅ **Service Worker** para cache offline
- ✅ **Manifest.json** configurado
- ✅ **Ícones** em múltiplas resoluções
- ✅ **Theme colors** customizadas
- ✅ **Splash screen** automática
- ✅ **Add to Home Screen** prompt

### Como Instalar o PWA
1. **Mobile (Android/iOS):**
   - Abra no navegador
   - Aceite o prompt de instalação
   - Ou use "Adicionar à tela inicial"

2. **Desktop (Chrome/Edge):**
   - Clique no ícone de instalação na barra de endereços
   - Ou vá em Menu > "Instalar SacaRolha"

### Recursos Offline
- **Cache automático** de recursos estáticos
- **Estratégia cache-first** para performance
- **Fallbacks** para páginas offline

## 🎯 Responsividade

### Breakpoints Suportados
- **Mobile:** `< 600px` - Interface otimizada para celulares
- **Tablet:** `600px - 960px` - Layout adaptado para tablets
- **Desktop:** `> 960px` - Experiência completa de desktop
- **Landscape:** Otimizações especiais para orientação paisagem

### Adaptações Mobile
- **Sidebar colapsível** com overlay
- **Cards empilhados** verticalmente
- **Formulários otimizados** para touch
- **Botões com área de toque** adequada
- **Navegação simplificada** em telas pequenas

## 🔧 Configuração do Firebase

### 1. Configuração do Projeto
```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "sua-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 2. Regras do Firestore
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados podem acessar
    match /vinhos/{documento} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Configuração de Autenticação
- Ative **Email/Password** no Firebase Console
- Configure domínios autorizados
- Personalize templates de email (opcional)

## � Deploy e Produção

### Deploy no Firebase Hosting
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto
firebase init hosting

# Build de produção
npm run build

# Deploy
firebase deploy --only hosting
```

### Configuração do Deploy
```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Otimizações de Produção
- **Code splitting** automático
- **Tree shaking** de dependências
- **Compressão gzip** automática
- **PWA caching** inteligente
- **Lazy loading** de rotas

## � Status do Projeto

### ✅ Funcionalidades Implementadas
- [x] **Sistema de autenticação** completo com Firebase
- [x] **Dashboard interativo** com gráficos e métricas
- [x] **CRUD completo** de vinhos (Create, Read, Update, Delete)
- [x] **PWA funcional** com service worker e instalação
- [x] **Interface totalmente responsiva** (mobile-first)
- [x] **Transições de página** suaves e animadas
- [x] **Proteção de rotas** com redirecionamento inteligente
- [x] **Tratamento de erros** e loading states
- [x] **Integração Firebase** para auth e database
- [x] **Deploy funcional** com Firebase Hosting

### 🎯 Objetivos do Teste Técnico Alcançados
- ✅ **Arquitetura escalável** com componentes reutilizáveis
- ✅ **Código limpo** seguindo boas práticas React
- ✅ **Performance otimizada** com lazy loading e PWA
- ✅ **UX/UI moderno** com Material Design System
- ✅ **Responsividade total** para todos os dispositivos
- ✅ **Segurança** com autenticação e proteção de rotas
- ✅ **Documentação completa** e organizada

### 💡 Diferenciais Implementados
- 🚀 **PWA completa** - Instalável como app nativo
- 🎨 **Tema personalizado** - Paleta de cores única
- ⚡ **Performance avançada** - Vite + service worker
- 🔄 **Animações fluidas** - Transições entre páginas
- 📱 **Mobile-first** - Pensado para dispositivos móveis
- 🎯 **UX polida** - Feedback visual em todas as interações

## 🔍 Análise Técnica do Código

### Decisões de Arquitetura
- **Context API** para gerenciamento de estado de autenticação
- **Custom Hooks** para lógica reutilizável (usePWAInstall, useAuthRedirect)
- **Styled Components** com Material-UI para consistência visual
- **Error Boundaries** para tratamento robusto de erros
- **Lazy Loading** de rotas para otimização de performance

### Padrões Implementados
- **Componentes funcionais** com React Hooks
- **Separation of Concerns** - separação clara de responsabilidades
- **DRY (Don't Repeat Yourself)** - componentes reutilizáveis
- **Clean Code** - código legível e bem documentado
- **Responsive Design** - mobile-first approach

### Performance e Otimizações
- **Code splitting** automático com React.lazy()
- **Service Worker** para cache inteligente
- **Tree shaking** para bundle otimizado
- **Lazy loading** de imagens e componentes
- **Memoização** com useMemo e useCallback onde necessário

## 💼 Sobre o Teste Técnico

Este projeto foi desenvolvido para demonstrar competências técnicas em:
- **React moderno** com hooks e context
- **Progressive Web Apps** (PWA)
- **Firebase** integration
- **Material-UI** customização
- **Responsive design**
- **Clean architecture**

## 📝 Licença

Este projeto foi desenvolvido para fins de **teste técnico** e demonstração de habilidades.

## 👨‍💻 Desenvolvedor

**Desenvolvido por [Jhuan Gabriel](https://github.com/jhuan-gg)**

📧 **Contato:** [seu-email@example.com]  
💼 **LinkedIn:** [linkedin.com/in/seu-perfil]  
🌐 **Portfolio:** [seu-portfolio.dev]

---

## 🍷 Considerações Finais

O **SacaRolha** representa mais do que um simples teste técnico - é uma demonstração prática de como tecnologias modernas podem ser combinadas para criar experiências digitais excepcionais.

### 🎯 Objetivos Alcançados
- ✅ Interface moderna e intuitiva
- ✅ Performance otimizada
- ✅ Código limpo e escalável
- ✅ PWA funcional completa
- ✅ Responsividade total

### 🚀 Tecnologias Demonstradas
- React 19 com hooks modernos
- Firebase para backend completo  
- Material-UI para design system
- PWA com service worker
- Vite para build otimizado

**Desenvolvido com dedicação e paixão pela tecnologia! 🥂**
