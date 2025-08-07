import { useNavigate, useLocation } from 'react-router-dom'
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material'
import {
  Home,
  Add,
  MenuBook
} from '@mui/icons-material'

const BottomNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Só mostrar no mobile
  if (!isMobile) {
    return null
  }

  const getValue = () => {
    const path = location.pathname
    if (path === '/') return 0
    if (path === '/rotulos') return 1
    if (path === '/carta-vinhos') return 2
    return 0
  }

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/')
        break
      case 1:
        navigate('/rotulos')
        break
      case 2:
        navigate('/carta-vinhos')
        break
      default:
        navigate('/')
    }
  }

  return (
    <Fade in={true} timeout={600}>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderTop: '1px solid #e0e0e0',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
        }}
        elevation={3}
      >
        <MuiBottomNavigation
          value={getValue()}
          onChange={handleChange}
          sx={{
            height: 70,
            '& .MuiBottomNavigationAction-root': {
              color: '#666666',
              '&.Mui-selected': {
                color: '#000000',
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              fontWeight: '500',
              '&.Mui-selected': {
                fontSize: '0.75rem',
                fontWeight: 'bold',
              },
            },
          }}
        >
          <BottomNavigationAction
            label="Principal"
            icon={<Home />}
          />
          <BottomNavigationAction
            label="Rótulos"
            icon={<Add />}
          />
          <BottomNavigationAction
            label="Carta Vinhos"
            icon={<MenuBook />}
          />
        </MuiBottomNavigation>
      </Paper>
    </Fade>
  )
}

export default BottomNavigation
