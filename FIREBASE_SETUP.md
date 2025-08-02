# Configuração do Firebase para SacaRolha

## Erros Comuns e Soluções

### 1. `auth/admin-restricted-operation`
**Causa**: Login anônimo não habilitado no Firebase Console
**Solução**: 
1. Acesse o Firebase Console: https://console.firebase.google.com
2. Vá em Authentication > Sign-in method
3. Habilite "Anonymous" se necessário (ou remova o teste anônimo)

### 2. `network-request-failed`
**Causa**: Problemas de rede ou configuração
**Soluções**:
- Verificar se a API Key está correta
- Verificar se o projeto existe no Firebase
- Verificar conexão com internet

### 3. Firestore Connection Errors
**Causa**: Regras do Firestore muito restritivas
**Solução**: Configure as regras do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para usuários autenticados
    match /vinhos/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Permitir acesso aos perfis de usuário
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Configuração Recomendada

### 1. Habilitar Authentication
- Email/Password ✅
- Google (opcional)
- Anonymous (apenas para testes)

### 2. Configurar Firestore
- Criar coleção `vinhos`
- Criar coleção `users`
- Aplicar regras de segurança

### 3. Configurar Storage (se necessário)
- Para upload de imagens de vinhos

## Estrutura de Dados

### Coleção `vinhos`
```javascript
{
  nomeVinho: string,
  produtor: string,
  tipoVinho: string, // 'Tinto', 'Branco', 'Rosé', 'Espumante'
  safra: string,
  regiao: string,
  pais: string,
  teorAlcoolico: string,
  volume: string,
  preco: string,
  notaAvaliacao: number, // 0-5
  observacoes: string,
  caracteristicas: string,
  dataResposta: timestamp,
  updatedAt: timestamp
}
```

### Coleção `users`
```javascript
{
  email: string,
  displayName: string,
  role: string, // 'admin', 'user'
  status: string, // 'active', 'inactive'
  createdAt: timestamp
}
```

## Comandos para Debugar

1. **Verificar variáveis de ambiente**:
```bash
echo $VITE_FIREBASE_PROJECT_ID
```

2. **Testar conexão**:
- Abrir DevTools
- Verificar logs no console
- Verificar Network tab para requisições Firebase

3. **Verificar configuração**:
- Project ID deve ser: `saca-rolha`
- Auth Domain deve ser: `saca-rolha.firebaseapp.com`

## Status Atual
- ✅ Configuração básica criada
- ✅ Variáveis de ambiente configuradas
- ⚠️ Teste de conexão simplificado (sem login anônimo)
- 🔄 Aguardando configuração das regras do Firestore
