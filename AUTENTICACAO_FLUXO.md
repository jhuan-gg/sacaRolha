# Fluxo de Autenticação - SacaRolha

## Como Funciona Agora

### 1. Tela Primária
- **Login é a tela primária** - Usuários sempre chegam primeiro na tela de login
- Rota principal `/` redireciona para `/login`

### 2. Verificação de Token
- **Token válido**: Usuário é automaticamente redirecionado para `/home` (dashboard)
- **Token expirado/inválido**: Permanece na tela de login
- **Sem token**: Permanece na tela de login

### 3. Processo de Login
1. Usuário digita credenciais válidas
2. Clica em "Acessar"
3. Sistema valida com Firebase
4. **Sucesso**: Redireciona para `/home` (dashboard)
5. **Erro**: Exibe mensagem de erro e permanece no login

### 4. Otimizações Implementadas

#### AuthContext
- ✅ Timeout reduzido para 3 segundos máximo
- ✅ Verificação de token válido/expirado
- ✅ Carregamento não-bloqueante de perfil
- ✅ LoadingScreen otimizado

#### Login Component
- ✅ Redirecionamento direto para `/home` após login
- ✅ Verificação automática de usuário logado
- ✅ Tratamento de erros melhorado

#### Rotas
- ✅ `/` → `/login` (tela primária)
- ✅ Todas as outras rotas protegidas
- ✅ Redirecionamento automático baseado em autenticação

#### Performance
- ✅ Redução de chamadas desnecessárias ao Firestore
- ✅ Cache de perfil de usuário
- ✅ Timeout agressivo para evitar travamentos
- ✅ Verificação de token em tempo real

## Fluxo Resumido

```
Usuário acessa site
       ↓
   Tela de Login
       ↓
   Tem token válido?
   ↙         ↘
  SIM        NÃO
   ↓          ↓
Dashboard   Login
              ↓
         Digita credenciais
              ↓
         Clica "Acessar"
              ↓
          Válido?
         ↙      ↘
        SIM     NÃO
         ↓       ↓
    Dashboard  Erro
```

## Comandos para Testar

```bash
npm run dev
```

1. Acesse http://localhost:5173
2. Deve aparecer a tela de login
3. Se já estiver logado, redirecionará automaticamente
4. Após login bem-sucedido, vai para dashboard
