import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Container,
  useTheme,
  useMediaQuery,
  Fade,
  Grow
} from '@mui/material'
import { WineBar, Visibility } from '@mui/icons-material'

const Login = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos')
      return false
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return false
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      let userCredential
      
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      }

      console.log('Usuário autenticado:', userCredential.user)
      navigate('/')
    } catch (error) {
      console.error('Erro na autenticação:', error)
      setError(getErrorMessage(error.code))
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado'
      case 'auth/wrong-password':
        return 'Senha incorreta'
      case 'auth/email-already-in-use':
        return 'Este email já está em uso'
      case 'auth/weak-password':
        return 'A senha é muito fraca'
      case 'auth/invalid-email':
        return 'Email inválido'
      default:
        return 'Erro na autenticação. Tente novamente.'
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    })
    setError('')
  }

  return (
    <Fade in timeout={400}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: 'center',
          bgcolor: isMobile ? 'white' : '#f5f5f5',
          p: isMobile ? 0 : 2,
        }}
      >
        <Container maxWidth="sm" sx={{ p: isMobile ? '0 !important' : undefined }}>
          <Grow in timeout={500} style={{ transitionDelay: '100ms' }}>
            <Paper
              elevation={isMobile ? 0 : 3}
              sx={{
                p: isMobile ? 2 : 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'white',
                border: isMobile ? 'none' : '1px solid #e0e0e0',
                borderRadius: isMobile ? 0 : 1,
                minHeight: isMobile ? '100vh' : 'auto',
                justifyContent: isMobile ? 'center' : 'flex-start',
              }}
            >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <WineBar sx={{ fontSize: 48, color: 'black', mb: 1 }} />
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'black',
                fontSize: isMobile ? '2rem' : '2.5rem'
              }}
            >
              Saca Rolha
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                fontSize: isMobile ? '1rem' : '1.1rem'
              }}
            >
              {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black',
                },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Senha"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black',
                },
              }}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={handleTogglePassword}
                    tabIndex={-1}
                    sx={{ minWidth: 0, p: 0, color: 'black' }}
                  >
                    <Visibility />
                  </Button>
                )
              }}
            />

            {!isLogin && (
              <TextField
                fullWidth
                margin="normal"
                label="Confirmar Senha"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: 'black',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'black',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  },
                }}
              />
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                bgcolor: 'black',
                color: 'white',
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: '#333',
                },
                '&:disabled': {
                  bgcolor: '#ccc',
                  color: '#666',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isLogin ? 'Entrar' : 'Criar Conta'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={toggleMode}
                  sx={{
                    ml: 1,
                    color: 'black',
                    textDecorationColor: 'black',
                    '&:hover': {
                      color: '#333',
                    },
                  }}
                >
                  {isLogin ? 'Criar conta' : 'Fazer login'}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grow>
    </Container>
  </Box>
</Fade>
)
}

export default Login
