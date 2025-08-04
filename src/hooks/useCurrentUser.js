import { useState, useEffect } from 'react';
import authManager from '../utils/AuthManager';

/**
 * Hook para obter informações do usuário atual
 * Funciona com o AuthManager centralizado
 */
export function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtém usuário inicial
    setUser(authManager.user);

    // Listener para mudanças
    const handleAuthChange = (firebaseUser, isAuthenticated) => {
      setUser(isAuthenticated ? firebaseUser : null);
    };

    authManager.onAuthStateChange(handleAuthChange);

    return () => {
      authManager.removeAuthStateListener(handleAuthChange);
    };
  }, []);

  return user;
}

export default useCurrentUser;
