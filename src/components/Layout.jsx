import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Fade
} from '@mui/material'
import { WineBar, ExitToApp } from '@mui/icons-material'

const Layout = () => {
  const [user] = useAuthState(auth)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Não mostrar header na página principal (Dashboard)
  const isDashboard = location.pathname === '/'

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <Fade in={true} timeout={400}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pt: !isDashboard ? { xs: 7, sm: 8 } : 0 }}>
        {/* Header apenas para páginas que não são Dashboard */}
        {!isDashboard && (
          <AppBar position="fixed" sx={{ bgcolor: '#000000', top: 0, left: 0, width: '100%' }} elevation={1}>
            <Toolbar>
              <WineBar sx={{ mr: 2 }} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={() => navigate('/')}
              >
                Saca Rolha
              </Typography>
              <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                Olá, {user?.email}
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<ExitToApp />}
                sx={{ color: 'white' }}
              >
                Sair
              </Button>
            </Toolbar>
          </AppBar>
        )}

        {/* Page Content */}
        <Outlet />
      </Box>
    </Fade>
  )
}

export default Layout
