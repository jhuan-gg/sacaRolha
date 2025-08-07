import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Container,
  Paper,
  Chip,
  Divider,
  Button,
  Grid,
  Avatar,
  Stack,
  Rating,
  Fade,
  Slide,
} from '@mui/material';
import {
  LocalBar as WineIcon,
  Assignment as AssignmentIcon,
  Image as ImageIcon,
  Star as StarIcon,
  ArrowBack as ArrowBackIcon,
  RateReview as RateReviewIcon,
  LocationOn as LocationIcon,
  Euro as PriceIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisualIcon,
  Psychology as TasteIcon,
} from '@mui/icons-material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function VisualizarNovo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [vinho, setVinho] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarVinho();
  }, []);

  const carregarVinho = async () => {
    try {
      setLoading(true);
      
      if (!id) {
        setError('ID do vinho não fornecido');
        return;
      }

      const docRef = doc(db, 'vinhos', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setVinho({
          id: docSnap.id,
          ...docSnap.data()
        });
        setError(null);
      } else {
        setError('Vinho não encontrado');
      }
    } catch (err) {
      console.error('Erro ao carregar vinho:', err);
      setError('Erro ao carregar os dados do vinho');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    
    try {
      const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const renderSection = (title, icon, children) => (
    <Fade in={true} timeout={600}>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
            pb: 2,
            borderBottom: '2px solid #000000'
          }}
        >
          <Avatar sx={{ 
            bgcolor: '#000000', 
            color: '#ffffff',
            width: { xs: 40, md: 48 },
            height: { xs: 40, md: 48 }
          }}>
            {icon}
          </Avatar>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            fontWeight="bold"
            sx={{ 
              letterSpacing: '0.5px',
              color: '#000000',
              textTransform: 'uppercase'
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          {children}
        </Box>
      </Box>
    </Fade>
  );

  const renderField = (label, value, unit = '', icon = null) => (
    <Box sx={{ 
      mb: { xs: 2, md: 3 },
      pb: 2,
      borderBottom: '1px solid #e0e0e0'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {icon && <Box sx={{ color: '#000000' }}>{icon}</Box>}
        <Typography 
          variant="subtitle2" 
          color="#000000" 
          fontWeight="bold"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
        >
          {label}
        </Typography>
      </Box>
      <Typography 
        variant="body1" 
        sx={{ 
          color: value ? '#000000' : '#666666',
          fontWeight: value ? '500' : '400',
          fontSize: { xs: '0.95rem', md: '1rem' }
        }}
      >
        {value ? `${value}${unit}` : 'Não informado'}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ 
        mt: { xs: 2, md: 4 }, 
        mb: 4,
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Fade in={true}>
          <Box 
            display="flex" 
            flexDirection="column"
            justifyContent="center" 
            alignItems="center" 
            gap={3}
          >
            <CircularProgress size={60} sx={{ color: '#000000' }} />
            <Typography variant="h6" color="#000000">
              Carregando dados do vinho...
            </Typography>
          </Box>
        </Fade>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 4 }}>
        <Fade in={true}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              fontSize: '1rem',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: '2px solid #000000'
            }}
          >
            {error}
          </Alert>
        </Fade>
      </Container>
    );
  }

  if (!vinho) {
    return (
      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 4 }}>
        <Fade in={true}>
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              fontSize: '1rem',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '2px solid #000000'
            }}
          >
            Vinho não encontrado
          </Alert>
        </Fade>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: { xs: 1, md: 4 }, 
        mb: 4,
        px: { xs: 2, md: 3 }
      }}
    >
      {/* Header com Navegação */}
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/vinhos-consultas')}
            sx={{ 
              mb: 3,
              borderColor: '#000000',
              color: '#000000',
              borderRadius: 2,
              px: 3,
              py: 1,
              '&:hover': {
                borderColor: '#000000',
                backgroundColor: '#ffffff',
              }
            }}
          >
            Voltar para Consultas
          </Button>
          
          {/* Header Principal */}
          <Paper 
            elevation={0}
            sx={{ 
              background: '#000000',
              borderRadius: 4,
              p: { xs: 3, md: 4 },
              color: 'white',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                pointerEvents: 'none'
              }
            }}
          >
            <Avatar sx={{ 
              bgcolor: 'rgba(255,255,255,0.3)', 
              color: 'white',
              width: { xs: 60, md: 80 },
              height: { xs: 60, md: 80 },
              mx: 'auto',
              mb: 2
            }}>
              <WineIcon sx={{ fontSize: { xs: 32, md: 48 } }} />
            </Avatar>
            
            <Typography 
              variant={isMobile ? "h5" : "h3"} 
              fontWeight="bold" 
              gutterBottom
              sx={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '1px'
              }}
            >
              DETALHES DO VINHO
            </Typography>
            
            <Typography 
              variant={isMobile ? "h6" : "h4"} 
              sx={{ 
                mb: 2,
                color: '#fff',
                opacity: 0.9,
                fontWeight: '500'
              }}
            >
              {vinho.nome || 'Nome não informado'}
            </Typography>
            
            <Chip 
              label={`Cadastrado em: ${formatarData(vinho.dataCadastro)}`}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: 3
              }}
            />
          </Paper>
        </Box>
      </Fade>

      {/* Ficha Técnica */}
      {renderSection('INFORMAÇÕES BÁSICAS', <AssignmentIcon />, (
        <Box>
          {renderField('Nome do Vinho', vinho.nome, '', <WineIcon />)}
          {renderField('Tipo', vinho.tipo, '', <TasteIcon />)}
          {renderField('País', vinho.pais, '', <LocationIcon />)}
          {renderField('Região', vinho.regiao, '', <LocationIcon />)}
          {renderField('Produtor', vinho.produtor)}
          {renderField('Safra', vinho.safra, '', <CalendarIcon />)}
          {renderField('ABV', vinho.abv, '%')}
          {renderField('Uva', vinho.uva)}
        </Box>
      ))}

      {/* Informações de Compra */}
      {renderSection('INFORMAÇÕES DE COMPRA', <PriceIcon />, (
        <Box>
          {renderField('Valor', vinho.valor, ' R$', <PriceIcon />)}
          {renderField('Data da Compra', vinho.dataCompra ? new Date(vinho.dataCompra).toLocaleDateString('pt-BR') : '', '', <CalendarIcon />)}
          {renderField('Local da Compra', vinho.localCompra, '', <LocationIcon />)}
        </Box>
      ))}

      {/* Características e Análise */}
      {renderSection('CARACTERÍSTICAS E ANÁLISE', <VisualIcon />, (
        <Box>
          {vinho.caracteristicas && renderField('Características', vinho.caracteristicas)}
          {vinho.analise && (
            <>
              <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" color="#000000" fontWeight="bold" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  VISUAL
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating 
                    value={vinho.analise.visual || 0} 
                    readOnly 
                    size="small"
                    sx={{ color: '#000000' }}
                  />
                  <Typography variant="body2" color="#000000">
                    ({vinho.analise.visual || 0}/5)
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" color="#000000" fontWeight="bold" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  CORPO
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating 
                    value={vinho.analise.corpo || 0} 
                    readOnly 
                    size="small"
                    sx={{ color: '#000000' }}
                  />
                  <Typography variant="body2" color="#000000">
                    ({vinho.analise.corpo || 0}/5)
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" color="#000000" fontWeight="bold" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ACIDEZ
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating 
                    value={vinho.analise.acidez || 0} 
                    readOnly 
                    size="small"
                    sx={{ color: '#000000' }}
                  />
                  <Typography variant="body2" color="#000000">
                    ({vinho.analise.acidez || 0}/5)
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" color="#000000" fontWeight="bold" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  TANINO
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating 
                    value={vinho.analise.tanino || 0} 
                    readOnly 
                    size="small"
                    sx={{ color: '#000000' }}
                  />
                  <Typography variant="body2" color="#000000">
                    ({vinho.analise.tanino || 0}/5)
                  </Typography>
                </Box>
              </Box>
              
              {vinho.analise.aromas && renderField('Aromas', vinho.analise.aromas)}
            </>
          )}
        </Box>
      ))}

      {/* Imagem */}
      {(vinho.urlImagem || vinho.descricaoImagem) && renderSection('IMAGEM DO RÓTULO', <ImageIcon />, (
        <Box>
          {vinho.urlImagem && (
            <Box sx={{ 
              textAlign: 'center', 
              mb: 3,
              pb: 2,
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Typography variant="subtitle2" color="#000000" fontWeight="bold" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                IMAGEM
              </Typography>
              <img 
                src={vinho.urlImagem} 
                alt={vinho.descricaoImagem || 'Imagem do vinho'}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: isMobile ? '250px' : '400px', 
                  borderRadius: '12px',
                  objectFit: 'contain',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}
          {renderField('URL da Imagem', vinho.urlImagem)}
        </Box>
      ))}

      {/* Avaliação Geral */}
      {(vinho.avaliacaoGeral || vinho.notaGeral || vinho.observacoes) && renderSection('AVALIAÇÃO GERAL', <StarIcon />, (
        <Box>
          {(vinho.notaGeral || vinho.avaliacaoGeral?.notaGeral) && (
            <Box sx={{ 
              textAlign: 'center',
              mb: 3,
              pb: 2,
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Typography variant="subtitle2" color="#000000" fontWeight="bold" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                NOTA GERAL
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <Rating 
                  value={vinho.notaGeral || vinho.avaliacaoGeral?.notaGeral || 0} 
                  readOnly 
                  size="large"
                  sx={{ color: '#000000' }}
                />
                <Typography variant="h6" color="#000000" fontWeight="bold">
                  {vinho.notaGeral || vinho.avaliacaoGeral?.notaGeral || 0}/5
                </Typography>
              </Box>
            </Box>
          )}
          {vinho.avaliacaoGeral?.dataAvaliacao && 
            renderField('Data da Avaliação', new Date(vinho.avaliacaoGeral.dataAvaliacao).toLocaleDateString('pt-BR'), '', <CalendarIcon />)
          }
          {vinho.avaliacaoGeral?.localAvaliacao && 
            renderField('Local da Avaliação', vinho.avaliacaoGeral.localAvaliacao, '', <LocationIcon />)
          }
          {(vinho.observacoes || vinho.avaliacaoGeral?.consideracoes) && 
            renderField('Observações', vinho.observacoes || vinho.avaliacaoGeral?.consideracoes)
          }
        </Box>
      ))}


      {/* Informações de Sistema */}
      <Fade in={true} timeout={1200}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            backgroundColor: '#ffffff',
            borderRadius: 4,
            border: '2px solid #000000',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="subtitle2" 
            color="#000000" 
            sx={{ 
              mb: 2,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Informações do Sistema
          </Typography>
          
          <Divider sx={{ 
            my: 2, 
            borderColor: '#000000',
            '&::before, &::after': {
              borderColor: '#000000'
            }
          }} />
          
          <Stack 
            direction={isMobile ? 'column' : 'row'} 
            spacing={2} 
            justifyContent="center"
            alignItems="center"
          >
            <Chip 
              label={`ID: ${vinho.id}`}
              variant="outlined"
              sx={{ 
                borderColor: '#000000',
                color: '#000000',
                fontFamily: 'monospace',
                fontSize: '0.8rem'
              }}
            />
            <Chip 
              label={`Cadastrado: ${formatarData(vinho.dataCadastro)}`}
              variant="outlined"
              sx={{ 
                borderColor: '#000000',
                color: '#000000',
                fontSize: '0.8rem'
              }}
            />
          </Stack>
        </Paper>
      </Fade>
    </Container>
  );
}

export default VisualizarNovo;
