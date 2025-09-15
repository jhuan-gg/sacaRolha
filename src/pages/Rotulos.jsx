import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import {
  Container,
  Box,
  Typography,
  Button,
  Fade,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import BottomNavigation from '../components/BottomNavigation'

const steps = [
  'Ficha Técnica',
  'Imagem e Compra',
  'Atributos',
  'Análise',
  'Avaliação Geral'
]

// Tipos de vinho disponíveis
const tiposVinho = ['Tinto', 'Branco', 'Rosé', 'Espumante', 'Fortificado', 'Outro']

const Rotulos = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    nome: '',
    pais: '',
    regiao: '',
    produtor: '',
    safra: '',
    tipo: '',
    uva: '',
    abv: '',
    valor: '',
    dataCompra: '',
    localCompra: '',
    descricao: '',
    visual: 0,
    corpo: 0,
    acidez: 0,
    tanino: 0,
    aroma: '',
    dataAvaliacao: '',
    localAvaliacao: '',
    consideracoes: '',
    avaliacaoGeral: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const isMobile = window.innerWidth < 900

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Avançar para o próximo passo
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  // Voltar para o passo anterior
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  // Salvar os dados do rótulo no Firestore
  const handleSave = async () => {
    try {
      setLoading(true)
      setError('')
      
      const rotuloData = {
        ...formData,
        safra: formData.safra ? parseInt(formData.safra) : null,
        abv: formData.abv ? parseFloat(formData.abv) : null,
        valor: formData.valor ? parseFloat(formData.valor) : null,
        dataCadastro: serverTimestamp(),
      }

      await addDoc(collection(db, 'rotulos'), rotuloData)
      
      setSuccess('Rótulo salvo com sucesso!')
      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (err) {
      console.error('Erro ao salvar rótulo:', err)
      setError('Erro ao salvar rótulo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Descartar as alterações e voltar para a página inicial
  const handleDiscard = () => {
    navigate('/')
  }

  // Renderizar o conteúdo de cada etapa do formulário
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Ficha Técnica
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="País"
                value={formData.pais}
                onChange={(e) => handleChange('pais', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Região"
                value={formData.regiao}
                onChange={(e) => handleChange('regiao', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Produtor"
                value={formData.produtor}
                onChange={(e) => handleChange('produtor', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Safra (Ano)"
                type="number"
                value={formData.safra}
                onChange={(e) => handleChange('safra', e.target.value)}
                inputProps={{ min: 1900, max: new Date().getFullYear() }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={formData.tipo}
                  onChange={(e) => handleChange('tipo', e.target.value)}
                  label="Tipo"
                  sx={{ borderRadius: 2 }}
                >
                  {tiposVinho.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Uva"
                value={formData.uva}
                onChange={(e) => handleChange('uva', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="% ABV"
                type="number"
                value={formData.abv}
                onChange={(e) => handleChange('abv', e.target.value)}
                inputProps={{ min: 0, max: 20, step: 0.1 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        )

      case 1:
        return (
          <Grid container spacing={3} direction={isMobile ? 'column' : 'row'}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Imagem e Compra
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  Upload de Imagem Temporariamente Indisponível
                </Typography>
                <Typography variant="body2">
                  Esta funcionalidade será implementada em breve. Por enquanto, continue com as outras informações.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valor (R$)"
                type="number"
                value={formData.valor}
                onChange={(e) => handleChange('valor', e.target.value)}
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data da Compra"
                type="date"
                value={formData.dataCompra}
                onChange={(e) => handleChange('dataCompra', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Local da Compra"
                value={formData.localCompra}
                onChange={(e) => handleChange('localCompra', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        )

      case 2:
        return (
          <Grid container spacing={3} direction={isMobile ? 'column' : 'row'}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Características
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={6}
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        )

      case 3:
        return (
          <Grid container spacing={3} direction={isMobile ? 'column' : 'row'}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Análise
              </Typography>
            </Grid>
            {[
              { field: 'visual', label: 'Visual' },
              { field: 'corpo', label: 'Corpo' },
              { field: 'acidez', label: 'Acidez' },
              { field: 'tanino', label: 'Tanino' }
            ].map(({ field, label }) => (
              <Grid item xs={12} sm={6} key={field}>
                <Box>
                  <Typography variant="subtitle2" mb={1}>
                    {label}
                  </Typography>
                  <Rating
                    value={formData[field]}
                    onChange={(event, newValue) => handleChange(field, newValue)}
                    size="large"
                    sx={{ color: '#000000' }}
                  />
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Aroma"
                value={formData.aroma}
                onChange={(e) => handleChange('aroma', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        )

      case 4:
        return (
          <Grid container spacing={3} direction={isMobile ? 'column' : 'row'}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Avaliação Geral
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data da Avaliação"
                type="date"
                value={formData.dataAvaliacao}
                onChange={(e) => handleChange('dataAvaliacao', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Local da Avaliação"
                value={formData.localAvaliacao}
                onChange={(e) => handleChange('localAvaliacao', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Considerações"
                multiline
                rows={4}
                value={formData.consideracoes}
                onChange={(e) => handleChange('consideracoes', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" mb={1}>
                  Avaliação Geral
                </Typography>
                <Rating
                  value={formData.avaliacaoGeral}
                  onChange={(event, newValue) => handleChange('avaliacaoGeral', newValue)}
                  size="large"
                  sx={{ color: '#000000' }}
                />
              </Box>
            </Grid>
          </Grid>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Fade in={true} timeout={400}>
        <Container maxWidth="md" sx={{ py: 4 }}>

        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" textAlign="center">
          Cadastro de Rótulo
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          {/* Sempre renderiza o layout mobile, expandido para desktop */}
          <>
            <Box sx={{ 
              width: '100%', 
              maxWidth: { xs: '100%', md: '900px' },
              mb: 4, 
              display: 'flex', 
              justifyContent: 'center',
              px: 2,
              mx: 'auto'
            }}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                orientation="horizontal"
                sx={{
                  width: '100%',
                  '& .MuiStep-root': { 
                    flex: 1,
                    minWidth: '60px'
                  },
                  '& .MuiStepConnector-root': { 
                    flex: 1,
                    minWidth: '20px'
                  },
                  '& .MuiStepLabel-root': { 
                    display: 'flex', 
                    justifyContent: 'center',
                    '& .MuiStepLabel-label': {
                      fontSize: '0.85rem',
                      textAlign: 'center',
                      lineHeight: 1.2
                    }
                  },
                  '& .MuiStepIcon-root': {
                    fontSize: '1.2rem'
                  }
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Box sx={{ minHeight: 400, maxWidth: { xs: '100%', md: '900px' }, mx: 'auto' }}>
              {renderStepContent(activeStep)}
            </Box>
          </>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                color: '#000000',
                borderColor: '#000000',
                '&:hover': {
                  borderColor: '#000000',
                  backgroundColor: '#f5f5f5',
                },
              }}
              variant="outlined"
            >
              Anterior
            </Button>

            {activeStep === steps.length - 1 ? (
              <Box display="flex" gap={2}>
                <Button
                  onClick={handleDiscard}
                  startIcon={<Cancel />}
                  sx={{
                    color: '#666666',
                    borderColor: '#666666',
                    '&:hover': {
                      borderColor: '#666666',
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                  variant="outlined"
                >
                  Descartar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  sx={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#333333',
                    },
                    '&:disabled': {
                      backgroundColor: '#666666',
                    },
                  }}
                  variant="contained"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            ) : (
              <Button
                onClick={handleNext}
                sx={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                }}
                variant="contained"
              >
                Próximo
              </Button>
            )}
          </Box>
        </Box>
        
        {/* Espaçamento para o bottom navigation no mobile */}
        <Box sx={{ height: { xs: 80, md: 0 } }} />
      </Container>
    </Fade>
    
    <BottomNavigation />
    </>
  )
}

export default Rotulos
