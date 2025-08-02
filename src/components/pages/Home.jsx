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
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LocalBar as WineIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    margin: theme.spacing(0, 1, 2, 1)
  }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center',
    marginBottom: theme.spacing(3)
  }
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    padding: theme.spacing(0, 1)
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 4),
  fontWeight: 'bold',
  textTransform: 'none',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 3),
    fontSize: '1rem'
  }
}));

function Home() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <StyledContainer maxWidth="lg">
      <HeaderBox>
        <WineIcon sx={{ 
          fontSize: isMobile ? 40 : 48, 
          mr: isMobile ? 0 : 2, 
          mb: isMobile ? 1 : 0,
          color: 'primary.main' 
        }} />
        <Box>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h1" 
            fontWeight="bold" 
            color="primary"
          >
            SacaRolha
          </Typography>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            color="text.secondary"
          >
            Sistema de Cadastro de Vinhos
          </Typography>
        </Box>
      </HeaderBox>

      <Alert 
        severity="info" 
        sx={{ 
          mb: 3,
          mx: isMobile ? 1 : 0,
          borderRadius: 3
        }}
      >
        <Typography variant="h6" gutterBottom>
          Sistema Configurado com Sucesso! 🎉
        </Typography>
        <Typography>
          O sistema de cadastro de vinhos está pronto para uso. 
          Para funcionalidade completa, configure o Firebase seguindo as instruções em FIREBASE_SETUP.md
        </Typography>
      </Alert>

      <StyledPaper>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          gutterBottom 
          color="primary"
          fontWeight="bold"
        >
          Funcionalidades do Sistema
        </Typography>
        
        <List>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon>
                {getStatusIcon(feature.status)}
              </ListItemIcon>
              <ListItemText
                primary={feature.name}
                secondary={feature.description}
                primaryTypographyProps={{
                  fontWeight: 'medium',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}
                secondaryTypographyProps={{
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}
              />
            </ListItem>
          ))}
        </List>
      </StyledPaper>

      <StyledPaper>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          gutterBottom 
          color="primary"
          fontWeight="bold"
        >
          Estrutura do Sistema
        </Typography>
        
        <Typography 
          paragraph
          sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
        >
          <strong>📋 Listagem:</strong> Exibe todos os vinhos cadastrados em formato de tabela (desktop) 
          e cards (mobile), com ID, Data/Hora da Resposta e botões de ação.
        </Typography>
        
        <Typography 
          paragraph
          sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
        >
          <strong>➕ Cadastro:</strong> Formulário completo para cadastrar novos vinhos com validação 
          de campos obrigatórios e feedback ao usuário.
        </Typography>
        
        <Typography 
          paragraph
          sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
        >
          <strong>👁️ Visualização:</strong> Página dedicada que recebe parâmetro ID via URL 
          (/visualizar?id=ID_DO_REGISTRO) e exibe todos os dados do vinho de forma organizada.
        </Typography>
        
        <Typography 
          paragraph
          sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
        >
          <strong>🔥 Firebase:</strong> Integração completa com Firestore para persistência de dados 
          e Firebase Auth para autenticação de usuários.
        </Typography>
      </StyledPaper>

      <ButtonContainer>
        <StyledButton
          variant="contained"
          size="large"
          onClick={() => navigate('/listagem')}
          fullWidth={isMobile}
        >
          Ver Listagem de Vinhos
        </StyledButton>
        
        <StyledButton
          variant="outlined"
          size="large"
          onClick={() => navigate('/cadastrar')}
          fullWidth={isMobile}
        >
          Cadastrar Novo Vinho
        </StyledButton>
      </ButtonContainer>
    </StyledContainer>
  );
}

export default Home;
