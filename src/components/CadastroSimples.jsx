import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
} from '@mui/material';
import {
  Save as SaveIcon,
} from '@mui/icons-material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

function CadastroSimples({ onWineCreated, showHeader = true, onNext, onCancel }) {
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
    <Box>
      {showHeader && (
        <Typography variant="h5" fontWeight="bold" color="#000000" mb={3}>
          Cadastro de Vinho
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ border: '2px solid #000000', borderRadius: 2 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Informações Básicas */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" color="#000000" mb={2}>
                  Informações Básicas
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
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="regiao"
                  label="Região"
                  value={formData.regiao}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="produtor"
                  label="Produtor"
                  value={formData.produtor}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="uva"
                  label="Uva/Casta"
                  value={formData.uva}
                  onChange={handleChange}
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
                />
              </Grid>

              {/* Informações de Compra */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" color="#000000" mb={2} mt={2}>
                  Informações de Compra
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
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="localCompra"
                  label="Local da Compra"
                  value={formData.localCompra}
                  onChange={handleChange}
                />
              </Grid>

              {/* Avaliação */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" color="#000000" mb={2} mt={2}>
                  Avaliação
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" color="#000000" mb={1}>
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
                />
              </Grid>

              {/* Botões */}
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
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
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
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
        </CardContent>
      </Card>
    </Box>
  );
}

export default CadastroSimples;
