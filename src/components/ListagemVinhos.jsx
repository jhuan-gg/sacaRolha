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
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Rating,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  LocalBar as WineIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

function ListagemVinhos() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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

  const handleVisualizar = (vinhoId) => {
    navigate(`/visualizar-vinho/${vinhoId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress size={40} sx={{ color: '#000000' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 3,
          borderRadius: 2,
          border: '1px solid #000000'
        }}
      >
        {error}
      </Alert>
    );
  }

  if (vinhos.length === 0) {
    return (
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
        <Typography variant="body2" color="#666666">
          Comece cadastrando seu primeiro vinho!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {isMobile ? (
        // Versão Mobile - Cards
        <Box>
          {vinhos.map((vinho, index) => (
            <Box
              key={vinho.id}
              sx={{
                p: 2,
                mb: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#f9f9f9',
                }
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Typography variant="subtitle1" fontWeight="bold" color="#000000">
                  {vinho.nome || 'Nome não informado'}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleVisualizar(vinho.id)}
                  sx={{ color: '#000000' }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Box>
              
              <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                <Chip 
                  label={vinho.tipo || 'Tipo não informado'} 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#000000', 
                    color: '#ffffff',
                    fontSize: '0.75rem'
                  }} 
                />
                <Chip 
                  label={`${vinho.pais || 'País não informado'}`} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    borderColor: '#000000', 
                    color: '#000000',
                    fontSize: '0.75rem'
                  }} 
                />
              </Box>
              
              <Typography variant="body2" color="#666666">
                Cadastrado: {formatarData(vinho.dataCadastro)}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        // Versão Desktop - Tabela
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
              {vinhos.map((vinho) => (
                <TableRow 
                  key={vinho.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: '#f9f9f9' 
                    },
                    borderBottom: '1px solid #e0e0e0'
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
                        color: '#ffffff',
                        fontSize: '0.75rem'
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
                    <IconButton 
                      size="small" 
                      onClick={() => handleVisualizar(vinho.id)}
                      sx={{ 
                        color: '#000000',
                        '&:hover': {
                          backgroundColor: '#f0f0f0'
                        }
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default ListagemVinhos;
