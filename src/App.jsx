import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material'

// Components and Pages
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import Rotulos from './pages/Rotulos'
import CartaVinhos from './pages/CartaVinhos'
import VisualizarRotulo from './pages/VisualizarRotulo'

// Tema monocromático preto e branco
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#666666',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e0e0e0',
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Rota pública de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="rotulos" element={<Rotulos />} />
            <Route path="carta-vinhos" element={<CartaVinhos />} />
            <Route path="visualizar" element={<VisualizarRotulo />} />
          </Route>
          
          {/* Redirecionar rotas não encontradas para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
