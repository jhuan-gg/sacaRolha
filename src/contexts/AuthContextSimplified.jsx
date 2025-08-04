import React, { createContext, useContext, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

/**
 * AuthContext SIMPLIFICADO - apenas funções de autenticação
 * A verificação de estado fica no AuthGuard para evitar conflitos
 */
const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);

  // Login com email e senha
  const login = async (email, password) => {
    try {
      console.log('🔑 AuthContext: Iniciando processo de login...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ AuthContext: Login realizado com sucesso');
      
      // Carrega perfil após login bem-sucedido
      await loadUserProfile(userCredential.user.uid);
      
      return userCredential;
    } catch (error) {
      console.error('❌ AuthContext: Erro ao fazer login:', error);
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
        role: 'member',
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
      console.log('👋 AuthContext: Logout realizado');
    } catch (error) {
      console.error('❌ AuthContext: Erro no logout:', error);
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
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        const profile = { uid, ...docSnap.data() };
        setUserProfile(profile);
        return profile;
      } else {
        // Criar perfil padrão se não existir
        const defaultProfile = {
          uid,
          displayName: auth.currentUser?.displayName || null,
          email: auth.currentUser?.email || '',
          createdAt: new Date(),
          role: 'member'
        };
        setUserProfile(defaultProfile);
        return defaultProfile;
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      return null;
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

  const value = {
    userProfile,
    login,
    signup,
    logout,
    resetPassword,
    loadUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
