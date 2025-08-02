import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Rating,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LocalBar as WineIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  minHeight: '100vh'
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
  overflow: 'visible'
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  borderRadius: 16,
  marginBottom: theme.spacing(3),
  '& .MuiCardContent-root': {
    padding: theme.spacing(4)
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main
  }
}));

function VisualizarVinho() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const vinhoId = searchParams.get('id');

  const [vinho, setVinho] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vinhoId) {
      loadVinhoData(vinhoId);
    } else {
      setError('ID do vinho não fornecido');
      setLoading(false);
    }
  }, [vinhoId]);

  const loadVinhoData = async (id) => {
    try {
      setLoading(true);
      setError('');
      
      const docRef = doc(db, 'vinhos', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setVinho({
          id: docSnap.id,
          ...data,
          dataResposta: data.dataResposta?.toDate ? 
            data.dataResposta.toDate().toLocaleString('pt-BR') :
            data.dataResposta
        });
      } else {
        setError('Vinho não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do vinho:', error);
      setError('Erro ao carregar dados do vinho');
    } finally {
      setLoading(false);
    }
  };

  const getTipoVinhoColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'tinto':
        return 'error';
      case 'branco':
        return 'warning';
      case 'rosé':
      case 'rose':
        return 'secondary';
      case 'espumante':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <StyledContainer maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={50} />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth="lg">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/listagem')}
        >
          Voltar à Listagem
        </Button>
      </StyledContainer>
    );
  }

  if (!vinho) {
    return (
      <StyledContainer maxWidth="lg">
        <Alert severity="warning" sx={{ mb: 3 }}>
          Vinho não encontrado
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/listagem')}
        >
          Voltar à Listagem
        </Button>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      {/* Header com botões de ação */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/listagem')}
        >
          Voltar à Listagem
        </Button>
        
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/cadastrar?edit=${vinho.id}`)}
        >
          Editar Vinho
        </Button>
      </Box>

      {/* Card Principal - Informações do Vinho */}
      <HeaderCard>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <WineIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {vinho.nomeVinho || 'Nome não informado'}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {vinho.produtor || 'Produtor não informado'}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
            <Chip
              label={vinho.tipoVinho || 'Tipo não informado'}
              color={getTipoVinhoColor(vinho.tipoVinho)}
              sx={{ 
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }}
            />
            <Chip
              label={`Safra ${vinho.safra || 'N/A'}`}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
            />
            {vinho.notaAvaliacao > 0 && (
              <Chip
                icon={<StarIcon />}
                label={`${vinho.notaAvaliacao}/5`}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}
              />
            )}
          </Box>
        </CardContent>
      </HeaderCard>

      <Grid container spacing={3}>
        {/* Informações Básicas */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                Informações Básicas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <InfoItem>
                <WineIcon />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Nome do Vinho
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {vinho.nomeVinho || 'Não informado'}
                  </Typography>
                </Box>
              </InfoItem>

              <InfoItem>
                <AssessmentIcon />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Produtor
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {vinho.produtor || 'Não informado'}
                  </Typography>
                </Box>
              </InfoItem>

              <InfoItem>
                <CalendarIcon />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Safra
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {vinho.safra || 'Não informada'}
                  </Typography>
                </Box>
              </InfoItem>

              <InfoItem>
                <LocationIcon />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Região / País
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {vinho.regiao || 'Não informada'}
                    {vinho.pais && ` - ${vinho.pais}`}
                  </Typography>
                </Box>
              </InfoItem>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Características Técnicas */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                Características Técnicas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Teor Alcoólico
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {vinho.teorAlcoolico ? `${vinho.teorAlcoolico}%` : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Volume
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {vinho.volume ? `${vinho.volume}ml` : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Preço
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {vinho.preco ? `R$ ${vinho.preco}` : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Avaliação
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Rating
                      value={vinho.notaAvaliacao || 0}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({vinho.notaAvaliacao || 0}/5)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Características Organolépticas */}
        {vinho.caracteristicas && (
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  Características Organolépticas
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {vinho.caracteristicas}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        )}

        {/* Observações */}
        {vinho.observacoes && (
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  Observações
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {vinho.observacoes}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        )}

        {/* Informações do Sistema */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                Informações do Sistema
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID do Registro
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" fontFamily="monospace">
                    #{vinho.id.slice(-8)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Data/Hora da Resposta
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {vinho.dataResposta || 'Não informada'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}

export default VisualizarVinho;
