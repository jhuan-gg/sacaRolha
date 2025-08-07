import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  Container,
  Box,
  Typography,
  Button,
  Fade,
  Grow,
  AppBar,
  Toolbar
} from '@mui/material'
import { ExitToApp } from '@mui/icons-material'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user] = useAuthState(auth)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header minimalista apenas para Dashboard */}
      <Fade in={true} timeout={400}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            bgcolor: 'white',
            border: 'none',
            boxShadow: 'none'
          }}
        >
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                color: '#000000',
                fontWeight: 600
              }}
            >
              Saca Rolha
            </Typography>
            <Button
              onClick={handleLogout}
              startIcon={<ExitToApp />}
              sx={{ 
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Sair
            </Button>
          </Toolbar>
        </AppBar>
      </Fade>

      {/* Conteúdo centralizado */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="calc(100vh - 64px)" // Subtrai a altura do header
        px={2}
      >
        <Container maxWidth="sm">
          <Fade in={true} timeout={500} style={{ transitionDelay: '100ms' }}>
            <Box textAlign="center" mb={6}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                Saca Rolha
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Escolha uma opção
              </Typography>
            </Box>
          </Fade>

          {/* Menu Buttons */}
          <Box display="flex" flexDirection="column" gap={3}>
            <Grow in={true} timeout={500} style={{ transitionDelay: '200ms' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/rotulos')}
                sx={{
                  py: 3,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  backgroundColor: '#000000',
                  color: 'white',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                }}
              >
                Rótulos
              </Button>
            </Grow>

            <Grow in={true} timeout={500} style={{ transitionDelay: '300ms' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/carta-vinhos')}
                sx={{
                  py: 3,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  backgroundColor: '#000000',
                  color: 'white',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                }}
              >
                Carta de Vinhos
              </Button>
            </Grow>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Dashboard
