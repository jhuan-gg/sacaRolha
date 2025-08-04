import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import LoadingScreen from './LoadingScreen';

/**
 * GUARD ULTRA-SEGURO - Bloqueia TODA a aplicação até verificação COMPLETA
 * Não renderiza NADA até ter certeza absoluta do estado de autenticação
 */
function AuthGuard({ children }) {
  const [authState, setAuthState] = useState('CHECKING'); // CHECKING, AUTHENTICATED, UNAUTHENTICATED
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('🔒 AuthGuard: Iniciando verificação de segurança...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Verificação DUPLA do token para garantir validade
          const token = await firebaseUser.getIdToken(true);
          if (token) {
            console.log('✅ AuthGuard: Usuário AUTENTICADO confirmado');
            setUser(firebaseUser);
            setAuthState('AUTHENTICATED');
          } else {
            console.log('❌ AuthGuard: Token inválido');
            setUser(null);
            setAuthState('UNAUTHENTICATED');
          }
        } else {
          console.log('👤 AuthGuard: Usuário NÃO AUTENTICADO');
          setUser(null);
          setAuthState('UNAUTHENTICATED');
        }
      } catch (error) {
        console.error('🚨 AuthGuard: Erro na verificação:', error);
        // Em caso de erro, assume NÃO AUTENTICADO por segurança
        setUser(null);
        setAuthState('UNAUTHENTICATED');
      }
    });

    // Timeout de segurança absoluto - se não verificar em 3 segundos, assume não logado
    const timeoutId = setTimeout(() => {
      if (authState === 'CHECKING') {
        console.warn('⏰ AuthGuard: TIMEOUT - Assumindo usuário não autenticado por segurança');
        setUser(null);
        setAuthState('UNAUTHENTICATED');
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  // BLOQUEIO TOTAL - não renderiza NADA enquanto não tiver certeza
  if (authState === 'CHECKING') {
    console.log('⏳ AuthGuard: BLOQUEANDO renderização - verificando...');
    return (
      <LoadingScreen 
        message="Verificando segurança..." 
        minimal={false}
      />
    );
  }

  // Só passa o controle quando tem CERTEZA do estado
  console.log(`🎯 AuthGuard: Estado confirmado - ${authState}`);
  return children({ user, isAuthenticated: authState === 'AUTHENTICATED' });
}

export default AuthGuard;
