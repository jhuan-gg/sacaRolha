import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

/**
 * AuthManager - Gerencia sessão, tokens e persistência de autenticação
 * Verifica tokens válidos e gerencia estado de autenticação
 */
class AuthManager {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.isChecking = true;
    this.callbacks = [];
  }

  // Adiciona callback para mudanças de estado
  onAuthStateChange(callback) {
    this.callbacks.push(callback);
    // Chama imediatamente com estado atual se já verificou
    if (!this.isChecking) {
      callback(this.user, this.isAuthenticated);
    }
  }

  // Remove callback
  removeAuthStateListener(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  // Notifica todos os callbacks
  notifyListeners() {
    this.callbacks.forEach(callback => {
      callback(this.user, this.isAuthenticated);
    });
  }

  // Inicia verificação de autenticação
  async initialize() {
    console.log('🔐 AuthManager: Iniciando verificação de autenticação...');
    
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // Verifica se o token ainda é válido
            console.log('👤 AuthManager: Usuário encontrado, verificando token...');
            
            try {
              const token = await firebaseUser.getIdToken(true); // força refresh
              const tokenResult = await firebaseUser.getIdTokenResult();
              
              // Verifica se o token não expirou
              const now = new Date().getTime();
              const expTime = new Date(tokenResult.expirationTime).getTime();
              
              if (expTime > now) {
                console.log('✅ AuthManager: Token válido, usuário autenticado');
                this.user = firebaseUser;
                this.isAuthenticated = true;
              } else {
                console.log('⚠️ AuthManager: Token expirado');
                this.user = null;
                this.isAuthenticated = false;
                // Força logout se token expirado
                await auth.signOut();
              }
            } catch (tokenError) {
              console.log('❌ AuthManager: Erro ao validar token:', tokenError.message);
              this.user = null;
              this.isAuthenticated = false;
            }
          } else {
            console.log('👤 AuthManager: Nenhum usuário autenticado');
            this.user = null;
            this.isAuthenticated = false;
          }
        } catch (error) {
          console.error('🚨 AuthManager: Erro na verificação:', error);
          this.user = null;
          this.isAuthenticated = false;
        } finally {
          this.isChecking = false;
          this.notifyListeners();
          resolve();
          unsubscribe();
        }
      });

      // Timeout de segurança
      setTimeout(() => {
        if (this.isChecking) {
          console.warn('⏰ AuthManager: Timeout - assumindo não autenticado');
          this.user = null;
          this.isAuthenticated = false;
          this.isChecking = false;
          this.notifyListeners();
          resolve();
          unsubscribe();
        }
      }, 3000);
    });
  }

  // Verifica se existe sessão persistente válida
  hasValidSession() {
    if (!this.user) return false;
    
    // Verifica localStorage/sessionStorage para sessão persistente
    try {
      const userData = localStorage.getItem('firebase:authUser:' + auth.app.options.apiKey + ':[DEFAULT]');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        // Verifica se não expirou (simples verificação)
        const lastSignIn = new Date(parsedUser.lastLoginAt || parsedUser.createdAt);
        const now = new Date();
        const diffHours = (now - lastSignIn) / (1000 * 60 * 60);
        
        // Se passou mais de 24 horas, considera expirado
        if (diffHours > 24) {
          console.log('⚠️ AuthManager: Sessão persistente expirada');
          return false;
        }
        
        console.log('✅ AuthManager: Sessão persistente válida');
        return true;
      }
    } catch (error) {
      console.warn('⚠️ AuthManager: Erro ao verificar sessão persistente:', error);
    }
    
    return false;
  }

  // Limpa sessão
  clearSession() {
    this.user = null;
    this.isAuthenticated = false;
    // Limpa dados persistentes
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('firebase:')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Erro ao limpar sessão:', error);
    }
  }
}

// Singleton
const authManager = new AuthManager();
export default authManager;
