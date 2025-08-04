import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Slide
} from '@mui/material';
import {
  GetApp as InstallIcon,
  Close as CloseIcon,
  Smartphone as PhoneIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    maxWidth: 400,
    margin: theme.spacing(2),
    background: 'linear-gradient(135deg, #395a4f 0%, #432330 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'visible'
  }
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    fontSize: 48,
    color: 'rgba(255, 255, 255, 0.9)'
  }
}));

const InstallButton = styled(Button)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.15)',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  border: '1px solid rgba(255, 255, 255, 0.3)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.25)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
  },
  transition: 'all 0.3s ease'
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  fontWeight: 'medium',
  '&:hover': {
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)'
  }
}));

function PWAInstallPrompt({ open, onClose, onInstall }) {
  const [installing, setInstalling] = useState(false);

  const handleInstall = async () => {
    setInstalling(true);
    
    try {
      const success = await onInstall();
      
      if (success) {
        // Pequeno delay para mostrar feedback
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error('Erro na instalação:', error);
    } finally {
      setInstalling(false);
    }
  };

  const handleClose = () => {
    if (!installing) {
      onClose();
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1, pt: 3, position: 'relative' }}>
        <IconButton
          onClick={handleClose}
          disabled={installing}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <IconContainer>
          <PhoneIcon />
        </IconContainer>
        
        <Typography 
          variant="h6" 
          align="center" 
          fontWeight="bold"
          sx={{ fontSize: '1.3rem' }}
        >
          Instalar SacaRolha
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            opacity: 0.9, 
            lineHeight: 1.6,
            mb: 2
          }}
        >
          Instale o SacaRolha no seu dispositivo para uma experiência mais rápida e conveniente.
        </Typography>
        
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: 2, 
          p: 2,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', opacity: 0.8 }}>
            ✓ Acesso offline limitado{'\n'}
            ✓ Inicialização mais rápida{'\n'}
            ✓ Experiência de app nativo{'\n'}
            ✓ Ícone na tela inicial
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <CancelButton 
          onClick={handleClose}
          disabled={installing}
          fullWidth
        >
          Agora não
        </CancelButton>
        
        <InstallButton
          onClick={handleInstall}
          disabled={installing}
          startIcon={<InstallIcon />}
          fullWidth
        >
          {installing ? 'Instalando...' : 'Instalar'}
        </InstallButton>
      </DialogActions>
    </StyledDialog>
  );
}

export default PWAInstallPrompt;
