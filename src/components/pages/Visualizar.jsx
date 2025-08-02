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
  Assessment as AssessmentIcon,
  Image as ImageIcon,
  PhotoCamera as PhotoCameraIcon,
  Business as BusinessIcon,
  Euro as EuroIcon,
  Notes as NotesIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  minHeight: '100vh',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

const DetailCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
  overflow: 'visible',
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0, 0, 2, 0),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
  }
}));

const UniformCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
  overflow: 'visible',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0, 0, 2, 0),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    height: 'auto'
  }
}));

const UniformCardContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  borderRadius: 16,
  marginBottom: theme.spacing(3),
  '& .MuiCardContent-root': {
    padding: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0, 0, 2, 0),
    '& .MuiCardContent-root': {
      padding: theme.spacing(3, 2)
    }
  }
}));

const ActionButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    margin: theme.spacing(0, 0, 2, 0)
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 'bold',
  textTransform: 'none',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(1.5, 3)
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
    marginTop: theme.spacing(0.25),
    minWidth: 24
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1.5),
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(1.5),
      fontSize: '1.2rem'
    }
  }
}));

const WineImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  height: 'auto',
  maxHeight: '300px',
  objectFit: 'cover',
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)'
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    maxHeight: '250px'
  }
}));

const NoImagePlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: 12,
  border: `2px dashed ${theme.palette.grey[300]}`,
  color: theme.palette.grey[500],
  [theme.breakpoints.down('sm')]: {
    height: '150px',
    maxWidth: '100%'
  }
}));

function Visualizar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const vinhoId = searchParams.get('id');

  const [vinho, setVinho] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Função para obter emoji do tipo de vinho
  const getWineEmoji = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'tinto': return '🍷';
      case 'branco': return '🥂';
      case 'rosé': case 'rose': return '🌹';
      case 'espumante': return '🍾';
      case 'sobremesa': return '🍯';
      case 'fortificado': return '🥃';
      default: return '🍷';
    }
  };

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
      <ActionButtonContainer>
        <ActionButton
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/listagem')}
          variant={isMobile ? "outlined" : "text"}
        >
          {isMobile ? 'Voltar' : 'Voltar à Listagem'}
        </ActionButton>
        
        <ActionButton
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/cadastrar?edit=${vinho.id}`)}
        >
          {isMobile ? 'Editar' : 'Editar Vinho'}
        </ActionButton>
      </ActionButtonContainer>

      {/* Card Principal - Header do Vinho */}
      <HeaderCard>
        <CardContent>
          <Box 
            display="flex" 
            alignItems={isMobile ? 'flex-start' : 'center'} 
            mb={2}
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <WineIcon sx={{ 
              fontSize: isMobile ? 32 : 40, 
              mr: isMobile ? 0 : 2,
              mb: isMobile ? 1 : 0
            }} />
            <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight="bold"
                sx={{ lineHeight: 1.2 }}
              >
                {vinho.nomeVinho || 'Nome não informado'}
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                sx={{ opacity: 0.9, mt: 0.5 }}
              >
                {vinho.produtor || 'Produtor não informado'}
              </Typography>
            </Box>
          </Box>
          
          <Box 
            display="flex" 
            gap={1} 
            flexWrap="wrap" 
            mt={2}
            justifyContent={isMobile ? 'center' : 'flex-start'}
          >
            <Chip
              label={vinho.tipoVinho || 'Tipo não informado'}
              color={getTipoVinhoColor(vinho.tipoVinho)}
              sx={{ 
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                fontSize: isMobile ? '0.75rem' : '0.8rem'
              }}
            />
            <Chip
              label={`Safra ${vinho.safra || 'N/A'}`}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: isMobile ? '0.75rem' : '0.8rem'
              }}
            />
            {vinho.notaAvaliacao > 0 && (
              <Chip
                icon={<StarIcon sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />}
                label={`${vinho.notaAvaliacao}/5`}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: isMobile ? '0.75rem' : '0.8rem'
                }}
              />
            )}
          </Box>
        </CardContent>
      </HeaderCard>

      {/* Grid de Cards */}
      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Foto do Vinho */}
        {vinho.imagemUrl && (
          <Grid item xs={12}>
            <DetailCard>
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  gutterBottom 
                  color="primary" 
                  fontWeight="bold"
                >
                  <ImageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Foto do Vinho
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box display="flex" justifyContent="center">
                  <WineImage 
                    src={vinho.imagemUrl} 
                    alt={`Foto do vinho ${vinho.nomeVinho}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <NoImagePlaceholder style={{ display: 'none' }}>
                    <PhotoCameraIcon sx={{ fontSize: isMobile ? 36 : 48, mb: 1 }} />
                    <Typography variant="body2">
                      Erro ao carregar imagem
                    </Typography>
                  </NoImagePlaceholder>
                </Box>
              </CardContent>
            </DetailCard>
          </Grid>
        )}

        {/* Informações Básicas */}
        <Grid item xs={12} md={6}>
          <UniformCard>
            <UniformCardContent>
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"} 
                gutterBottom 
                color="primary" 
                fontWeight="bold"
              >
                <WineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informações Básicas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ flex: 1 }}>
                <InfoItem>
                  <WineIcon />
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                    >
                      Nome do Vinho
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                    >
                      {vinho.nomeVinho || 'Não informado'}
                    </Typography>
                  </Box>
                </InfoItem>

                <InfoItem>
                  <BusinessIcon />
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                    >
                      Produtor
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                    >
                      {vinho.produtor || 'Não informado'}
                    </Typography>
                  </Box>
                </InfoItem>

                <InfoItem>
                  <WineIcon />
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                    >
                      Tipo do Vinho
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                    >
                      {vinho.tipoVinho ? `${getWineEmoji(vinho.tipoVinho)} ${vinho.tipoVinho}` : 'Não informado'}
                    </Typography>
                  </Box>
                </InfoItem>

                <InfoItem>
                  <CalendarIcon />
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                    >
                      Safra
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                    >
                      {vinho.safra || 'Não informada'}
                    </Typography>
                  </Box>
                </InfoItem>

                {vinho.teorAlcoolico && (
                  <InfoItem>
                    <AssessmentIcon />
                    <Box>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                      >
                        Teor Alcoólico
                      </Typography>
                      <Typography 
                        variant="body1" 
                        fontWeight="medium"
                        sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                      >
                        {vinho.teorAlcoolico}%
                      </Typography>
                    </Box>
                  </InfoItem>
                )}

                <InfoItem>
                  <LocationIcon />
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                    >
                      Região / País
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                    >
                      {vinho.regiao || 'Não informada'}
                      {vinho.pais && ` - ${vinho.pais}`}
                    </Typography>
                  </Box>
                </InfoItem>
              </Box>
            </UniformCardContent>
          </UniformCard>
        </Grid>

        {/* Detalhes Comerciais */}
        <Grid item xs={12} md={6}>
          <UniformCard>
            <UniformCardContent>
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"} 
                gutterBottom 
                color="primary" 
                fontWeight="bold"
              >
                <EuroIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Detalhes Comerciais
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ flex: 1 }}>
                {vinho.volume && (
                  <InfoItem>
                    <WineIcon />
                    <Box>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                      >
                        Volume
                      </Typography>
                      <Typography 
                        variant="body1" 
                        fontWeight="medium"
                        sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                      >
                        {vinho.volume}ml
                      </Typography>
                    </Box>
                  </InfoItem>
                )}

                {vinho.preco && (
                  <InfoItem>
                    <EuroIcon />
                    <Box>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                      >
                        Preço
                      </Typography>
                      <Typography 
                        variant="body1" 
                        fontWeight="medium"
                        sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                      >
                        R$ {parseFloat(vinho.preco).toFixed(2)}
                      </Typography>
                    </Box>
                  </InfoItem>
                )}

                {vinho.notaAvaliacao > 0 && (
                  <InfoItem>
                    <StarIcon />
                    <Box>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                      >
                        Avaliação
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Rating
                          value={vinho.notaAvaliacao}
                          readOnly
                          size={isMobile ? "small" : "medium"}
                          precision={0.5}
                        />
                        <Typography 
                          variant="body1" 
                          fontWeight="medium"
                          sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                        >
                          ({vinho.notaAvaliacao}/5)
                        </Typography>
                      </Box>
                    </Box>
                  </InfoItem>
                )}

                {/* Espaçador para equilibrar altura no desktop */}
                <Box sx={{ 
                  flex: 1, 
                  minHeight: isMobile ? 0 : '50px' 
                }} />
              </Box>
            </UniformCardContent>
          </UniformCard>
        </Grid>

        {/* Características e Observações */}
        {(vinho.caracteristicas || vinho.observacoes) && (
          <Grid item xs={12}>
            <DetailCard>
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  gutterBottom 
                  color="primary" 
                  fontWeight="bold"
                >
                  <NotesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Características e Observações
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={isMobile ? 2 : 3}>
                  {vinho.caracteristicas && (
                    <Grid item xs={12} md={6}>
                      <Typography 
                        variant={isMobile ? "body1" : "subtitle1"} 
                        gutterBottom 
                        fontWeight="bold"
                        sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }}
                      >
                        Características
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          lineHeight: 1.8,
                          fontSize: isMobile ? '0.9rem' : '1rem'
                        }}
                      >
                        {vinho.caracteristicas}
                      </Typography>
                    </Grid>
                  )}
                  
                  {vinho.observacoes && (
                    <Grid item xs={12} md={6}>
                      <Typography 
                        variant={isMobile ? "body1" : "subtitle1"} 
                        gutterBottom 
                        fontWeight="bold"
                        sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }}
                      >
                        Observações
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          lineHeight: 1.8,
                          fontSize: isMobile ? '0.9rem' : '1rem'
                        }}
                      >
                        {vinho.observacoes}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </DetailCard>
          </Grid>
        )}

        {/* Informações do Sistema */}
        <Grid item xs={12}>
          <DetailCard>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"} 
                gutterBottom 
                color="primary" 
                fontWeight="bold"
              >
                Informações do Sistema
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={isMobile ? 2 : 3}>
                {vinho.userId && (
                  <Grid item xs={12} md={4}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                    >
                      Cadastrado por
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                    >
                      {vinho.userEmail || 'Usuário não identificado'}
                    </Typography>
                  </Grid>
                )}
                
                <Grid item xs={12} md={4}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                  >
                    ID do Registro
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="medium" 
                    fontFamily="monospace"
                    sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                  >
                    #{vinho.id.slice(-8)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                  >
                    Status
                  </Typography>
                  <Box mt={0.5}>
                    <Chip 
                      label={vinho.status || 'Ativo'} 
                      color="success" 
                      size="small"
                      sx={{ 
                        textTransform: 'capitalize',
                        fontSize: isMobile ? '0.75rem' : '0.8rem'
                      }}
                    />
                  </Box>
                </Grid>

                {vinho.createdAt && (
                  <Grid item xs={12} md={6}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                    >
                      Data de Criação
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                    >
                      {new Date(vinho.createdAt.seconds * 1000).toLocaleString('pt-BR')}
                    </Typography>
                  </Grid>
                )}

                {vinho.updatedAt && (
                  <Grid item xs={12} md={6}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                    >
                      Última Atualização
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                    >
                      {new Date(vinho.updatedAt.seconds * 1000).toLocaleString('pt-BR')}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 'medium' }}
                  >
                    Data/Hora da Resposta
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="medium"
                    sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                  >
                    {vinho.dataResposta ? 
                      (vinho.dataResposta.seconds ? 
                        new Date(vinho.dataResposta.seconds * 1000).toLocaleString('pt-BR') :
                        vinho.dataResposta
                      ) : 'Não informada'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </DetailCard>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}

export default Visualizar;
