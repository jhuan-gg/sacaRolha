import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  LocalBar as WineIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      name: 'Cadastro de Vinhos',
      status: 'ready',
      description: 'Sistema completo para cadastrar informações de vinhos'
    },
    {
      name: 'Listagem de Vinhos',
      status: 'ready',
      description: 'Visualização em tabela e cards responsivos'
    },
    {
      name: 'Visualização Detalhada',
      status: 'ready',
      description: 'Página dedicada para visualizar todos os detalhes do vinho'
    },
    {
      name: 'Integração Firebase',
      status: 'config',
      description: 'Configuração do Firebase necessária'
    },
    {
      name: 'Autenticação',
      status: 'config',
      description: 'Sistema de login e controle de acesso'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <CheckCircleIcon color="success" />;
      case 'config':
        return <WarningIcon color="warning" />;
      default:
        return <ErrorIcon color="error" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <WineIcon sx={{ fontSize: 48, mr: 2, color: 'primary.main' }} />
        <Box>
          <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
            SacaRolha
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Sistema de Cadastro de Vinhos
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Sistema Configurado com Sucesso! 🎉
        </Typography>
        <Typography>
          O sistema de cadastro de vinhos está pronto para uso. 
          Para funcionalidade completa, configure o Firebase seguindo as instruções em FIREBASE_SETUP.md
        </Typography>
      </Alert>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Funcionalidades do Sistema
        </Typography>
        
        <List>
          {features.map((feature, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {getStatusIcon(feature.status)}
              </ListItemIcon>
              <ListItemText
                primary={feature.name}
                secondary={feature.description}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Estrutura do Sistema
        </Typography>
        
        <Typography paragraph>
          <strong>📋 Listagem:</strong> Exibe todos os vinhos cadastrados em formato de tabela (desktop) 
          e cards (mobile), com ID, Data/Hora da Resposta e botões de ação.
        </Typography>
        
        <Typography paragraph>
          <strong>➕ Cadastro:</strong> Formulário completo para cadastrar novos vinhos com validação 
          de campos obrigatórios e feedback ao usuário.
        </Typography>
        
        <Typography paragraph>
          <strong>👁️ Visualização:</strong> Página dedicada que recebe parâmetro ID via URL 
          (/visualizar?id=ID_DO_REGISTRO) e exibe todos os dados do vinho de forma organizada.
        </Typography>
        
        <Typography paragraph>
          <strong>🔥 Firebase:</strong> Integração completa com Firestore para persistência de dados 
          e Firebase Auth para autenticação de usuários.
        </Typography>
      </Paper>

      <Box display="flex" gap={2} justifyContent="center">
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/listagem')}
          sx={{ px: 4, py: 2 }}
        >
          Ver Listagem de Vinhos
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/cadastrar')}
          sx={{ px: 4, py: 2 }}
        >
          Cadastrar Novo Vinho
        </Button>
      </Box>
    </Container>
  );
}

export default Home;
