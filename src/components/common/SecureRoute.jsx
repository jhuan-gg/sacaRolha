import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

/**
 * Hook personalizado para proteção de rotas
 * Previne flash de conteúdo não autorizado
 */
export function useRouteGuard() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Se ainda está carregando, não faz nada
    if (loading) {
      setIsChecking(true);
      setIsAuthorized(false);
      return;
    }

    // Se não tem usuário, redireciona imediatamente
    if (!currentUser) {
      console.log('🚫 Acesso negado - sem usuário autenticado');
      setIsAuthorized(false);
      setIsChecking(false);
      navigate('/login', { replace: true });
      return;
    }

    // Se tem usuário, autoriza acesso
    console.log('✅ Usuário autenticado - acesso autorizado');
    setIsAuthorized(true);
    setIsChecking(false);
  }, [currentUser, loading, navigate, location.pathname]);

  return { isAuthorized, isChecking, currentUser };
}

/**
 * Componente de proteção de rota melhorado
 */
function SecureRoute({ children }) {
  const { isAuthorized, isChecking } = useRouteGuard();

  // Sempre mostra loading primeiro
  if (isChecking) {
    return <LoadingScreen message="Verificando permissões..." />;
  }

  // Só renderiza se autorizado
  if (!isAuthorized) {
    return <LoadingScreen message="Redirecionando..." />;
  }

  return children;
}

export default SecureRoute;
