import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Rating,
  InputAdornment,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  LocalBar as WineIcon,
  Euro as EuroIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Notes as NotesIcon,
  PhotoCamera as PhotoCameraIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  minHeight: '100vh',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    marginBottom: theme.spacing(2)
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
  background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: theme.spacing(1),
    borderRadius: 16
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px'
      }
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px'
      }
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500
  },
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1)
  },
  '& .MuiInputAdornment-root': {
    marginRight: theme.spacing(1)
  }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  fontSize: '1rem',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '10',
    color: theme.palette.primary.main
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main + '20',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main + '30'
    }
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  minHeight: '48px',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  boxShadow: '0 4px 20px rgba(133, 60, 67, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(133, 60, 67, 0.4)',
    transform: 'translateY(-2px)',
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
  },
  '&:disabled': {
    background: theme.palette.grey[300],
    color: theme.palette.grey[500]
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(2, 3),
    fontSize: '1rem',
    minHeight: '52px'
  }
}));

const SectionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0, 1, 2, 1),
    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.03)'
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
    marginBottom: theme.spacing(1.5)
  }
}));

const ImageUploadContainer = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.grey[300]}`,
  borderRadius: 12,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main + '05'
  },
  '&.dragover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main + '10'
  }
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '& img': {
    width: '100%',
    maxWidth: '300px',
    height: 'auto',
    maxHeight: '200px',
    objectFit: 'cover',
    display: 'block'
  }
}));

const RemoveImageButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  minWidth: 'auto',
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: 'rgba(244, 67, 54, 0.9)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(244, 67, 54, 1)'
  }
}));

function Cadastrar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const editId = searchParams.get('edit');
  const isEdit = Boolean(editId);
  const { currentUser: user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    nomeVinho: '',
    produtor: '',
    tipoVinho: '',
    safra: '',
    regiao: '',
    pais: '',
    teorAlcoolico: '',
    volume: '',
    preco: '',
    notaAvaliacao: 0,
    observacoes: '',
    caracteristicas: '',
    imagemUrl: ''
  });

  const [errors, setErrors] = useState({});

  // Carregar dados do vinho se for edição
  useEffect(() => {
    if (isEdit && editId) {
      loadVinhoData(editId);
    }
  }, [isEdit, editId]);

  // Função para abrir câmera
  const openCamera = (e) => {
    e.stopPropagation();
    const input = document.getElementById('image-upload-input');
    input.setAttribute('capture', 'environment');
    input.click();
  };

  // Função para abrir galeria
  const openGallery = (e) => {
    e.stopPropagation();
    const input = document.getElementById('image-upload-input');
    input.removeAttribute('capture');
    input.click();
  };

  // Função para lidar com seleção de arquivo de imagem
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB.');
        return;
      }
      
      setImageFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setError(''); // Limpar erros anteriores
    }
  };

  // Função para remover a imagem
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imagemUrl: '' }));
    
    // Limpar o input file
    const fileInput = document.getElementById('image-upload-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Função para converter imagem para base64 (para armazenar no Firestore como exemplo)
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Função para simular upload (você pode integrar com Firebase Storage depois)
  const uploadImage = async (file) => {
    try {
      setUploadingImage(true);
      
      // Por enquanto, vamos converter para base64 e armazenar no Firestore
      // Em produção, seria melhor usar Firebase Storage
      const base64Image = await convertToBase64(file);
      
      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return base64Image;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const loadVinhoData = async (id) => {
    try {
      setLoading(true);
      const docRef = doc(db, 'vinhos', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          nomeVinho: data.nomeVinho || '',
          produtor: data.produtor || '',
          tipoVinho: data.tipoVinho || '',
          safra: data.safra || '',
          regiao: data.regiao || '',
          pais: data.pais || '',
          teorAlcoolico: data.teorAlcoolico || '',
          volume: data.volume || '',
          preco: data.preco || '',
          notaAvaliacao: data.notaAvaliacao || 0,
          observacoes: data.observacoes || '',
          caracteristicas: data.caracteristicas || '',
          imagemUrl: data.imagemUrl || ''
        });
        
        // Se há uma imagem, definir o preview
        if (data.imagemUrl) {
          setImagePreview(data.imagemUrl);
        }
      } else {
        setError('Vinho não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do vinho:', error);
      setError('Erro ao carregar dados do vinho');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo se existir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeVinho.trim()) {
      newErrors.nomeVinho = 'Nome do vinho é obrigatório';
    }

    if (!formData.produtor.trim()) {
      newErrors.produtor = 'Produtor é obrigatório';
    }

    if (!formData.tipoVinho) {
      newErrors.tipoVinho = 'Tipo do vinho é obrigatório';
    }

    if (!formData.safra.trim()) {
      newErrors.safra = 'Safra é obrigatória';
    }

    if (!formData.regiao.trim()) {
      newErrors.regiao = 'Região é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Por favor, corrija os erros no formulário');
      return;
    }

    setSubmitLoading(true);
    setError('');
    setSuccess('');

    try {
      // Upload da imagem se houver uma nova
      let imagemUrl = formData.imagemUrl;
      if (imageFile) {
        try {
          imagemUrl = await uploadImage(imageFile);
        } catch (uploadError) {
          console.error('Erro no upload da imagem:', uploadError);
          setError('Erro ao fazer upload da imagem. Salvando sem a imagem.');
          imagemUrl = '';
        }
      }

      // Preparar dados para o Firestore com validação e formatação
      const vinhoData = {
        // Campos obrigatórios
        nomeVinho: formData.nomeVinho.trim(),
        produtor: formData.produtor.trim(),
        tipoVinho: formData.tipoVinho,
        safra: formData.safra.trim(),
        regiao: formData.regiao.trim(),
        
        // Campos opcionais
        pais: formData.pais?.trim() || '',
        teorAlcoolico: formData.teorAlcoolico ? parseFloat(formData.teorAlcoolico) : null,
        volume: formData.volume ? parseInt(formData.volume) : null,
        preco: formData.preco ? parseFloat(formData.preco) : null,
        notaAvaliacao: formData.notaAvaliacao || 0,
        observacoes: formData.observacoes?.trim() || '',
        caracteristicas: formData.caracteristicas?.trim() || '',
        imagemUrl: imagemUrl || '',
        
        // Metadados e informações do usuário
        createdAt: isEdit ? undefined : serverTimestamp(),
        updatedAt: serverTimestamp(),
        dataResposta: serverTimestamp(),
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'não informado',
        
        // Campos adicionais para melhor organização
        status: 'ativo',
        categoria: formData.tipoVinho || 'Não especificado',
        
        // Campos calculados
        precoFormatado: formData.preco ? `R$ ${parseFloat(formData.preco).toFixed(2)}` : null,
        volumeFormatado: formData.volume ? `${formData.volume}ml` : null,
        teorAlcoolicoFormatado: formData.teorAlcoolico ? `${formData.teorAlcoolico}%` : null
      };

      // Remover campos undefined para evitar problemas no Firestore
      Object.keys(vinhoData).forEach(key => {
        if (vinhoData[key] === undefined) {
          delete vinhoData[key];
        }
      });

      let docId;

      if (isEdit) {
        // Atualizar vinho existente
        const docRef = doc(db, 'vinhos', editId);
        await updateDoc(docRef, vinhoData);
        docId = editId;
        setSuccess('Vinho atualizado com sucesso!');
        console.log('✅ Vinho atualizado:', docId);
      } else {
        // Criar novo vinho
        const docRef = await addDoc(collection(db, 'vinhos'), vinhoData);
        docId = docRef.id;
        setSuccess('Vinho cadastrado com sucesso!');
        console.log('✅ Novo vinho criado:', docId, vinhoData);
      }

      // Redirecionar para visualização após 2 segundos
      setTimeout(() => {
        navigate(`/visualizar?id=${docId}`);
      }, 2000);

    } catch (error) {
      console.error('❌ Erro detalhado ao salvar vinho:', error);
      console.error('Código do erro:', error.code);
      console.error('Mensagem do erro:', error.message);
      
      // Tratamento específico de erros do Firestore
      let errorMessage = 'Erro ao salvar vinho. Tente novamente.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Erro de permissão. Verifique as regras do Firestore.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Serviço temporariamente indisponível. Tente novamente.';
      } else if (error.code === 'failed-precondition') {
        errorMessage = 'Erro de configuração do banco de dados.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      setError(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <StyledContainer maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={50} />
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="md">
      <HeaderBox>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          fontWeight="bold" 
          color="primary"
        >
          <WineIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          {isEdit ? 'Editar Vinho' : 'Cadastrar Vinho'}
        </Typography>
        <Typography 
          variant={isMobile ? "body2" : "subtitle1"} 
          color="text.secondary"
        >
          {isEdit ? 'Edite as informações do vinho' : 'Preencha as informações do vinho'}
        </Typography>
      </HeaderBox>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            mx: isMobile ? 1 : 0,
            borderRadius: 3
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            mx: isMobile ? 1 : 0,
            borderRadius: 3
          }}
        >
          {success}
        </Alert>
      )}

      <StyledPaper>
        <form onSubmit={handleSubmit}>
          {/* Seção: Foto do Vinho */}
          <SectionCard>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <SectionTitle>
                <PhotoCameraIcon color="primary" />
                Foto do Vinho
              </SectionTitle>
              
              {/* Input escondido para upload */}
              <input
                id="image-upload-input"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              
              {!imagePreview ? (
                <ImageUploadContainer
                  onClick={() => document.getElementById('image-upload-input').click()}
                >
                  <CloudUploadIcon 
                    sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} 
                  />
                  <Typography variant="h6" gutterBottom>
                    Adicionar Foto do Vinho
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Clique para tirar uma foto ou selecionar dos arquivos
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Formatos aceitos: JPG, PNG, WEBP (máx. 5MB)
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      size="small"
                      onClick={openCamera}
                    >
                      Câmera
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      size="small"
                      onClick={openGallery}
                    >
                      Galeria
                    </Button>
                  </Box>
                </ImageUploadContainer>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <ImagePreview>
                    <img src={imagePreview} alt="Preview do vinho" />
                    <RemoveImageButton
                      onClick={handleRemoveImage}
                      disabled={uploadingImage}
                    >
                      <DeleteIcon fontSize="small" />
                    </RemoveImageButton>
                  </ImagePreview>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {imageFile ? `📁 ${imageFile.name}` : '🖼️ Imagem carregada'}
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      size="small"
                      onClick={() => document.getElementById('image-upload-input').click()}
                      disabled={uploadingImage}
                      sx={{ mr: 1 }}
                    >
                      Trocar Foto
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      size="small"
                      onClick={handleRemoveImage}
                      disabled={uploadingImage}
                    >
                      Remover
                    </Button>
                  </Box>
                  
                  {uploadingImage && (
                    <Box sx={{ mt: 2 }}>
                      <CircularProgress size={24} />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Processando imagem...
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </SectionCard>

          {/* Seção: Informações Básicas */}
          <SectionCard>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <SectionTitle>
                <WineIcon color="primary" />
                Informações Básicas
              </SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    label="Nome do Vinho"
                    value={formData.nomeVinho}
                    onChange={(e) => handleInputChange('nomeVinho', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.nomeVinho}
                    helperText={errors.nomeVinho}
                    placeholder="Ex: Château Margaux 2010"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledTextField
                    label="Produtor"
                    value={formData.produtor}
                    onChange={(e) => handleInputChange('produtor', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.produtor}
                    helperText={errors.produtor}
                    placeholder="Ex: Miolo Wine Group"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <StyledFormControl fullWidth required error={!!errors.tipoVinho}>
                    <InputLabel id="tipo-vinho-label">Tipo do Vinho</InputLabel>
                    <Select
                      labelId="tipo-vinho-label"
                      value={formData.tipoVinho}
                      label="Tipo do Vinho"
                      onChange={(e) => handleInputChange('tipoVinho', e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <WineIcon color="action" />
                        </InputAdornment>
                      }
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 6 + 8,
                            width: 250,
                            borderRadius: 12,
                            marginTop: 8
                          }
                        }
                      }}
                    >
                      <StyledMenuItem value="Tinto">🍷 Tinto</StyledMenuItem>
                      <StyledMenuItem value="Branco">🥂 Branco</StyledMenuItem>
                      <StyledMenuItem value="Rosé">🌹 Rosé</StyledMenuItem>
                      <StyledMenuItem value="Espumante">🍾 Espumante</StyledMenuItem>
                      <StyledMenuItem value="Sobremesa">🍯 Sobremesa</StyledMenuItem>
                      <StyledMenuItem value="Fortificado">🥃 Fortificado</StyledMenuItem>
                    </Select>
                    {errors.tipoVinho && <FormHelperText>{errors.tipoVinho}</FormHelperText>}
                  </StyledFormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <StyledTextField
                    label="Safra"
                    value={formData.safra}
                    onChange={(e) => handleInputChange('safra', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.safra}
                    helperText={errors.safra}
                    placeholder="Ex: 2020"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <StyledTextField
                    label="Teor Alcoólico (%)"
                    value={formData.teorAlcoolico}
                    onChange={(e) => handleInputChange('teorAlcoolico', e.target.value)}
                    fullWidth
                    placeholder="Ex: 13.5"
                    type="number"
                    inputProps={{ step: "0.1", min: "0", max: "20" }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </SectionCard>

          {/* Seção: Origem */}
          <SectionCard>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <SectionTitle>
                <LocationIcon color="primary" />
                Origem
              </SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    label="Região"
                    value={formData.regiao}
                    onChange={(e) => handleInputChange('regiao', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.regiao}
                    helperText={errors.regiao}
                    placeholder="Ex: Vale dos Vinhedos"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledTextField
                    label="País"
                    value={formData.pais}
                    onChange={(e) => handleInputChange('pais', e.target.value)}
                    fullWidth
                    placeholder="Ex: Brasil"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </SectionCard>

          {/* Seção: Detalhes Comerciais */}
          <SectionCard>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <SectionTitle>
                <EuroIcon color="primary" />
                Detalhes Comerciais
              </SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    label="Volume (ml)"
                    value={formData.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                    fullWidth
                    placeholder="Ex: 750"
                    type="number"
                    inputProps={{ min: "0" }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <StyledTextField
                    label="Preço (R$)"
                    value={formData.preco}
                    onChange={(e) => handleInputChange('preco', e.target.value)}
                    fullWidth
                    placeholder="Ex: 150.00"
                    type="number"
                    inputProps={{ step: "0.01", min: "0" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          R$
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography component="legend" gutterBottom fontWeight="500">
                      Avaliação
                    </Typography>
                    <Rating
                      value={formData.notaAvaliacao}
                      onChange={(event, newValue) => {
                        handleInputChange('notaAvaliacao', newValue || 0);
                      }}
                      size="large"
                      precision={0.5}
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formData.notaAvaliacao > 0 ? `${formData.notaAvaliacao} estrelas` : 'Sem avaliação'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </SectionCard>

          {/* Seção: Observações */}
          <SectionCard>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <SectionTitle>
                <NotesIcon color="primary" />
                Características e Observações
              </SectionTitle>
              <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    label="Características"
                    value={formData.caracteristicas}
                    onChange={(e) => handleInputChange('caracteristicas', e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Ex: Notas de frutas vermelhas, taninos macios, final longo..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledTextField
                    label="Observações"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Ex: Ideal para acompanhar carnes vermelhas, servir entre 16-18°C..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </SectionCard>

          {/* Botões de Ação */}
          <Box sx={{ 
            mt: 4, 
            display: 'flex', 
            gap: 2, 
            justifyContent: isMobile ? 'center' : 'flex-end', 
            flexWrap: 'wrap',
            px: isMobile ? 1 : 0
          }}>
            <SubmitButton
              type="submit"
              variant="contained"
              startIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={submitLoading}
            >
              {submitLoading ? 'Salvando...' : (isEdit ? 'Atualizar Vinho' : 'Cadastrar Vinho')}
            </SubmitButton>
          </Box>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
}

export default Cadastrar;
