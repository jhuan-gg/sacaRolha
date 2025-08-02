import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // SEMPRE mostra loading enquanto verifica autenticação
  if (loading) {
    return <LoadingScreen message="Verificando acesso..." />;
  }

  // Se não tem usuário autenticado, redireciona IMEDIATAMENTE
  if (!currentUser) {
    console.log('🚫 Acesso negado - redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Só renderiza o conteúdo se tem usuário válido
  console.log('✅ Acesso autorizado para:', location.pathname);
  return children;
};

export default ProtectedRoute;
