import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Middleware de navegação que intercepta todas as mudanças de rota
 * e garante que usuários não autenticados não vejam conteúdo protegido
 */
export function NavigationGuard({ children }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Rotas que não precisam de autenticação
    const publicRoutes = ['/login', '/error/500', '/error/403'];
    
    // Rotas protegidas
    const protectedRoutes = ['/home', '/listagem', '/cadastrar', '/visualizar', '/configuracoes'];
    
    const currentPath = location.pathname;

    // Se não está carregando e não tem usuário autenticado
    if (!loading && !currentUser) {
      // Se está tentando acessar uma rota protegida
      if (protectedRoutes.includes(currentPath)) {
        console.log('🛡️ NavigationGuard: Bloqueando acesso não autorizado a', currentPath);
        navigate('/login', { replace: true });
        return;
      }
    }

    // Se tem usuário autenticado e está na página de login
    if (!loading && currentUser && currentPath === '/login') {
      console.log('🏠 NavigationGuard: Usuário logado, redirecionando para dashboard');
      navigate('/home', { replace: true });
      return;
    }
  }, [currentUser, loading, location.pathname, navigate]);

  return children;
}

export default NavigationGuard;
