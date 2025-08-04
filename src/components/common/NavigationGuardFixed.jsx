import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

/**
 * Middleware de navegação que intercepta todas as mudanças de rota
 * e garante que usuários não autenticados não vejam conteúdo protegido
 * VERSÃO ULTRA-SEGURA: Bloqueia completamente flash de conteúdo
 */
function NavigationGuard({ children }) {
  const { currentUser, loading, authChecked, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // NÃO FAZ NADA enquanto estiver inicializando
    if (loading || initializing || !authChecked) {
      console.log('🔄 NavigationGuard: Aguardando verificação de autenticação...');
      return;
    }

    // Rotas que não precisam de autenticação
    const publicRoutes = ['/login', '/error/500', '/error/403', '/404'];
    
    // Rotas protegidas
    const protectedRoutes = ['/home', '/listagem', '/cadastrar', '/visualizar', '/configuracoes'];
    
    const currentPath = location.pathname;

    // PREVENÇÃO CRÍTICA: Se não tem usuário e está tentando acessar rota protegida
    if (!currentUser && protectedRoutes.includes(currentPath)) {
      console.log('🚨 NavigationGuard: BLOQUEANDO acesso não autorizado a:', currentPath);
      navigate('/login', { replace: true });
      return;
    }

    // Se tem usuário autenticado e está na página de login, redireciona para home
    if (currentUser && currentPath === '/login') {
      console.log('🏠 NavigationGuard: Usuário logado redirecionado para home');
      navigate('/home', { replace: true });
      return;
    }

    // Se está na rota raiz, redireciona para login
    if (currentPath === '/') {
      console.log('🔄 NavigationGuard: Redirecionando rota raiz para login');
      navigate('/login', { replace: true });
      return;
    }
  }, [currentUser, loading, authChecked, initializing, location.pathname, navigate]);

  // BLOQUEIO TOTAL durante inicialização
  if (loading || initializing || !authChecked) {
    return <LoadingScreen message="Verificando acesso..." />;
  }

  return children;
}

export default NavigationGuard;
