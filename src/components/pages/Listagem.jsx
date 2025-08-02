import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Box,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Stack,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  LocalBar as WineIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  marginTop: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

const TitleBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center'
  }
}));

const AddButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  fontWeight: 'bold',
  textTransform: 'none',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(2, 3),
    fontSize: '1rem'
  }
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  '& .MuiTableCell-head': {
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: '1rem'
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.light + '20',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease'
  }
}));

const MobileCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
  },
  [theme.breakpoints.up('md')]: {
    display: 'none'
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0, 1, 2, 1),
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
  }
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)'
  }
}));

const MobileCardContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'none'
  },
  [theme.breakpoints.down('sm')]: {
    padding: 0
  }
}));

const PaginationContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: 12,
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(2, 1, 0, 1),
    borderRadius: 12
  }
}));

function Listagem() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [vinhos, setVinhos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carregar vinhos do Firebase
  useEffect(() => {
    loadVinhos();
  }, []);

  const loadVinhos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const vinhosRef = collection(db, 'vinhos');
      const q = query(vinhosRef, orderBy('dataResposta', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const vinhosData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        vinhosData.push({
          id: doc.id,
          ...data,
          // Formatar data para exibição
          dataResposta: data.dataResposta?.toDate ? 
            data.dataResposta.toDate().toLocaleString('pt-BR') :
            data.dataResposta
        });
      });
      
      setVinhos(vinhosData);
    } catch (error) {
      console.error('Erro ao carregar vinhos:', error);
      setError('Erro ao carregar a lista de vinhos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleView = (id) => {
    navigate(`/visualizar?id=${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/cadastrar?edit=${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este vinho?')) {
      try {
        await deleteDoc(doc(db, 'vinhos', id));
        setVinhos(prev => prev.filter(vinho => vinho.id !== id));
      } catch (error) {
        console.error('Erro ao excluir vinho:', error);
        setError('Erro ao excluir vinho. Tente novamente.');
      }
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

  const paginatedData = vinhos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <StyledContainer maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={50} />
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            mx: isMobile ? 1 : 0,
            borderRadius: 3
          }}
        >
          {error}
        </Alert>
      )}

      <HeaderBox>
        <TitleBox>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            fontWeight="bold" 
            color="primary"
          >
            <WineIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Cadastro de Vinhos
          </Typography>
          <Typography 
            variant={isMobile ? "body2" : "subtitle1"} 
            color="text.secondary"
          >
            Gerencie o cadastro de vinhos
          </Typography>
        </TitleBox>
        <AddButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/cadastrar')}
        >
          {isMobile ? 'Novo Vinho' : 'Cadastrar Vinho'}
        </AddButton>
      </HeaderBox>

      {/* Desktop Table */}
      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome do Vinho</TableCell>
              <TableCell>Produtor</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Data/Hora da Resposta</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedData.map((vinho) => (
              <StyledTableRow key={vinho.id}>
                <TableCell>
                  <Typography fontWeight="bold" color="primary">
                    #{vinho.id.slice(-6)}
                  </Typography>
                </TableCell>
                <TableCell>{vinho.nomeVinho || 'N/A'}</TableCell>
                <TableCell>{vinho.produtor || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={vinho.tipoVinho || 'N/A'}
                    color={getTipoVinhoColor(vinho.tipoVinho)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{vinho.dataResposta}</TableCell>
                <TableCell align="center">
                  <ActionButton
                    color="primary"
                    onClick={() => handleView(vinho.id)}
                    title="Visualizar"
                  >
                    <VisibilityIcon />
                  </ActionButton>
                  <ActionButton
                    color="secondary"
                    onClick={() => handleEdit(vinho.id)}
                    title="Editar"
                  >
                    <EditIcon />
                  </ActionButton>
                  <ActionButton
                    color="error"
                    onClick={() => handleDelete(vinho.id)}
                    title="Excluir"
                  >
                    <DeleteIcon />
                  </ActionButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={vinhos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Registros por página:"
        />
      </StyledTableContainer>

      {/* Mobile Cards */}
      <MobileCardContainer>
        {paginatedData.map((vinho) => (
          <MobileCard key={vinho.id}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  color="primary" 
                  fontWeight="bold"
                  sx={{ lineHeight: 1.2 }}
                >
                  #{vinho.id.slice(-6)} - {vinho.nomeVinho || 'Vinho'}
                </Typography>
                <Chip
                  label={vinho.tipoVinho || 'N/A'}
                  color={getTipoVinhoColor(vinho.tipoVinho)}
                  size="small"
                  sx={{ 
                    minWidth: 'fit-content',
                    fontSize: isMobile ? '0.75rem' : '0.8rem'
                  }}
                />
              </Box>
              
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}
                  >
                    Produtor
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    sx={{ 
                      fontSize: isMobile ? '0.85rem' : '0.9rem',
                      lineHeight: 1.3
                    }}
                  >
                    {vinho.produtor || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}
                  >
                    Safra
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    sx={{ 
                      fontSize: isMobile ? '0.85rem' : '0.9rem',
                      lineHeight: 1.3
                    }}
                  >
                    {vinho.safra || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}
                  >
                    Data/Hora da Resposta
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    sx={{ 
                      fontSize: isMobile ? '0.8rem' : '0.85rem',
                      lineHeight: 1.3
                    }}
                  >
                    {vinho.dataResposta}
                  </Typography>
                </Grid>
              </Grid>

              <Stack 
                direction="row" 
                spacing={1} 
                justifyContent="flex-end"
                sx={{ pt: 1 }}
              >
                <IconButton
                  color="primary"
                  onClick={() => handleView(vinho.id)}
                  size={isMobile ? "medium" : "small"}
                  sx={{ 
                    borderRadius: 2,
                    p: isMobile ? 1.5 : 1
                  }}
                >
                  <VisibilityIcon fontSize={isMobile ? "medium" : "small"} /> //preciso ajustar isso depois
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleEdit(vinho.id)}
                  size={isMobile ? "medium" : "small"}
                  sx={{ 
                    borderRadius: 2,
                    p: isMobile ? 1.5 : 1
                  }}
                >
                  <EditIcon fontSize={isMobile ? "medium" : "small"} />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(vinho.id)}
                  size={isMobile ? "medium" : "small"}
                  sx={{ 
                    borderRadius: 2,
                    p: isMobile ? 1.5 : 1
                  }}
                >
                  <DeleteIcon fontSize={isMobile ? "medium" : "small"} />
                </IconButton>
              </Stack>
            </CardContent>
          </MobileCard>
        ))}
        
        <PaginationContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={vinhos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Por página:"
          />
        </PaginationContainer>
      </MobileCardContainer>
    </StyledContainer>
  );
}

export default Listagem;
