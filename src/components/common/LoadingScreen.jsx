import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

function LoadingScreen({ message = "Carregando...", minimal = false }) {
  const theme = useTheme();

  if (minimal) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px',
          width: '100%'
        }}
      >
        <CircularProgress size={30} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        position: 'relative'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 3,
          borderRadius: 2,
          textAlign: 'center',
          maxWidth: 350,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CircularProgress
          size={50}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            mb: 2
          }}
        />
        
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: theme.palette.text.primary,
            fontWeight: 'medium'
          }}
        >
          SacaRolha
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary
          }}
        >
          {message}
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoadingScreen;
