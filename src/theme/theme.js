import { createTheme } from '@mui/material/styles';

// Paleta de cores personalizada
const theme = createTheme({
  palette: {
    primary: {
      main: '#395a4f', // color1 - Verde escuro
      light: '#5a7a6f',
      dark: '#2d4740',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#853c43', // color3 - Vinho
      light: '#a55a60',
      dark: '#5f2b30',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#432330', // color2 - Marrom escuro
      light: '#634346',
      dark: '#301a24',
    },
    accent: {
      main: '#f25c5e', // color4 - Coral
      light: '#f57c7e',
      dark: '#e03537',
    },
    warning: {
      main: '#ffa566', // color5 - Laranja claro
      light: '#ffb885',
      dark: '#ff8c42',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#432330',
      secondary: '#395a4f',
    },
  },
  typography: {
    fontFamily: [
      'system-ui',
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '3px',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '1px',
    },
    button: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  },
  shape: {
    borderRadius: 25,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 25,
            backgroundColor: '#e0e0e0',
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: '2px solid #395a4f',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;
