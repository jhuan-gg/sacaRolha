import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { useState, useEffect } from 'react';

/**
 * Componente de rota ultra-seguro que elimina completamente o flash de conteúdo
 * Implementa verificação tripla e renderização condicional rigorosa
 */
const UltraSecureRoute = ({ children }) => {
  const { currentUser, loading, authChecked, initializing } = useAuth();
  const location = useLocation();
  const [renderAuthorized, setRenderAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Só para de verificar quando tudo estiver pronto
    if (!loading && !initializing && authChecked) {
      // Verificação tripla antes de autorizar renderização
      if (currentUser) {
        console.log('🔒 UltraSecureRoute: Usuário autenticado - autorizando acesso');
        setRenderAuthorized(true);
      } else {
        console.log('🚫 UltraSecureRoute: Usuário não autenticado - bloqueando acesso');
        setRenderAuthorized(false);
      }
      setIsChecking(false);
    } else {
      // Se ainda está inicializando, bloqueia tudo
      setRenderAuthorized(false);
      setIsChecking(true);
    }
  }, [currentUser, loading, authChecked, initializing]);

  // PRIMEIRO BLOQUEIO: Se ainda está inicializando ou carregando
  if (loading || initializing || !authChecked || isChecking) {
    console.log('⏳ UltraSecureRoute: Verificando autenticação...');
    return <LoadingScreen message="Verificando permissões..." />;
  }

  // SEGUNDO BLOQUEIO: Se não tem usuário, redireciona IMEDIATAMENTE
  if (!currentUser || !renderAuthorized) {
    console.log('🚫 UltraSecureRoute: Acesso negado - redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // TERCEIRO BLOQUEIO: Verificação final antes de renderizar
  if (!renderAuthorized) {
    console.log('⛔ UltraSecureRoute: Renderização não autorizada');
    return <LoadingScreen message="Carregando..." />;
  }

  // SÓ AGORA renderiza o conteúdo protegido
  console.log('✅ UltraSecureRoute: Acesso totalmente autorizado para:', location.pathname);
  return children;
};

export default UltraSecureRoute;
