import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingScreen from './components/common/LoadingScreen'
import authManager from './utils/AuthManager'

// Importações das páginas
import Login from './components/pages/Login'
import Home from './components/pages/Home'
import Listagem from './components/pages/Listagem'
import Cadastrar from './components/pages/Cadastrar'
import Visualizar from './components/pages/Visualizar'
import Configuracoes from './components/pages/Configuracoes'
import NotFound from './components/pages/NotFound'
import ServerError from './components/pages/ServerError'
import Unauthorized from './components/pages/Unauthorized'
import MainLayout from './components/layout/MainLayout'
import { AuthProvider } from './contexts/AuthContextSimplified'

/**
 * App principal com verificação ultra-segura
 * LOGIN é a rota PRINCIPAL - sem vulnerabilidades
 */
function App() {
  const [authState, setAuthState] = useState('CHECKING'); // CHECKING, AUTHENTICATED, UNAUTHENTICATED
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('🚀 App: Iniciando aplicação...');
    
    const initializeAuth = async () => {
      // Primeiro verifica se há sessão persistente válida
      if (authManager.hasValidSession()) {
        console.log('💾 App: Sessão persistente encontrada, validando...');
      }
      
      // Inicializa verificação completa
      await authManager.initialize();
    };

    // Listener para mudanças de autenticação
    const handleAuthChange = (firebaseUser, isAuthenticated) => {
      console.log(`🔐 App: Estado de auth mudou - ${isAuthenticated ? 'AUTENTICADO' : 'NÃO AUTENTICADO'}`);
      
      setUser(firebaseUser);
      setAuthState(isAuthenticated ? 'AUTHENTICATED' : 'UNAUTHENTICATED');
    };

    authManager.onAuthStateChange(handleAuthChange);
    initializeAuth();

    return () => {
      authManager.removeAuthStateListener(handleAuthChange);
    };
  }, []);

  // BLOQUEIO TOTAL - não renderiza NADA até verificar
  if (authState === 'CHECKING') {
    console.log('⏳ App: Verificando autenticação...');
    return <LoadingScreen message="Verificando acesso..." />;
  }

  const isAuthenticated = authState === 'AUTHENTICATED';
  console.log(`🎯 App: Renderizando com estado ${authState}`);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ROTA PRINCIPAL: LOGIN */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* LOGIN - Rota principal para não autenticados */}
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <Login />
                ) : (
                  <Navigate to="/home" replace />
                )
              } 
            />
            
            {/* ROTAS PROTEGIDAS - apenas para autenticados */}
            <Route 
              path="/home" 
              element={
                isAuthenticated ? (
                  <MainLayout><Home /></MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/listagem" 
              element={
                isAuthenticated ? (
                  <MainLayout><Listagem /></MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/cadastrar" 
              element={
                isAuthenticated ? (
                  <MainLayout><Cadastrar /></MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/visualizar" 
              element={
                isAuthenticated ? (
                  <MainLayout><Visualizar /></MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/configuracoes" 
              element={
                isAuthenticated ? (
                  <MainLayout><Configuracoes /></MainLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* PÁGINAS DE ERRO - sempre acessíveis */}
            <Route path="/error/500" element={<ServerError />} />
            <Route path="/error/403" element={<Unauthorized />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
