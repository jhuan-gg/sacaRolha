import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  InputLabel,
  FormControl,
  Fade,
  Zoom,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';

// Componentes estilizados
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.tertiary.main} 100%)`,
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: 0,
    alignItems: 'stretch',
  },
  // Adaptação para landscape mobile
  [theme.breakpoints.down('md')]: {
    '@media (orientation: landscape) and (max-height: 500px)': {
      padding: theme.spacing(1),
      alignItems: 'flex-start',
      paddingTop: theme.spacing(2),
    },
  },
}));

const LoginCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  minHeight: 600,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'visible',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    minHeight: '100vh',
    borderRadius: 0,
    height: '100vh',
    justifyContent: 'space-between',
  },
  // Mobile landscape
  [theme.breakpoints.down('md')]: {
    '@media (orientation: landscape) and (max-height: 500px)': {
      minHeight: 'auto',
      maxHeight: '95vh',
      overflowY: 'auto',
      borderRadius: 15,
    },
  },
  // Tablet adaptations
  [theme.breakpoints.between('sm', 'md')]: {
    maxWidth: 450,
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.tertiary.main} 100%)`,
  padding: theme.spacing(5, 2.5),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 3),
    flex: '0 0 auto',
  },
  [theme.breakpoints.down('md')]: {
    '@media (orientation: landscape) and (max-height: 500px)': {
      padding: theme.spacing(2.5, 2),
    },
  },
}));

const LogoBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 2.5),
  border: `3px solid ${theme.palette.tertiary.main}`,
  borderRadius: 10,
  backgroundColor: '#ffffff',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
  },
  [theme.breakpoints.down('md')]: {
    '@media (orientation: landscape) and (max-height: 500px)': {
      padding: theme.spacing(2, 1.5),
    },
  },
}));

const FormSection = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(5, 4),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 3),
    flex: 1,
    minHeight: 0,
    justifyContent: 'space-around',
  },
  [theme.breakpoints.down('md')]: {
    '@media (orientation: landscape) and (max-height: 500px)': {
      padding: theme.spacing(3, 3),
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    padding: theme.spacing(0),
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    '& input': {
      padding: theme.spacing(1.8, 2.5),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.8, 2),
        fontSize: '16px',
      },
    },
    '& .MuiInputAdornment-root': {
      height: 'auto',
      maxHeight: 'none',
      '& .MuiIconButton-root': {
        padding: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2.2, 2.5),
  fontSize: '18px',
  marginTop: theme.spacing(2.5),
  background: theme.palette.secondary.main,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.accent.main,
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(133, 60, 67, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 2.5),
    fontSize: '18px',
    marginTop: theme.spacing(3),
    minHeight: '56px',
  },
}));

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLandscapeMobile = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { usuario, senha });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const getLogoFontSize = () => {
    if (isLandscapeMobile) return '20px';
    if (isMobile) return '24px';
    if (isTablet) return '30px';
    return '28px';
  };

  const getFormTitleSize = () => {
    if (isLandscapeMobile) return '24px';
    if (isMobile) return '28px';
    if (isTablet) return '36px';
    return '32px';
  };

  return (
    <LoginContainer>
      <Zoom in={true} timeout={800}>
        <LoginCard>
          <LogoSection>
            <Fade in={true} timeout={1200}>
              <LogoBox elevation={0}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: getLogoFontSize(),
                    fontWeight: 'bold',
                    color: 'tertiary.main',
                    margin: 0,
                    letterSpacing: isMobile ? '2px' : '3px',
                  }}
                >
                  SACA ROLHA
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: isLandscapeMobile ? '10px' : isMobile ? '12px' : '14px',
                    color: 'secondary.main',
                    margin: '5px 0 0 0',
                    fontWeight: 500,
                    letterSpacing: '2px',
                  }}
                >
                  CONFRARIA
                </Typography>
              </LogoBox>
            </Fade>
          </LogoSection>
          
          <FormSection>
            <Fade in={true} timeout={1500}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: getFormTitleSize(),
                  fontWeight: 'bold',
                  color: 'tertiary.main',
                  textAlign: 'center',
                  marginBottom: isLandscapeMobile ? 2 : isMobile ? 3 : 5,
                }}
              >
                Login
              </Typography>
            </Fade>
            
            <Fade in={true} timeout={2000}>
              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: isLandscapeMobile ? 2 : isMobile ? 3.5 : 3,
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'tertiary.main',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      position: 'static',
                      transform: 'none',
                      marginBottom: 1,
                    }}
                  >
                    USUÁRIO
                  </InputLabel>
                  <StyledTextField
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        color: 'tertiary.main',
                        backgroundColor: '#e0e0e0',
                      } 
                    }}
                  />
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'tertiary.main',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      position: 'static',
                      transform: 'none',
                      marginBottom: 1,
                    }}
                  >
                    SENHA
                  </InputLabel>
                  <StyledTextField
                    type={showPassword ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    variant="outlined"
                    fullWidth
                    placeholder="••••••••••"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ 
                              color: 'tertiary.main',
                              '&:hover': {
                                backgroundColor: 'rgba(67, 35, 48, 0.1)',
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { 
                        color: 'tertiary.main',
                        backgroundColor: '#e0e0e0',
                        '& input::placeholder': {
                          color: '#999',
                          fontSize: '18px',
                          letterSpacing: '2px',
                        }
                      }
                    }}
                  />
                </FormControl>
                
                <StyledButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  Acessar
                </StyledButton>
              </Box>
            </Fade>
          </FormSection>
        </LoginCard>
      </Zoom>
    </LoginContainer>
  );
}

export default Login;
