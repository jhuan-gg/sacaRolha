import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ErrorOutline, Home, ArrowBack } from '@mui/icons-material';

const ErrorContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.tertiary.main} 100%)`,
  padding: theme.spacing(2),
}));

const ErrorCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  borderRadius: 20,
  maxWidth: 500,
  width: '100%',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
    margin: theme.spacing(2),
  },
}));

const ErrorIcon = styled(ErrorOutline)(({ theme }) => ({
  fontSize: '6rem',
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: '4rem',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  borderRadius: 25,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
}));

function Error({ 
  errorCode = "404", 
  title = "Página não encontrada", 
  message = "A página que você está procurando não existe ou foi movida.",
  showBackButton = true,
  showHomeButton = true 
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/login');
  };

  return (
    <ErrorContainer>
      <Container maxWidth="sm">
        <ErrorCard elevation={24}>
          <ErrorIcon />
          
          <Typography
            variant="h1"
            sx={{
              fontSize: isMobile ? '4rem' : '6rem',
              fontWeight: 'bold',
              color: 'tertiary.main',
              marginBottom: 2,
              lineHeight: 1,
            }}
          >
            {errorCode}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontSize: isMobile ? '1.5rem' : '2rem',
              fontWeight: 'bold',
              color: 'tertiary.main',
              marginBottom: 2,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: isMobile ? '0.9rem' : '1.1rem',
              color: 'text.secondary',
              marginBottom: 4,
              lineHeight: 1.6,
            }}
          >
            {message}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {showBackButton && (
              <StyledButton
                variant="outlined"
                color="primary"
                onClick={handleGoBack}
                startIcon={<ArrowBack />}
                fullWidth={isMobile}
              >
                Voltar
              </StyledButton>
            )}

            {showHomeButton && (
              <StyledButton
                variant="contained"
                color="secondary"
                onClick={handleGoHome}
                startIcon={<Home />}
                fullWidth={isMobile}
              >
                Início
              </StyledButton>
            )}
          </Box>

          <Box sx={{ marginTop: 4 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.disabled',
                fontSize: '0.8rem',
              }}
            >
              SacaRolha - Confraria
            </Typography>
          </Box>
        </ErrorCard>
      </Container>
    </ErrorContainer>
  );
}

export default Error;
