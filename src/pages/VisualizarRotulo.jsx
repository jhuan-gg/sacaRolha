import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import {
  Box,
  Typography,
  Button,
  Fade,
  Grid,
  Paper,
  Chip,
  Rating,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { 
  ArrowBack,
  LocalBar,
  LocationOn,
  CalendarToday,
  AttachMoney,
  Star,
  Assessment
} from '@mui/icons-material'

const VisualizarRotulo = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [rotulo, setRotulo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const rotuloId = searchParams.get('id')

  useEffect(() => {
    if (rotuloId) {
      loadRotulo()
    } else {
      setError('ID do rótulo não fornecido')
      setLoading(false)
    }
  }, [rotuloId])

  const loadRotulo = async () => {
    try {
      setLoading(true)
      setError('')
      
      const docRef = doc(db, 'rotulos', rotuloId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setRotulo({
          id: docSnap.id,
          ...docSnap.data()
        })
      } else {
        setError('Rótulo não encontrado')
      }
    } catch (err) {
      console.error('Erro ao carregar rótulo:', err)
      setError('Erro ao carregar os dados do rótulo')
    } finally {
      setLoading(false)
    }
  }

  const formatarData = (dataString) => {
    if (!dataString) return 'Não informado'
    try {
      const data = new Date(dataString)
      return data.toLocaleDateString('pt-BR')
    } catch (error) {
      return 'Data inválida'
    }
  }

  const formatarTimestamp = (timestamp) => {
    if (!timestamp) return 'Não informado'
    try {
      const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return data.toLocaleDateString('pt-BR')
    } catch (error) {
      return 'Data inválida'
    }
  }

  const renderInfoCard = (title, icon, children) => (
    <Paper 
      elevation={1} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        height: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Box sx={{ color: '#000000', mr: 1 }}>
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      {children}
    </Paper>
  )

  const renderField = (label, value, unit = '') => (
    <Box mb={2}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="medium">
        {value || 'Não informado'}{unit}
      </Typography>
    </Box>
  )

  const renderRating = (label, value) => (
    <Box mb={2}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Box display="flex" alignItems="center" mt={0.5}>
        <Rating 
          value={value || 0} 
          readOnly 
          size="small"
          sx={{ color: '#000000' }}
        />
        <Typography variant="body2" ml={1}>
          ({value || 0}/5)
        </Typography>
      </Box>
    </Box>
  )

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

  if (error) {
    return (
      <>
        <div style={{
          padding: isMobile ? '16px' : '32px 24px',
          maxWidth: isMobile ? 'none' : '1200px',
          margin: isMobile ? '0' : '0 auto',
          width: '100%'
        }}>
          <Box mb={4}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/carta-vinhos')}
              sx={{
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Voltar
            </Button>
          </Box>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
          
          {/* Espaçamento para o bottom navigation no mobile */}
          <Box sx={{ height: { xs: 80, md: 0 } }} />
        </div>
        
        <BottomNavigation />
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

        <Box mb={4}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/carta-vinhos')}
            sx={{
              color: '#000000',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Voltar para Carta de Vinhos
          </Button>
        </Box>

        <Box mb={4} textAlign="center">
          <Typography 
            variant={{ xs: "h4", md: "h3" }} 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{ 
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              lineHeight: 1.2,
              mb: 2
            }}
          >
            {rotulo?.nome || 'Rótulo sem nome'}
          </Typography>
          <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
            {rotulo?.tipo && (
              <Chip 
                label={rotulo.tipo} 
                sx={{ 
                  backgroundColor: '#000000', 
                  color: '#ffffff',
                  fontWeight: 'medium'
                }} 
              />
            )}
            {rotulo?.pais && (
              <Chip 
                label={rotulo.pais} 
                variant="outlined"
                sx={{ 
                  borderColor: '#000000', 
                  color: '#000000'
                }} 
              />
            )}
            {rotulo?.safra && (
              <Chip 
                label={`Safra ${rotulo.safra}`} 
                variant="outlined"
                sx={{ 
                  borderColor: '#000000', 
                  color: '#000000'
                }} 
              />
            )}
          </Box>
        </Box>

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
            {/* Ficha Técnica */}
            <Grid 
              item 
              xs={12} 
              md={6}
              style={{
                width: isMobile ? '100%' : 'auto',
                padding: isMobile ? '4px 0' : 'auto',
                margin: '0'
              }}
            >
            {renderInfoCard(
              'Ficha Técnica',
              <LocalBar />,
              <>
                {renderField('Produtor', rotulo?.produtor)}
                {renderField('Região', rotulo?.regiao)}
                {renderField('Uva', rotulo?.uva)}
                {renderField('Teor Alcoólico', rotulo?.abv, '%')}
              </>
            )}
          </Grid>

            {/* Informações de Compra */}
            <Grid 
              item 
              xs={12} 
              md={6}
              style={{
                width: isMobile ? '100%' : 'auto',
                padding: isMobile ? '4px 0' : 'auto',
                margin: '0'
              }}
            >
            {renderInfoCard(
              'Informações de Compra',
              <AttachMoney />,
              <>
                {renderField('Valor', rotulo?.valor ? `R$ ${rotulo.valor.toFixed(2)}` : null)}
                {renderField('Data da Compra', formatarData(rotulo?.dataCompra))}
                {renderField('Local da Compra', rotulo?.localCompra)}
              </>
            )}
          </Grid>

            {/* Características */}
            <Grid 
              item 
              xs={12}
              style={{
                width: isMobile ? '100%' : 'auto',
                padding: isMobile ? '4px 0' : 'auto',
                margin: '0'
              }}
            >
            {renderInfoCard(
              'Características',
              <Assessment />,
              <>
                {rotulo?.descricao && (
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Descrição
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {rotulo.descricao}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Grid>

            {/* Análise Sensorial */}
            <Grid 
              item 
              xs={12} 
              md={6}
              style={{
                width: isMobile ? '100%' : 'auto',
                padding: isMobile ? '4px 0' : 'auto',
                margin: '0'
              }}
            >
            {renderInfoCard(
              'Análise Sensorial',
              <Star />,
              <>
                {renderRating('Visual', rotulo?.visual)}
                {renderRating('Corpo', rotulo?.corpo)}
                {renderRating('Acidez', rotulo?.acidez)}
                {renderRating('Tanino', rotulo?.tanino)}
                {renderField('Aroma', rotulo?.aroma)}
              </>
            )}
          </Grid>

            {/* Avaliação */}
            <Grid 
              item 
              xs={12} 
              md={6}
              style={{
                width: isMobile ? '100%' : 'auto',
                padding: isMobile ? '4px 0' : 'auto',
                margin: '0'
              }}
            >
            {renderInfoCard(
              'Avaliação',
              <CalendarToday />,
              <>
                {renderField('Data da Avaliação', formatarData(rotulo?.dataAvaliacao))}
                {renderField('Local da Avaliação', rotulo?.localAvaliacao)}
                {renderRating('Avaliação Geral', rotulo?.avaliacaoGeral)}
                {rotulo?.consideracoes && (
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Considerações
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {rotulo.consideracoes}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Grid>
          </Grid>
        </div>

        <Divider sx={{ my: { xs: 3, sm: 4 } }} />

        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Cadastrado em: {formatarTimestamp(rotulo?.dataCadastro)}
          </Typography>
        </Box>

        {/* Espaçamento para o bottom navigation no mobile */}
        <Box sx={{ height: { xs: 80, md: 0 } }} />
        </div>
    </Fade>
    
    <BottomNavigation />
    </>
  )
}

export default VisualizarRotulo
