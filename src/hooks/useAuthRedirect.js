import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    // Não redireciona enquanto está carregando
    if (loading) return;

    // Se não está logado, vai para login
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    // Se está logado e está na página de login, vai para home
    if (currentUser && window.location.pathname === '/login') {
      navigate('/home', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  return { currentUser, loading };
}

export default useAuthRedirect;
