import React, { useState, useEffect } from 'react';
import {
  Box,
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
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  LocalBar as WineIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

function Listagem() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [vinhos, setVinhos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVinhos();
  }, []);

  const loadVinhos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const vinhosRef = collection(db, 'vinhos');
      const q = query(vinhosRef, orderBy('dataCadastro', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const vinhosData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        vinhosData.push({
          id: doc.id,
          ...data,
        });
      });
      
      setVinhos(vinhosData);
    } catch (err) {
      console.error('Erro ao carregar vinhos:', err);
      setError('Erro ao carregar a lista de vinhos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    
    try {
      const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleVisualizar = (vinhoId) => {
    navigate(`/visualizar-vinho/${vinhoId}`);
  };

  const handleEditar = (vinhoId) => {
    navigate(`/cadastrar?edit=${vinhoId}`);
  };

  const handleExcluir = async (vinhoId) => {
    if (window.confirm('Tem certeza que deseja excluir este vinho?')) {
      try {
        await deleteDoc(doc(db, 'vinhos', vinhoId));
        await loadVinhos(); // Recarrega a lista
      } catch (err) {
        console.error('Erro ao excluir vinho:', err);
        setError('Erro ao excluir vinho. Tente novamente.');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={50} sx={{ color: '#000000' }} />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 3
          }}
        >
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          fontWeight="bold" 
          color="#000000"
        >
          <WineIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Lista de Vinhos
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/cadastrar')}
          sx={{
            backgroundColor: '#000000',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333',
            },
          }}
        >
          Novo Vinho
        </Button>
      </Box>

      {vinhos.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="200px"
          textAlign="center"
          p={3}
        >
          <WineIcon sx={{ fontSize: 64, color: '#000000', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="#000000" fontWeight="bold" mb={1}>
            Nenhum vinho cadastrado
          </Typography>
          <Typography variant="body2" color="#666666" mb={3}>
            Comece cadastrando seu primeiro vinho!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/cadastrar')}
            sx={{
              backgroundColor: '#000000',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#333333',
              },
            }}
          >
            Cadastrar Vinho
          </Button>
        </Box>
      ) : (
        <>
          {isMobile ? (
            // Versão Mobile - Cards
            <Grid container spacing={2}>
              {vinhos
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((vinho) => (
                <Grid item xs={12} key={vinho.id}>
                  <Card sx={{ border: '1px solid #e0e0e0' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h6" fontWeight="bold" color="#000000">
                          {vinho.nome || 'Nome não informado'}
                        </Typography>
                        <Box>
                          <IconButton 
                            size="small" 
                            onClick={() => handleVisualizar(vinho.id)}
                            sx={{ color: '#000000' }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditar(vinho.id)}
                            sx={{ color: '#000000' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleExcluir(vinho.id)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                        <Chip 
                          label={vinho.tipo || 'Tipo não informado'} 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#000000', 
                            color: '#ffffff'
                          }} 
                        />
                        <Chip 
                          label={`${vinho.pais || 'País não informado'}`} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: '#000000', 
                            color: '#000000'
                          }} 
                        />
                        {vinho.safra && (
                          <Chip 
                            label={`Safra ${vinho.safra}`} 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              borderColor: '#000000', 
                              color: '#000000'
                            }} 
                          />
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="#666666">
                        Cadastrado: {formatarData(vinho.dataCadastro)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            // Versão Desktop - Tabela
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: '#000000' }}>Nome</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#000000' }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#000000' }}>País/Região</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#000000' }}>Safra</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#000000' }}>Data Cadastro</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#000000' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vinhos
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((vinho) => (
                      <TableRow 
                        key={vinho.id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f9f9f9' 
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium" color="#000000">
                            {vinho.nome || 'Nome não informado'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={vinho.tipo || 'N/A'} 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#000000', 
                              color: '#ffffff'
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#000000">
                            {vinho.pais || 'N/A'} {vinho.regiao && `- ${vinho.regiao}`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#000000">
                            {vinho.safra || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#666666">
                            {formatarData(vinho.dataCadastro)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleVisualizar(vinho.id)}
                              sx={{ color: '#000000' }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditar(vinho.id)}
                              sx={{ color: '#000000' }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleExcluir(vinho.id)}
                              sx={{ color: '#d32f2f' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          <TablePagination
            component="div"
            count={vinhos.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
            sx={{
              mt: 2,
              '& .MuiTablePagination-toolbar': {
                color: '#000000',
              },
              '& .MuiTablePagination-selectIcon': {
                color: '#000000',
              },
            }}
          />
        </>
      )}
    </Box>
  );
}

export default Listagem;
