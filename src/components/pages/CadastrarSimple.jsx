import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

function CadastrarSimple() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/home')}
        sx={{ mb: 3 }}
      >
        Voltar
      </Button>
      
      <Typography variant="h4" gutterBottom>
        Cadastrar Vinho - Teste
      </Typography>
      
      <Typography variant="body1" color="text.secondary">
        Esta é uma página de teste para verificar se o problema está no componente original.
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/home')}
          sx={{ mr: 2 }}
        >
          Voltar ao Dashboard
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
        >
          Recarregar Página
        </Button>
      </Box>
    </Container>
  );
}

export default CadastrarSimple;
