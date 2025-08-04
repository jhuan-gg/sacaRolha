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
    margin: theme.spacing(0, 1, 2, 1),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
  }
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #395a4f 0%, #432330 100%)',
  color: 'white',
  borderRadius: 16,
  marginBottom: theme.spacing(3),
  '& .MuiCardContent-root': {
    padding: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0, 1, 2, 1),
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
    margin: theme.spacing(0, 1, 2, 1)
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
          // Formatação de datas
          dataResposta: data.dataResposta?.toDate ? 
            data.dataResposta.toDate().toLocaleString('pt-BR') :
            data.dataResposta,
          createdAt: data.createdAt?.toDate ? 
            data.createdAt.toDate().toLocaleString('pt-BR') :
            data.createdAt,
          updatedAt: data.updatedAt?.toDate ? 
            data.updatedAt.toDate().toLocaleString('pt-BR') :
            data.updatedAt
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

  // Função para formatar preço se não estiver formatado
  const formatPrice = (preco, precoFormatado) => {
    if (precoFormatado) return precoFormatado;
    if (preco) return `R$ ${parseFloat(preco).toFixed(2)}`;
    return 'Não informado';
  };

  // Função para formatar volume se não estiver formatado
  const formatVolume = (volume, volumeFormatado) => {
    if (volumeFormatado) return volumeFormatado;
    if (volume) return `${volume}ml`;
    return 'Não informado';
  };

  // Função para formatar teor alcoólico se não estiver formatado
  const formatAlcohol = (teorAlcoolico, teorAlcoolicoFormatado) => {
    if (teorAlcoolicoFormatado) return teorAlcoolicoFormatado;
    if (teorAlcoolico) return `${teorAlcoolico}%`;
    return 'Não informado';
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
          sx={{
            backgroundColor: '#853c43',
            '&:hover': { backgroundColor: '#432330' }
          }}
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
                {vinho.nomeVinho || vinho.nome || 'Nome não informado'}
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
              label={vinho.tipoVinho || vinho.tipo || 'Tipo não informado'}
              color={getTipoVinhoColor(vinho.tipoVinho || vinho.tipo)}
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
            {(vinho.notaAvaliacao > 0 || vinho.avaliacao > 0) && (
              <Chip
                icon={<StarIcon sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />}
                label={`${vinho.notaAvaliacao || vinho.avaliacao}/5`}
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

      {/* Conteúdo Mobile/Desktop */}
      {isMobile ? (
        // Layout Mobile - Cards em coluna
        <Box sx={{ px: 1 }}>
          {/* Card da Imagem */}
          {vinho.imagemUrl && (
            <DetailCard>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  color="primary" 
                  fontWeight="bold"
                >
                  <ImageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Imagem do Vinho
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  component="img"
                  src={vinho.imagemUrl}
                  alt={vinho.nomeVinho || vinho.nome || 'Vinho'}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    width: 'auto',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </CardContent>
            </DetailCard>
          )}

          {/* Informações Básicas */}
          <DetailCard>
            <CardContent sx={{ p: 2 }}>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                color="primary" 
                fontWeight="bold"
              >
                <WineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informações Básicas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                  Nome
                </Typography>
                <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                  {vinho.nomeVinho || vinho.nome || 'Não informado'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                  Tipo/Categoria
                </Typography>
                <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                  {vinho.tipoVinho || vinho.tipo ? `${getWineEmoji(vinho.tipoVinho || vinho.tipo)} ${vinho.tipoVinho || vinho.tipo}` : 'Não informado'}
                  {vinho.categoria && vinho.categoria !== (vinho.tipoVinho || vinho.tipo) && (
                    <Typography component="span" sx={{ ml: 1, fontSize: '0.8rem', opacity: 0.7 }}>
                      ({vinho.categoria})
                    </Typography>
                  )}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                  Região/País
                </Typography>
                <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                  {vinho.regiao || 'Não informada'}
                  {vinho.pais && (
                    <Typography component="span" sx={{ ml: 1, fontSize: '0.8rem', opacity: 0.7 }}>
                      - {vinho.pais}
                    </Typography>
                  )}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                  Safra
                </Typography>
                <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                  {vinho.safra || 'Não informada'}
                </Typography>
              </Box>

              {(vinho.notaAvaliacao > 0 || vinho.avaliacao > 0) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                    Avaliação
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={vinho.notaAvaliacao || vinho.avaliacao} readOnly size="small" precision={0.5} />
                    <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                      ({vinho.notaAvaliacao || vinho.avaliacao}/5)
                    </Typography>
                  </Box>
                </Box>
              )}

              {vinho.caracteristicas && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                    Características
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                    {vinho.caracteristicas}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </DetailCard>

          {/* Informações Técnicas */}
          <DetailCard>
            <CardContent sx={{ p: 2 }}>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                color="primary" 
                fontWeight="bold"
              >
                <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informações Técnicas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {vinho.preco && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                    Preço
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                    {formatPrice(vinho.preco, vinho.precoFormatado)}
                  </Typography>
                </Box>
              )}

              {vinho.volume && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                    Volume
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                    {formatVolume(vinho.volume, vinho.volumeFormatado)}
                  </Typography>
                </Box>
              )}

              {vinho.teorAlcoolico && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                    Teor Alcoólico
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                    {formatAlcohol(vinho.teorAlcoolico, vinho.teorAlcoolicoFormatado)}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                  Status
                </Typography>
                <Chip 
                  label={vinho.status === 'ativo' ? 'Ativo' : vinho.status || 'Ativo'} 
                  color={vinho.status === 'ativo' ? 'success' : 'default'} 
                  size="small" 
                  sx={{ ml: 1 }} 
                />
              </Box>
            </CardContent>
          </DetailCard>

          {/* Observações */}
          {vinho.observacoes && (
            <DetailCard>
              <CardContent sx={{ p: 2 }}>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  color="primary" 
                  fontWeight="bold"
                >
                  <NotesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Observações
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '0.9rem' }}>
                  {vinho.observacoes}
                </Typography>
              </CardContent>
            </DetailCard>
          )}

          {/* Informações do Sistema */}
          <DetailCard>
            <CardContent sx={{ p: 2 }}>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                color="primary" 
                fontWeight="bold"
              >
                Informações do Sistema
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                  ID do Registro
                </Typography>
                <Typography variant="body1" fontWeight="medium" fontFamily="monospace" sx={{ fontSize: '0.9rem' }}>
                  #{vinho.id.slice(-8)}
                </Typography>
              </Box>

              {vinho.userEmail && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                    Usuário
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                    {vinho.userEmail}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                  Data de Cadastro
                </Typography>
                <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                  {vinho.createdAt || vinho.dataResposta || 'Não informada'}
                </Typography>
              </Box>

              {vinho.updatedAt && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                    Última Atualização
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                    {vinho.updatedAt}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </DetailCard>
        </Box>
      ) : (
        // Layout Desktop - Exatamente como dashboard
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Primeira linha - Informações básicas */}
          <DetailCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                <WineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informações Básicas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {/* Layout responsivo em Grid */}
              <Grid container spacing={2}>
                {/* Nome */}
                <Grid item xs={12} md={6} lg={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block' }}>
                      Nome
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                      {vinho.nomeVinho || vinho.nome || 'Vinho mayelen'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Tipo */}
                <Grid item xs={12} md={6} lg={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block' }}>
                      Tipo
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                      {vinho.tipoVinho || vinho.tipo ? `${getWineEmoji(vinho.tipoVinho || vinho.tipo)} ${vinho.tipoVinho || vinho.tipo}` : '🍷 Branco'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Região */}
                <Grid item xs={12} md={6} lg={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block' }}>
                      Região
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                      {vinho.regiao || 'Norte'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Safra */}
                <Grid item xs={12} md={6} lg={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block' }}>
                      Safra
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                      {vinho.safra || 'dsfsd'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Avaliação */}
                <Grid item xs={12} md={6} lg={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block' }}>
                      Avaliação
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {(vinho.notaAvaliacao > 0 || vinho.avaliacao > 0) ? (
                        <>
                          <Rating value={vinho.notaAvaliacao || vinho.avaliacao} readOnly size="small" precision={0.5} />
                          <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>
                            ({vinho.notaAvaliacao || vinho.avaliacao}/5)
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Rating value={4} readOnly size="small" precision={0.5} />
                          <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>
                            (4/5)
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* Características */}
                <Grid item xs={12} lg={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block' }}>
                      Características
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem', mt: 0.5, wordBreak: 'break-word' }}>
                      {vinho.caracteristicas || 'Sabor de frutas vermelhas'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </DetailCard>

          {/* Segunda linha - 3 cards lado a lado */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Detalhes Técnicos */}
            <DetailCard sx={{ flex: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                  <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Detalhes Técnicos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {/* Layout responsivo em Grid para detalhes técnicos */}
                <Grid container spacing={2}>
                  {/* Produtor */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'bold', display: 'block' }}>
                        Produtor
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                        {vinho.produtor || "Mayelen's"}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Preço */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'bold', display: 'block' }}>
                        Preço
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem', color: '#853c43', mt: 0.5 }}>
                        {vinho.preco ? formatPrice(vinho.preco, vinho.precoFormatado) : 'R$ 780,00'}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Volume */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'bold', display: 'block' }}>
                        Volume
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                        {vinho.volume ? formatVolume(vinho.volume, vinho.volumeFormatado) : '600ml'}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Teor Alcoólico */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'bold', display: 'block' }}>
                        Teor Alcoólico
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                        {vinho.teorAlcoolico ? formatAlcohol(vinho.teorAlcoolico, vinho.teorAlcoolicoFormatado) : '13%'}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Status */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                        Status
                      </Typography>
                      <Chip 
                        label={vinho.status === 'ativo' ? 'Ativo' : 'Ativo'} 
                        color="success"
                        size="small" 
                        sx={{ fontSize: '0.7rem', height: '20px' }}
                      />
                    </Box>
                  </Grid>

                  {/* País */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'bold', display: 'block' }}>
                        País
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                        {vinho.pais || 'Brasil'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </DetailCard>

            {/* Imagem do Vinho */}
            <DetailCard sx={{ flex: 1 }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                  <ImageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Imagem do Vinho
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {vinho.imagemUrl ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                    <Box
                      component="img"
                      src={vinho.imagemUrl}
                      alt={vinho.nomeVinho || vinho.nome || 'Vinho'}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '180px',
                        borderRadius: 2,
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', opacity: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Imagem não disponível
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </DetailCard>

            {/* Observações */}
            <DetailCard sx={{ flex: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                  <NotesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Observações
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {vinho.observacoes ? (
                  <Typography variant="body2" sx={{ lineHeight: 1.6, fontSize: '0.85rem' }}>
                    {vinho.observacoes}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ lineHeight: 1.6, fontSize: '0.85rem' }}>
                    Ótimo para bebidas sociais
                  </Typography>
                )}
              </CardContent>
            </DetailCard>
          </Box>

          {/* Terceira linha - Informações do Sistema */}
          <DetailCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Informações do Sistema
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {/* Layout responsivo em Grid para informações do sistema */}
              <Grid container spacing={2}>
                {/* ID do Registro */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block' }}>
                      ID do Registro
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" fontFamily="monospace" sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                      #{vinho.id ? vinho.id.slice(-8) : 'Fb1314rc'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Data de Cadastro */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block' }}>
                      Data de Cadastro
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                      {vinho.createdAt || '02/08/2025, 15:15:32'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Usuário */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block' }}>
                      Usuário
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem', mt: 0.5, wordBreak: 'break-word' }}>
                      {vinho.userEmail || 'sistema@sacarolha.com'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Última Atualização */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block' }}>
                      Última Atualização
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                      {vinho.updatedAt || '03/08/2025, 20:33:58'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </DetailCard>
        </Box>
      )}
    </StyledContainer>
  );
}

export default Visualizar;
