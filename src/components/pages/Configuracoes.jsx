import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  useTheme
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    margin: theme.spacing(1, 1, 3, 1),
    borderRadius: 12
  }
}));

const SettingCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
  '&:last-child': {
    marginBottom: 0
  }
}));

function Configuracoes() {
  const theme = useTheme();
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: false,
    autoSave: true,
    twoFactor: false
  });

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const settingSections = [
    {
      title: 'Notificações',
      icon: <NotificationsIcon color="primary" />,
      settings: [
        {
          key: 'notifications',
          label: 'Receber notificações',
          description: 'Ativar notificações push no navegador'
        },
        {
          key: 'emailUpdates',
          label: 'Atualizações por email',
          description: 'Receber novidades e atualizações por email'
        }
      ]
    },
    {
      title: 'Aparência',
      icon: <PaletteIcon color="primary" />,
      settings: [
        {
          key: 'darkMode',
          label: 'Modo escuro',
          description: 'Alternar entre tema claro e escuro'
        }
      ]
    },
    {
      title: 'Sistema',
      icon: <SettingsIcon color="primary" />,
      settings: [
        {
          key: 'autoSave',
          label: 'Salvamento automático',
          description: 'Salvar alterações automaticamente'
        }
      ]
    },
    {
      title: 'Segurança',
      icon: <SecurityIcon color="primary" />,
      settings: [
        {
          key: 'twoFactor',
          label: 'Autenticação de dois fatores',
          description: 'Adicionar camada extra de segurança'
        }
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <SettingsIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Configurações
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Personalize sua experiência no SacaRolha
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {settingSections.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <SettingCard>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  {section.icon}
                  <Typography variant="h6" fontWeight="bold" ml={2}>
                    {section.title}
                  </Typography>
                </Box>
                
                {section.settings.map((setting, settingIndex) => (
                  <Box key={setting.key} mb={settingIndex < section.settings.length - 1 ? 2 : 0}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings[setting.key]}
                          onChange={handleSettingChange(setting.key)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {setting.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {setting.description}
                          </Typography>
                        </Box>
                      }
                      sx={{ margin: 0, alignItems: 'flex-start' }}
                    />
                    {settingIndex < section.settings.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}
              </CardContent>
            </SettingCard>
          </Grid>
        ))}
      </Grid>

      <StyledPaper sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Informações do Sistema
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Versão do Sistema
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              SacaRolha v1.0.0
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Última Atualização
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              02/08/2025
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" gap={2} flexWrap="wrap">
          <Button variant="contained" color="primary" sx={{ borderRadius: 3 }}>
            Salvar Configurações
          </Button>
          <Button variant="outlined" color="secondary" sx={{ borderRadius: 3 }}>
            Restaurar Padrões
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
}

export default Configuracoes;
