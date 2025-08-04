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
  Rating
} from '@mui/material';
import {
  Save as SaveIcon,
  LocalBar as WineIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.3)',
      borderWidth: '1.5px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    }
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiInputLabel-root': {
      fontSize: '0.9rem'
    },
    '& .MuiOutlinedInput-input': {
      fontSize: '0.9rem'
    }
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.3)',
      borderWidth: '1.5px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    }
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiInputLabel-root': {
      fontSize: '0.9rem'
    },
    '& .MuiSelect-select': {
      fontSize: '0.9rem'
    }
  }
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    '& .MuiRating-iconFilled': {
      fontSize: '1.5rem'
    },
    '& .MuiRating-iconEmpty': {
      fontSize: '1.5rem'
    }
  }
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  minHeight: '100vh',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    margin: theme.spacing(0, 1),
    borderRadius: 12
  }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    marginBottom: theme.spacing(2)
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
    marginBottom: theme.spacing(1.5)
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 'bold',
  boxShadow: '0 4px 16px rgba(133, 60, 67, 0.3)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(133, 60, 67, 0.4)',
    transform: 'translateY(-2px)'
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(2, 3),
    fontSize: '1rem'
  }
}));

function CadastrarVinho() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const editId = searchParams.get('edit');
  const isEdit = Boolean(editId);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
    caracteristicas: ''
  });

  const [errors, setErrors] = useState({});

  // Carregar dados do vinho se for edição
  useEffect(() => {
    if (isEdit && editId) {
      loadVinhoData(editId);
    }
  }, [isEdit, editId]);

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
          caracteristicas: data.caracteristicas || ''
        });
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
      const vinhoData = {
        ...formData,
        dataResposta: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      let docId;

      if (isEdit) {
        // Atualizar vinho existente
        const docRef = doc(db, 'vinhos', editId);
        await updateDoc(docRef, vinhoData);
        docId = editId;
        setSuccess('Vinho atualizado com sucesso!');
      } else {
        // Criar novo vinho
        const docRef = await addDoc(collection(db, 'vinhos'), vinhoData);
        docId = docRef.id;
        setSuccess('Vinho cadastrado com sucesso!');
      }

      // Redirecionar para visualização após 2 segundos
      setTimeout(() => {
        navigate(`/visualizar?id=${docId}`);
      }, 2000);

    } catch (error) {
      console.error('Erro ao salvar vinho:', error);
      setError('Erro ao salvar vinho. Tente novamente.');
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
          <Grid container spacing={isMobile ? 2 : 3}>
            {/* Informações Básicas */}
            <Grid item xs={12}>
              <SectionTitle variant="h6" color="primary">
                Informações Básicas
              </SectionTitle>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                label="Nome do Vinho"
                value={formData.nomeVinho}
                onChange={(e) => handleInputChange('nomeVinho', e.target.value)}
                fullWidth
                required
                error={!!errors.nomeVinho}
                helperText={errors.nomeVinho}
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
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledFormControl fullWidth required error={!!errors.tipoVinho}>
                <InputLabel>Tipo do Vinho</InputLabel>
                <Select
                  value={formData.tipoVinho}
                  onChange={(e) => handleInputChange('tipoVinho', e.target.value)}
                  label="Tipo do Vinho"
                >
                  <MenuItem value="Tinto">Tinto</MenuItem>
                  <MenuItem value="Branco">Branco</MenuItem>
                  <MenuItem value="Rosé">Rosé</MenuItem>
                  <MenuItem value="Espumante">Espumante</MenuItem>
                  <MenuItem value="Fortificado">Fortificado</MenuItem>
                  <MenuItem value="Doce">Doce</MenuItem>
                </Select>
                {errors.tipoVinho && (
                  <FormHelperText>{errors.tipoVinho}</FormHelperText>
                )}
              </StyledFormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                label="Safra"
                value={formData.safra}
                onChange={(e) => handleInputChange('safra', e.target.value)}
                fullWidth
                required
                placeholder="Ex: 2020"
                error={!!errors.safra}
                helperText={errors.safra}
              />
            </Grid>

            {/* Origem */}
            <Grid item xs={12}>
              <SectionTitle variant="h6" color="primary">
                Origem
              </SectionTitle>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                label="Região"
                value={formData.regiao}
                onChange={(e) => handleInputChange('regiao', e.target.value)}
                fullWidth
                required
                error={!!errors.regiao}
                helperText={errors.regiao}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                label="País"
                value={formData.pais}
                onChange={(e) => handleInputChange('pais', e.target.value)}
                fullWidth
              />
            </Grid>

            {/* Características */}
            <Grid item xs={12}>
              <SectionTitle variant="h6" color="primary">
                Características
              </SectionTitle>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledTextField
                label="Teor Alcoólico (%)"
                value={formData.teorAlcoolico}
                onChange={(e) => handleInputChange('teorAlcoolico', e.target.value)}
                fullWidth
                placeholder="Ex: 13.5"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledTextField
                label="Volume (ml)"
                value={formData.volume}
                onChange={(e) => handleInputChange('volume', e.target.value)}
                fullWidth
                placeholder="Ex: 750"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledTextField
                label="Preço (R$)"
                value={formData.preco}
                onChange={(e) => handleInputChange('preco', e.target.value)}
                fullWidth
                placeholder="Ex: 89.90"
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                label="Características"
                value={formData.caracteristicas}
                onChange={(e) => handleInputChange('caracteristicas', e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Descreva as características do vinho (cor, aroma, sabor, etc.)"
              />
            </Grid>

            {/* Avaliação */}
            <Grid item xs={12}>
              <SectionTitle variant="h6" color="primary">
                Avaliação
              </SectionTitle>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography 
                  component="legend" 
                  gutterBottom
                  sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                >
                  Nota de Avaliação
                </Typography>
                <StyledRating
                  value={formData.notaAvaliacao}
                  onChange={(event, newValue) => {
                    handleInputChange('notaAvaliacao', newValue || 0);
                  }}
                  size={isMobile ? "medium" : "large"}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                label="Observações"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                fullWidth
                multiline
                rows={4}
                placeholder="Observações adicionais sobre o vinho..."
              />
            </Grid>

            {/* Botões */}
            <Grid item xs={12}>
              <Box 
                display="flex" 
                justifyContent={isMobile ? 'center' : 'flex-end'}
                mt={2}
              >
                <SubmitButton
                  type="submit"
                  variant="contained"
                  startIcon={submitLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Cadastrar')}
                </SubmitButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
}

export default CadastrarVinho;
