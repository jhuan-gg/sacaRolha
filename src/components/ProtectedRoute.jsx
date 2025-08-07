import { Navigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/config'
import { CircularProgress, Box, Typography, Fade } from '@mui/material'

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return (
      <Fade in={true} timeout={300}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          bgcolor="#f5f5f5"
        >
          <CircularProgress size={60} sx={{ color: '#000000', mb: 2 }} />
          <Typography variant="h6" color="#666666">
            Carregando...
          </Typography>
        </Box>
      </Fade>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
