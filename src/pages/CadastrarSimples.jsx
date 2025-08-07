import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Fade,
} from '@mui/material';
import {
  Save as SaveIcon,
  LocalBar as WineIcon,
} from '@mui/icons-material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

function CadastrarSimples({ onWineCreated, showHeader = true, onNext, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    pais: '',
    regiao: '',
    produtor: '',
    safra: '',
    abv: '',
    uva: '',
    valor: '',
    dataCompra: '',
    localCompra: '',
    caracteristicas: '',
    observacoes: '',
    notaGeral: 0
  });

  const tiposVinho = [
    'Tinto',
    'Branco',
    'Rosé',
    'Espumante',
    'Fortificado',
    'Sobremesa'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (value) => {
    setFormData(prev => ({
      ...prev,
      notaGeral: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      setError('Nome do vinho é obrigatório');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const vinhoData = {
        ...formData,
        safra: formData.safra ? parseInt(formData.safra) : null,
        abv: formData.abv ? parseFloat(formData.abv) : null,
        valor: formData.valor ? parseFloat(formData.valor) : null,
        dataCadastro: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'vinhos'), vinhoData);
      
      setSuccess('Vinho cadastrado com sucesso!');
      
      // Reset form
      setFormData({
        nome: '',
        tipo: '',
        pais: '',
        regiao: '',
        produtor: '',
        safra: '',
        abv: '',
        uva: '',
        valor: '',
        dataCompra: '',
        localCompra: '',
        caracteristicas: '',
        observacoes: '',
        notaGeral: 0
      });

      if (onWineCreated) {
        onWineCreated({ id: docRef.id, ...vinhoData });
      }

      if (onNext) {
        setTimeout(() => onNext(), 1500);
      }

    } catch (err) {
      console.error('Erro ao cadastrar vinho:', err);
      setError('Erro ao cadastrar vinho. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in={true} timeout={600}>
      <Box sx={{ p: { xs: 2, md: 0 } }}>
        {showHeader && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <WineIcon sx={{ fontSize: 48, color: '#000000', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" color="#000000" gutterBottom>
              Cadastro de Vinho
            </Typography>
            <Typography variant="subtitle1" color="#666666">
              Adicione um novo vinho à sua coleção
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informações Básicas */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" color="#000000" mb={2} sx={{ borderBottom: '2px solid #000000', pb: 1 }}>
                INFORMAÇÕES BÁSICAS
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="nome"
                label="Nome do Vinho *"
                value={formData.nome}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  label="Tipo"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                    },
                  }}
                >
                  {tiposVinho.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="pais"
                label="País"
                value={formData.pais}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="regiao"
                label="Região"
                value={formData.regiao}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="produtor"
                label="Produtor"
                value={formData.produtor}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="uva"
                label="Uva/Casta"
                value={formData.uva}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="safra"
                label="Safra"
                type="number"
                value={formData.safra}
                onChange={handleChange}
                inputProps={{ min: 1900, max: new Date().getFullYear() }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="abv"
                label="Teor Alcoólico (%)"
                type="number"
                value={formData.abv}
                onChange={handleChange}
                inputProps={{ min: 0, max: 20, step: 0.1 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            {/* Informações de Compra */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" color="#000000" mb={2} mt={2} sx={{ borderBottom: '2px solid #000000', pb: 1 }}>
                INFORMAÇÕES DE COMPRA
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="valor"
                label="Valor (R$)"
                type="number"
                value={formData.valor}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="dataCompra"
                label="Data da Compra"
                type="date"
                value={formData.dataCompra}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="localCompra"
                label="Local da Compra"
                value={formData.localCompra}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            {/* Avaliação */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" color="#000000" mb={2} mt={2} sx={{ borderBottom: '2px solid #000000', pb: 1 }}>
                AVALIAÇÃO
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" color="#000000" mb={1} fontWeight="bold">
                  Nota Geral
                </Typography>
                <Rating
                  value={formData.notaGeral}
                  onChange={(event, newValue) => handleRatingChange(newValue)}
                  size="large"
                  sx={{ color: '#000000' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="caracteristicas"
                label="Características"
                multiline
                rows={3}
                value={formData.caracteristicas}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="observacoes"
                label="Observações"
                multiline
                rows={3}
                value={formData.observacoes}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000',
                  },
                }}
              />
            </Grid>

            {/* Botões */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                {onCancel && (
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    sx={{
                      borderColor: '#000000',
                      color: '#000000',
                      '&:hover': {
                        borderColor: '#000000',
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#333333',
                    },
                    '&:disabled': {
                      backgroundColor: '#666666',
                    },
                  }}
                >
                  {loading ? 'Salvando...' : 'Salvar Vinho'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Fade>
  );
}

export default CadastrarSimples;
