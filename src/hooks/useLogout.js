import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import authManager from '../utils/AuthManager';

/**
 * Hook para logout seguro que limpa completamente a sessão
 */
export function useLogout() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      console.log('🚪 useLogout: Iniciando logout...');
      
      // 1. Faz logout no Firebase
      await signOut(auth);
      
      // 2. Limpa sessão no AuthManager
      authManager.clearSession();
      
      // 3. Force re-inicialização do AuthManager
      await authManager.initialize();
      
      console.log('✅ useLogout: Logout concluído');
      
      // 4. Redireciona para login (redundante, mas garante)
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('❌ useLogout: Erro no logout:', error);
    }
  };

  return logout;
}

export default useLogout;
