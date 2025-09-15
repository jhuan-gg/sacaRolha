import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import {
  Box,
  Typography,
  Button,
  Fade,
  Chip,
  Rating,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'
import styled from 'styled-components'

import BottomNavigation from '../components/BottomNavigation'

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

  const Card = styled.div`
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    padding: 32px 24px;
  margin-bottom: 16px;
    transition: box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    @media (max-width: 900px) {
      max-width: 100%;
      padding: 20px 8px;
    }
    &:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }
  `

  const CardTitle = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-weight: bold;
    font-size: 1.25rem;
    color: #000;
    gap: 8px;
  `

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

  <Box display="flex" flexDirection="column" alignItems="stretch" width="100%" gap={3}>
          <Card>
            <CardTitle><LocalBar />Ficha Técnica</CardTitle>
            {renderField('Produtor', rotulo?.produtor)}
            {renderField('Região', rotulo?.regiao)}
            {renderField('Uva', rotulo?.uva)}
            {renderField('Teor Alcoólico', rotulo?.abv, '%')}
          </Card>
          <Card>
            <CardTitle><AttachMoney />Informações de Compra</CardTitle>
            {renderField('Valor', rotulo?.valor ? `R$ ${rotulo.valor.toFixed(2)}` : null)}
            {renderField('Data da Compra', formatarData(rotulo?.dataCompra))}
            {renderField('Local da Compra', rotulo?.localCompra)}
          </Card>
          <Card>
            <CardTitle><Assessment />Características</CardTitle>
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
          </Card>
          <Card>
            <CardTitle><Star />Análise Sensorial</CardTitle>
            {renderRating('Visual', rotulo?.visual)}
            {renderRating('Corpo', rotulo?.corpo)}
            {renderRating('Acidez', rotulo?.acidez)}
            {renderRating('Tanino', rotulo?.tanino)}
            {renderField('Aroma', rotulo?.aroma)}
          </Card>
          <Card>
            <CardTitle><CalendarToday />Avaliação</CardTitle>
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
          </Card>
        </Box>

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
    
    {/* Espaço extra para o BottomNavigation no mobile */}
    {isMobile && <Box sx={{ height: 80 }} />}
    <BottomNavigation />
    </>
  )
}

export default VisualizarRotulo
