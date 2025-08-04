import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
  Chip,
  Skeleton,
  Button
} from '@mui/material';
import {
  LocalBar as WineIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  StarRate as StarIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart
} from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50],
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

const DashboardCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)'
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0, 0.5),
    borderRadius: 12
  }
}));

const StatCard = styled(Card)(({ theme, color }) => ({
  borderRadius: 16,
  background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
  border: `1px solid ${color}20`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)'
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: 12,
    minHeight: 140,
    margin: theme.spacing(0.5, 0.5)
  }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #395a4f 0%, #432330 100%)',
  borderRadius: 20,
  color: 'white',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    borderRadius: 16,
    margin: theme.spacing(0, 1, 3, 1)
  }
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  minHeight: 48,
  '&:hover': {
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-1px)'
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 2),
    fontSize: '0.9rem',
    minHeight: 52
  }
}));

// Cores para os gráficos
const COLORS = ['#853c43', '#395a4f', '#f25c5e', '#ffa566', '#432330', '#0088fe'];

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(600)); // Force mobile detection
  const navigate = useNavigate();
  
  // Estados para dados da dashboard
  const [loading, setLoading] = useState(true);
  const [wineData, setWineData] = useState([]);
  const [stats, setStats] = useState({
    totalWines: 0,
    averageRating: 0,
    categories: [],
    monthlyData: []
  });

  // Função para buscar dados dos vinhos
  const fetchWineData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'vinhos'));
      const wines = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        wines.push({ id: doc.id, ...data });
      });

      // Processar dados para estatísticas
      const totalWines = wines.length;
      const averageRating = wines.length > 0 
        ? wines.reduce((sum, wine) => sum + (parseFloat(wine.notaAvaliacao) || 0), 0) / wines.length 
        : 0;

      // Agrupar por tipo/categoria
      const categoryCounts = wines.reduce((acc, wine) => {
        const type = wine.tipoVinho || 'Não definido';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const categories = Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value
      }));

      // Dados mensais (simulados para demo)
      const monthlyData = [
        { month: 'Jan', vinhos: Math.floor(Math.random() * 20) + 5 },
        { month: 'Feb', vinhos: Math.floor(Math.random() * 20) + 5 },
        { month: 'Mar', vinhos: Math.floor(Math.random() * 20) + 5 },
        { month: 'Abr', vinhos: Math.floor(Math.random() * 20) + 5 },
        { month: 'Mai', vinhos: Math.floor(Math.random() * 20) + 5 },
        { month: 'Jun', vinhos: Math.floor(Math.random() * 20) + 5 }
      ];

      setWineData(wines);
      setStats({
        totalWines,
        averageRating: Math.round(averageRating * 10) / 10,
        categories,
        monthlyData
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      // Dados de fallback para quando não há conexão
      setStats({
        totalWines: 0,
        averageRating: 0,
        categories: [
          { name: 'Tinto', value: 15 },
          { name: 'Branco', value: 8 },
          { name: 'Rosé', value: 5 },
          { name: 'Espumante', value: 3 }
        ],
        monthlyData: [
          { month: 'Jan', vinhos: 12 },
          { month: 'Feb', vinhos: 19 },
          { month: 'Mar', vinhos: 15 },
          { month: 'Abr', vinhos: 22 },
          { month: 'Mai', vinhos: 18 },
          { month: 'Jun', vinhos: 25 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWineData();
  }, []);

  // Componente para card de estatística
  const StatisticCard = ({ title, value, icon, color, subtitle }) => (
    <StatCard color={color}>
      <CardContent sx={{ 
        p: isMobile ? 2.5 : 3, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%'
      }}>
        <Avatar
          sx={{
            backgroundColor: `${color}20`,
            color: color,
            width: isMobile ? 48 : 56,
            height: isMobile ? 48 : 56,
            mb: isMobile ? 1.5 : 2
          }}
        >
          {icon}
        </Avatar>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          fontWeight="bold" 
          color={color}
          gutterBottom
          sx={{ lineHeight: 1.2 }}
        >
          {loading ? <Skeleton width={60} /> : value}
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="text.primary" 
          fontWeight="medium"
          gutterBottom={!!subtitle}
          sx={{ lineHeight: 1.3 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ lineHeight: 1.2 }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </StatCard>
  );

  return (
    <StyledContainer maxWidth={false}>
      {/* Header */}
      <HeaderBox>
        <WineIcon sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom>
          SacaRolha Dashboard
        </Typography>
        <Typography variant={isMobile ? "body1" : "h6"} sx={{ opacity: 0.9 }}>
          Gerencie sua coleção de vinhos com elegância
        </Typography>
      </HeaderBox>

      {/* Estatísticas Principais */}
      {isMobile ? (
        // Layout móvel - coluna única
        <Box sx={{ mb: 4, px: 1 }}>
          <Box sx={{ mb: 1 }}>
            <StatisticCard
              title="Total de Vinhos"
              value={stats.totalWines}
              icon={<WineIcon />}
              color="#853c43"
              subtitle="Em sua coleção"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <StatisticCard
              title="Avaliação Média"
              value={`${stats.averageRating}/5`}
              icon={<StarIcon />}
              color="#395a4f"
              subtitle="Qualidade geral"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <StatisticCard
              title="Categorias"
              value={stats.categories.length}
              icon={<InventoryIcon />}
              color="#f25c5e"
              subtitle="Tipos diferentes"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <StatisticCard
              title="Crescimento"
              value="+23%"
              icon={<TrendingUpIcon />}
              color="#ffa566"
              subtitle="Este mês"
            />
          </Box>
        </Box>
      ) : (
        // Layout desktop - linha horizontal com margem
        <Box sx={{ mb: 4, px: 1, display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <StatisticCard
              title="Total de Vinhos"
              value={stats.totalWines}
              icon={<WineIcon />}
              color="#853c43"
              subtitle="Em sua coleção"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatisticCard
              title="Avaliação Média"
              value={`${stats.averageRating}/5`}
              icon={<StarIcon />}
              color="#395a4f"
              subtitle="Qualidade geral"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatisticCard
              title="Categorias"
              value={stats.categories.length}
              icon={<InventoryIcon />}
              color="#f25c5e"
              subtitle="Tipos diferentes"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatisticCard
              title="Crescimento"
              value="+23%"
              icon={<TrendingUpIcon />}
              color="#ffa566"
              subtitle="Este mês"
            />
          </Box>
        </Box>
      )}

            {/* Gráficos */}
      {isMobile ? (
        // Layout móvel - coluna única
        <Box sx={{ mb: 4, px: 1 }}>
          <Box sx={{ mb: 2 }}>
            <DashboardCard>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                  Distribuição por Categoria
                </Typography>
                <Box sx={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {loading ? (
                    <Skeleton variant="circular" width={200} height={200} />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.categories}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {stats.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </CardContent>
            </DashboardCard>
          </Box>
          <Box sx={{ mb: 2 }}>
            <DashboardCard>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                  Crescimento da Coleção
                </Typography>
                <Box sx={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={200} />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#853c43" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#853c43" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="vinhos" 
                          stroke="#853c43" 
                          fill="url(#colorGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </CardContent>
            </DashboardCard>
          </Box>
        </Box>
      ) : (
        // Layout desktop - linha horizontal com margem
        <Box sx={{ mb: 4, px: 1, display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <DashboardCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                  Distribuição por Categoria
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {loading ? (
                    <Skeleton variant="circular" width={250} height={250} sx={{ mx: 'auto' }} />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.categories}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {stats.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </CardContent>
            </DashboardCard>
          </Box>
          <Box sx={{ flex: 1 }}>
            <DashboardCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                  Crescimento da Coleção
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={250} />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#853c43" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#853c43" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="vinhos" 
                          stroke="#853c43" 
                          fill="url(#colorGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </CardContent>
            </DashboardCard>
          </Box>
        </Box>
      )}

      {/* Ações Rápidas */}
      {isMobile ? (
        // Layout móvel - coluna única
        <Box sx={{ px: 1, mb: 3 }}>
          <DashboardCard>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                Ações Rápidas
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <QuickActionButton
                    variant="contained"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/cadastrar')}
                    sx={{ 
                      backgroundColor: '#853c43',
                      '&:hover': { backgroundColor: '#432330' }
                    }}
                  >
                    Cadastrar Vinho
                  </QuickActionButton>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <QuickActionButton
                    variant="outlined"
                    fullWidth
                    startIcon={<ViewIcon />}
                    onClick={() => navigate('/listagem')}
                    sx={{ 
                      borderColor: '#395a4f',
                      color: '#395a4f',
                      '&:hover': { 
                        borderColor: '#432330',
                        backgroundColor: '#395a4f10'
                      }
                    }}
                  >
                    Ver Coleção
                  </QuickActionButton>
                </Box>
                <Box>
                  <QuickActionButton
                    variant="outlined"
                    fullWidth
                    startIcon={<AssessmentIcon />}
                    onClick={() => navigate('/configuracoes')}
                    sx={{ 
                      borderColor: '#f25c5e',
                      color: '#f25c5e',
                      '&:hover': { 
                        borderColor: '#ffa566',
                        backgroundColor: '#f25c5e10'
                      }
                    }}
                  >
                    Relatórios
                  </QuickActionButton>
                </Box>
              </Box>
            </CardContent>
          </DashboardCard>
        </Box>
      ) : (
        // Layout desktop - centralizado
        <Box sx={{ mb: 3, px: 1 }}>
          <DashboardCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                Ações Rápidas
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <QuickActionButton
                    variant="contained"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/cadastrar')}
                    sx={{ 
                      backgroundColor: '#853c43',
                      '&:hover': { backgroundColor: '#432330' }
                    }}
                  >
                    Cadastrar Vinho
                  </QuickActionButton>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <QuickActionButton
                    variant="outlined"
                    fullWidth
                    startIcon={<ViewIcon />}
                    onClick={() => navigate('/listagem')}
                    sx={{ 
                      borderColor: '#395a4f',
                      color: '#395a4f',
                      '&:hover': { 
                        borderColor: '#432330',
                        backgroundColor: '#395a4f10'
                      }
                    }}
                  >
                    Ver Coleção
                  </QuickActionButton>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <QuickActionButton
                    variant="outlined"
                    fullWidth
                    startIcon={<AssessmentIcon />}
                    onClick={() => navigate('/configuracoes')}
                    sx={{ 
                      borderColor: '#f25c5e',
                      color: '#f25c5e',
                      '&:hover': { 
                        borderColor: '#ffa566',
                        backgroundColor: '#f25c5e10'
                      }
                    }}
                  >
                    Relatórios
                  </QuickActionButton>
                </Box>
              </Box>
            </CardContent>
          </DashboardCard>
        </Box>
      )}

      {/* Vinhos Recentes */}
      <Box sx={{ px: 1 }}>
        <DashboardCard>
          <CardContent sx={{ p: isMobile ? 2 : 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexDirection={isMobile ? 'column' : 'row'} gap={isMobile ? 1 : 0}>
              <Typography variant="h6" fontWeight="bold" textAlign={isMobile ? 'center' : 'left'}>
                Vinhos Adicionados Recentemente
              </Typography>
              <Chip
                label={`${stats.totalWines} total`}
                color="primary"
                variant="outlined"
              />
            </Box>
            
            {loading ? (
              <Box>
                {[1, 2, 3].map((item) => (
                  <Box key={item} display="flex" alignItems="center" mb={2} p={isMobile ? 1 : 0}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : wineData.length === 0 ? (
              <Box textAlign="center" py={4}>
                <WineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhum vinho cadastrado ainda
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3} px={isMobile ? 2 : 0}>
                  Comece cadastrando seu primeiro vinho para ver estatísticas detalhadas
                </Typography>
                  <QuickActionButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/cadastrar')}
                  sx={{ 
                    backgroundColor: '#853c43',
                    '&:hover': { backgroundColor: '#432330' }
                  }}
                >
                  Cadastrar Primeiro Vinho
                </QuickActionButton>
              </Box>
            ) : (
              <Box>
                {wineData.slice(0, 5).map((wine) => (
                  <Box 
                    key={wine.id} 
                    display="flex" 
                    alignItems="center" 
                    mb={2}
                    p={isMobile ? 1.5 : 2}
                    sx={{ 
                      backgroundColor: theme.palette.grey[50],
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.grey[100]
                      }
                    }}
                    onClick={() => navigate(`/visualizar?id=${wine.id}`)}
                  >
                    <Avatar sx={{ mr: 2, backgroundColor: '#853c43', width: isMobile ? 36 : 40, height: isMobile ? 36 : 40 }}>
                      <WineIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant={isMobile ? "body1" : "subtitle1"} fontWeight="medium">
                        {wine.nomeVinho || 'Vinho sem nome'}
                      </Typography>
                      <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                        {wine.tipoVinho || 'Tipo não definido'} • {wine.regiao || 'Região não definida'}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${wine.notaAvaliacao || 0}/5`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                ))}
                
                {wineData.length > 5 && (
                  <Box textAlign="center" mt={2}>
                    <Button
                      variant="text"
                      onClick={() => navigate('/listagem')}
                      sx={{ color: '#853c43' }}
                    >
                      Ver todos os {wineData.length} vinhos
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </DashboardCard>
      </Box>
    </StyledContainer>
  );
}

export default Home;
