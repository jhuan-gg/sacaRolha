# 🔥 Configuração do Firestore - SacaRolha

## ✅ Passos para Configurar o Firestore

### 1. Configurar Firebase Console

1. **Acesse o Firebase Console**: https://console.firebase.google.com/
2. **Selecione seu projeto SacaRolha**
3. **Vá para Firestore Database**
4. **Clique em "Criar banco de dados"**

### 2. Configurar Regras de Segurança

No Firebase Console, vá para **Firestore > Regras** e cole o conteúdo do arquivo `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vinhos/{vinhoId} {
      allow read, write: if request.auth != null;
      allow create: if request.auth != null && validateVinhoData(request.resource.data);
      allow update: if request.auth != null && validateVinhoData(request.resource.data) &&
        resource.data.keys().hasAll(['createdAt']) &&
        request.resource.data.createdAt == resource.data.createdAt;
    }
    
    function validateVinhoData(data) {
      return data.keys().hasAll(['nomeVinho', 'produtor', 'tipoVinho', 'safra', 'regiao']) &&
        data.nomeVinho is string && data.nomeVinho.size() > 0 &&
        data.produtor is string && data.produtor.size() > 0 &&
        data.tipoVinho is string && data.tipoVinho.size() > 0 &&
        data.safra is string && data.safra.size() > 0 &&
        data.regiao is string && data.regiao.size() > 0;
    }
  }
}
```

### 3. Criar Coleção "vinhos"

1. **No Firestore Console**, clique em **"Iniciar coleção"**
2. **ID da coleção**: `vinhos`
3. **Adicione um documento de exemplo**:
   - **ID do documento**: (automático)
   - **Campos**:
     ```json
     {
       "nomeVinho": "Exemplo de Vinho",
       "produtor": "Vinícola Exemplo",
       "tipoVinho": "Tinto",
       "safra": "2020",
       "regiao": "Vale dos Vinhedos",
       "pais": "Brasil",
       "teorAlcoolico": 13.5,
       "volume": 750,
       "preco": 85.90,
       "notaAvaliacao": 4.5,
       "observacoes": "Vinho encorpado com notas de frutas vermelhas",
       "caracteristicas": "Taninos macios, final persistente",
       "status": "ativo",
       "categoria": "Tinto",
       "createdAt": "timestamp atual",
       "updatedAt": "timestamp atual",
       "dataResposta": "timestamp atual"
     }
     ```

### 4. Configurar Autenticação

1. **Vá para Authentication > Sign-in method**
2. **Habilite "Email/senha"**
3. **Adicione usuários de teste ou configure o registro**

### 5. Verificar Arquivo .env

Certifique-se de que o arquivo `.env` existe e está configurado:

```bash
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

## 🔧 Estrutura de Dados do Vinho

### Campos Obrigatórios:
- `nomeVinho` (string): Nome do vinho
- `produtor` (string): Nome do produtor
- `tipoVinho` (string): Tipo do vinho (Tinto, Branco, etc.)
- `safra` (string): Ano da safra
- `regiao` (string): Região de origem

### Campos Opcionais:
- `pais` (string): País de origem
- `teorAlcoolico` (number): Teor alcoólico em %
- `volume` (number): Volume em ml
- `preco` (number): Preço em reais
- `notaAvaliacao` (number): Nota de 0 a 5
- `observacoes` (string): Observações gerais
- `caracteristicas` (string): Características do vinho

### Campos Automáticos:
- `createdAt` (timestamp): Data de criação
- `updatedAt` (timestamp): Data da última atualização
- `dataResposta` (timestamp): Data de resposta do formulário
- `status` (string): Status do registro
- `categoria` (string): Categoria baseada no tipo

## 🚀 Testando a Configuração

1. **Execute o projeto**: `npm run dev`
2. **Faça login no sistema**
3. **Tente cadastrar um vinho**
4. **Verifique no Firebase Console se o documento foi criado**

## ❓ Solução de Problemas

### Erro: "permission-denied"
- Verifique se as regras do Firestore estão corretas
- Confirme se o usuário está autenticado

### Erro: "network-request-failed"
- Verifique sua conexão com internet
- Confirme se o arquivo .env está correto

### Erro: "failed-precondition"
- Verifique se a coleção "vinhos" existe
- Confirme se o Firestore está habilitado no projeto

## 📝 Logs de Debug

O sistema agora inclui logs detalhados no console do navegador:
- ✅ Configuração carregada
- ✅ Vinho criado/atualizado
- ❌ Erros detalhados com códigos específicos
