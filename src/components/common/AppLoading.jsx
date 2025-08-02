import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.tertiary.main} 100%)`,
  color: 'white'
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  color: 'white',
  marginBottom: theme.spacing(2)
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  color: 'white',
  marginTop: theme.spacing(2),
  textAlign: 'center'
}));

const LoadingProgress = styled(LinearProgress)(({ theme }) => ({
  width: '200px',
  marginTop: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: 'white'
  }
}));

const AppLoading = ({ message = 'Carregando...', showProgress = false }) => {
  return (
    <LoadingContainer>
      <LoadingSpinner size={50} />
      <LoadingText variant="h6">
        {message}
      </LoadingText>
      {showProgress && <LoadingProgress />}
    </LoadingContainer>
  );
};

export default AppLoading;
