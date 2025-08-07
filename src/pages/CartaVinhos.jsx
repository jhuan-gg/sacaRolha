import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import {
  Container,
  Box,
  Typography,
  Button,
  Fade,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Rating,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material'
import BottomNavigation from '../components/BottomNavigation'
import { 
  Visibility,
  LocalBar
} from '@mui/icons-material'


const CartaVinhos = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [rotulos, setRotulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRotulos()
  }, [])

  const loadRotulos = async () => {
    try {
      setLoading(true)
      setError('')
      
      const rotulosRef = collection(db, 'rotulos')
      const q = query(rotulosRef, orderBy('dataCadastro', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const rotulosData = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        rotulosData.push({
          id: doc.id,
          ...data,
        })
      })
      
      setRotulos(rotulosData)
    } catch (err) {
      console.error('Erro ao carregar rótulos:', err)
      setError('Erro ao carregar a carta de vinhos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const formatarTimestamp = (timestamp) => {
    if (!timestamp) return 'Data não disponível'
    try {
      const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return data.toLocaleDateString('pt-BR')
    } catch (error) {
      return 'Data inválida'
    }
  }

  const handleVisualizar = (rotuloId) => {
    navigate(`/visualizar?id=${rotuloId}`)
  }

  if (loading) {
    return (
      <>
        <div style={{
          padding: isMobile ? '16px' : '32px 24px',
          maxWidth: isMobile ? 'none' : '1200px',
          margin: isMobile ? '0' : '0 auto',
          width: '100%'
        }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress size={50} sx={{ color: '#000000' }} />
          </Box>
        </div>
      </>
    )
  }

  return (
    <>
      <Fade in={true} timeout={400}>
        <div style={{
          padding: isMobile ? '16px' : '32px 24px',
          maxWidth: isMobile ? 'none' : '1200px',
          margin: isMobile ? '0' : '0 auto',
          width: '100%'
        }}>

        <Box 
          display="flex" 
          justifyContent={{ xs: "center", md: "center" }} 
          alignItems="center" 
          mb={4} 
          textAlign="center"
          px={{ xs: 0, sm: 0 }}
        >
          <Typography variant={{ xs: "h4", md: "h3" }} component="h1" fontWeight="bold">
            Carta de Vinhos
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {rotulos.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            minHeight="300px"
            textAlign="center"
            p={3}
            mx={{ xs: 0, sm: 0 }}
          >
            <LocalBar sx={{ fontSize: 64, color: '#000000', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="#000000" fontWeight="bold" mb={1}>
              Nenhum rótulo cadastrado
            </Typography>
            <Typography variant="body2" color="#666666" mb={3}>
              Comece cadastrando seu primeiro rótulo!
            </Typography>
          </Box>
        ) : (
          <div style={{ 
            width: '100%',
            padding: isMobile ? '0 8px' : '0',
            margin: '0',
            boxSizing: 'border-box'
          }}>
            <Grid container spacing={{ xs: 1, sm: 3 }} style={{
              width: '100%', 
              margin: '0',
              boxSizing: 'border-box'
            }}>
              {rotulos.map((rotulo) => (
              <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={rotulo.id}
                  style={{
                    width: isMobile ? '100%' : 'auto',
                    padding: isMobile ? '4px 0' : 'auto',
                    margin: '0'
                  }}
                >
                  <Card 
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      margin: isMobile ? '0' : '0',
                      boxSizing: 'border-box'
                    }}
                    sx={{ 
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                  <CardContent sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      mb={2}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {rotulo.nome || 'Rótulo sem nome'}
                    </Typography>
                    
                    <Box display="flex" flexWrap="wrap" gap={1} mb={2} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                      {rotulo.tipo && (
                        <Chip 
                          label={rotulo.tipo} 
                          size="small"
                          sx={{ 
                            backgroundColor: '#000000', 
                            color: '#ffffff'
                          }} 
                        />
                      )}
                      {rotulo.pais && (
                        <Chip 
                          label={rotulo.pais} 
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: '#000000', 
                            color: '#000000'
                          }} 
                        />
                      )}
                    </Box>

                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Produtor: {rotulo.produtor || 'Não informado'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Região: {rotulo.regiao || 'Não informado'}
                      </Typography>
                      {rotulo.safra && (
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          Safra: {rotulo.safra}
                        </Typography>
                      )}
                    </Box>

                    {rotulo.avaliacaoGeral > 0 && (
                      <Box display="flex" alignItems="center" mb={2} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                        <Typography variant="body2" color="text.secondary" mr={1}>
                          Avaliação:
                        </Typography>
                        <Rating 
                          value={rotulo.avaliacaoGeral} 
                          readOnly 
                          size="small"
                          sx={{ color: '#000000' }}
                        />
                        <Typography variant="body2" color="text.secondary" ml={1}>
                          ({rotulo.avaliacaoGeral}/5)
                        </Typography>
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      Cadastrado: {formatarTimestamp(rotulo.dataCadastro)}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => handleVisualizar(rotulo.id)}
                      sx={{
                        color: '#000000',
                        borderColor: '#000000',
                        '&:hover': {
                          borderColor: '#000000',
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          </div>
        )}
        
        </div>
    </Fade>
    {/* BottomNavigation só no mobile */}
    {isMobile && <BottomNavigation />}
    </>
  )
}

export default CartaVinhos
