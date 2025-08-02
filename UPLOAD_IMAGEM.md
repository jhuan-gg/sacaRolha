# 📸 Sistema de Upload de Fotos - SacaRolha

## ✨ Funcionalidades Implementadas

### 🔧 Componente de Upload de Imagem
- **Seleção de arquivos**: Clique para selecionar da galeria
- **Captura de câmera**: Botão específico para tirar foto
- **Drag & Drop**: Arrastar e soltar imagens (implementação futura)
- **Preview em tempo real**: Visualização imediata da imagem selecionada
- **Validação de arquivos**: Apenas imagens, máximo 5MB

### 📱 Interface Responsiva
- **Design moderno**: Cards com bordas arredondadas e sombras
- **Botões intuitivos**: Câmera e Galeria claramente separados
- **Preview elegante**: Imagem com botão de remoção sobreposto
- **Estados visuais**: Loading, erro e sucesso

### 🔒 Validações Implementadas
- **Tipo de arquivo**: Apenas imagens (JPG, PNG, WEBP, etc.)
- **Tamanho máximo**: 5MB por imagem
- **Feedback de erro**: Mensagens claras para o usuário

## 🗃️ Armazenamento Atual

### Base64 no Firestore (Implementação Inicial)
Por simplicidade inicial, as imagens são convertidas para Base64 e armazenadas diretamente no documento do Firestore.

**Vantagens:**
- Implementação simples
- Não requer configuração adicional
- Funciona imediatamente

**Limitações:**
- Tamanho do documento limitado (1MB no Firestore)
- Performance reduzida com imagens grandes
- Não é escalável para muitas imagens

## 🚀 Migração Futura para Firebase Storage

### Por que migrar?
- **Melhor performance**: Imagens servidas diretamente do CDN
- **Sem limitação de tamanho**: Documentos Firestore permanecem pequenos
- **Otimização automática**: Redimensionamento e compressão
- **URLs públicas**: Fácil compartilhamento e exibição

### Estrutura recomendada:
```
/vinhos/
  /{vinhoId}/
    /imagem_principal.jpg
    /imagem_secundaria.jpg (futuro)
```

### Código para migração:
```javascript
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadToStorage = async (file, vinhoId) => {
  const storage = getStorage();
  const imageRef = ref(storage, `vinhos/${vinhoId}/imagem_principal.jpg`);
  
  const snapshot = await uploadBytes(imageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};
```

## 🎯 Funcionalidades Futuras

### 📷 Melhorias na Captura
- **Múltiplas fotos**: Rótulo, garrafa, selo
- **Crop automático**: Detecção de garrafas
- **Filtros**: Melhorar qualidade da foto
- **Compressão client-side**: Reduzir tamanho antes do upload

### 🔍 Reconhecimento de Imagem
- **OCR para rótulos**: Extrair texto automaticamente
- **Detecção de marca**: Identificar produtor pela imagem
- **Sugestões automáticas**: Preencher campos baseado na foto

### 📱 PWA Features
- **Offline support**: Salvar fotos localmente
- **Background sync**: Upload quando conectar
- **Native camera**: Integração completa com câmera

## 📊 Estrutura de Dados

### Documento Firestore:
```javascript
{
  // ... outros campos do vinho
  imagemUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...", // Base64 atual
  // OU (futuro)
  imagemUrl: "https://firebasestorage.googleapis.com/v0/b/projeto/o/vinhos%2F123%2Fimagem.jpg",
  
  // Metadados da imagem
  imagemMetadata: {
    nomeOriginal: "foto_vinho.jpg",
    tamanho: 2048576, // bytes
    tipo: "image/jpeg",
    dataUpload: "timestamp",
    dimensoes: { width: 1920, height: 1080 }
  }
}
```

## 🧪 Como Testar

### 1. Upload via Galeria
1. Abra o formulário de cadastro
2. Clique em "Galeria" na seção de foto
3. Selecione uma imagem
4. Verifique o preview
5. Cadastre o vinho

### 2. Upload via Câmera (mobile)
1. Acesse pelo celular
2. Clique em "Câmera"
3. Tire uma foto
4. Confirme e cadastre

### 3. Remoção de Imagem
1. Com uma imagem selecionada
2. Clique no ❌ no canto da imagem
3. OU clique em "Remover"
4. Confirme que o preview desaparece

## 🐛 Troubleshooting

### Imagem não aparece
- Verifique se o arquivo é uma imagem válida
- Confirme se o tamanho é menor que 5MB
- Teste com diferentes formatos (JPG, PNG)

### Erro no upload
- Verifique a conexão com internet
- Confirme se o usuário está autenticado
- Verifique as regras do Firestore

### Performance lenta
- Considere reduzir o tamanho da imagem
- Implemente compressão client-side
- Migre para Firebase Storage

## 📝 Próximos Passos

1. **Testar em diferentes dispositivos**
2. **Implementar compressão de imagem**
3. **Migrar para Firebase Storage**
4. **Adicionar múltiplas fotos**
5. **Implementar reconhecimento de texto**
