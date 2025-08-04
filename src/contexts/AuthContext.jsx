import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import LoadingScreen from '../components/common/LoadingScreen';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Login com email e senha
  const login = async (email, password) => {
    try {
      console.log('🔑 Iniciando processo de login...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login realizado com sucesso');
      
      // Força atualização do estado do usuário
      setCurrentUser(userCredential.user);
      
      return userCredential;
    } catch (error) {
      console.error('❌ Erro ao fazer login:', error);
      throw error;
    }
  };

  // Cadastro de novo usuário
  const signup = async (email, password, profileData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar o display name no Firebase Auth
      if (profileData.nome) {
        await updateProfile(result.user, {
          displayName: `${profileData.nome} ${profileData.sobrenome || ''}`
        });
      }

      // Criar perfil no Firestore
      await createUserProfile(result.user.uid, {
        email: result.user.email,
        displayName: result.user.displayName,
        ...profileData,
        createdAt: new Date(),
        role: 'member', // Role padrão
        status: 'active'
      });

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  // Reset de senha
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Carregar perfil do usuário do Firestore
  const loadUserProfile = async (uid) => {
    // Usa cache se disponível
    if (userProfile && userProfile.uid === uid) {
      return userProfile;
    }
    
    try {
      // Cria perfil padrão primeiro (não dependente do Firestore)
      const defaultProfile = {
        uid,
        displayName: auth.currentUser?.displayName || null,
        email: auth.currentUser?.email || '',
        createdAt: new Date().toISOString(),
        isDefault: true
      };
      
      // Define o perfil padrão imediatamente
      setUserProfile(defaultProfile);
      
      // Tenta buscar dados do Firestore de forma assíncrona (não bloqueia)
      setTimeout(async () => {
        try {
          const docSnap = await getDoc(doc(db, 'users', uid));
          if (docSnap.exists()) {
            const firestoreProfile = { uid, ...docSnap.data(), isDefault: false };
            setUserProfile(firestoreProfile);
          }
        } catch (error) {
          console.warn('Usando perfil padrão devido a erro:', error.message);
        }
      }, 100);
      
      return defaultProfile;
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      
      // Em caso de erro, cria perfil temporário
      const fallbackProfile = {
        uid,
        displayName: null,
        email: auth.currentUser?.email || '',
        offline: true
      };
      setUserProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  // Criar perfil do usuário no Firestore
  const createUserProfile = async (userId, profileData) => {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, profileData);
      setUserProfile(profileData);
    } catch (error) {
      throw error;
    }
  };

  // Atualizar perfil do usuário
  const updateUserProfile = async (userId, profileData) => {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, profileData, { merge: true });
      setUserProfile(prev => ({ ...prev, ...profileData }));
    } catch (error) {
      throw error;
    }
  };

  // Verificar se usuário tem permissão
  const hasRole = (role) => {
    return userProfile?.role === role;
  };

  const hasPermission = (permission) => {
    const userRole = userProfile?.role;
    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users'],
      sommelier: ['read', 'write', 'delete'],
      member: ['read', 'write_own']
    };
    return permissions[userRole]?.includes(permission) || false;
  };

  // Monitor de autenticação
  useEffect(() => {
    let timeoutId;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔐 Estado de autenticação mudou:', user ? 'usuário logado' : 'usuário deslogado');
      
      try {
        if (user) {
          // Verifica se o token ainda é válido
          try {
            await user.getIdToken(true); // força refresh do token
            console.log('✅ Token válido, usuário autenticado');
            setCurrentUser(user);
            
            // Carrega perfil de forma não-bloqueante
            loadUserProfile(user.uid).catch(error => 
              console.warn('Perfil carregado em modo fallback:', error.message)
            );
          } catch (tokenError) {
            console.warn('❌ Token inválido ou expirado:', tokenError.message);
            setCurrentUser(null);
            setUserProfile(null);
          }
        } else {
          console.log('👤 Usuário não autenticado');
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Erro no AuthContext:', error);
        setCurrentUser(null);
        setUserProfile(null);
      } finally {
        // CRÍTICO: Só libera após verificação completa
        setLoading(false);
        setAuthChecked(true);
        setInitializing(false);
      }
    });

    // Timeout de segurança mais rígido para evitar flash
    timeoutId = setTimeout(() => {
      if (loading && !authChecked) {
        console.warn('⏰ AuthContext: Timeout atingido - assumindo usuário não logado');
        setLoading(false);
        setAuthChecked(true);
        setInitializing(false);
        // Se não conseguiu verificar em 1.5 segundos, assume não logado por segurança
        setCurrentUser(null);
        setUserProfile(null);
      }
    }, 1500);

    return () => {
      unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const value = {
    currentUser,
    userProfile,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    hasRole,
    hasPermission,
    loading,
    authChecked,
    initializing
  };

  return (
    <AuthContext.Provider value={value}>
      {(loading || initializing) ? (
        <LoadingScreen 
          message="Verificando autenticação..." 
          minimal={false}
        />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
