import { Navigate, useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Listagem from '../pages/Listagem';
import Cadastrar from '../pages/Cadastrar';
import Visualizar from '../pages/Visualizar';
import Configuracoes from '../pages/Configuracoes';
import NotFound from '../pages/NotFound';
import ServerError from '../pages/ServerError';
import Unauthorized from '../pages/Unauthorized';
import MainLayout from '../layout/MainLayout';

/**
 * Router ultra-seguro que decide IMEDIATAMENTE o que renderizar
 * baseado no estado de autenticação VERIFICADO
 */
function SecureRouter({ user, isAuthenticated }) {
  const location = useLocation();
  
  // Lista de rotas protegidas
  const protectedRoutes = ['/home', '/listagem', '/cadastrar', '/visualizar', '/configuracoes'];
  const currentPath = location.pathname;

  console.log(`🛡️ SecureRouter: Rota ${currentPath}, Autenticado: ${isAuthenticated}`);

  // Se NÃO está autenticado e tenta acessar rota protegida
  if (!isAuthenticated && protectedRoutes.includes(currentPath)) {
    console.log('🚫 SecureRouter: BLOQUEANDO acesso não autorizado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Se ESTÁ autenticado e tenta acessar login
  if (isAuthenticated && currentPath === '/login') {
    console.log('🏠 SecureRouter: Usuário logado, redirecionando para home');
    return <Navigate to="/home" replace />;
  }

  // Se está na raiz, redireciona baseado na autenticação
  if (currentPath === '/') {
    const redirectTo = isAuthenticated ? '/home' : '/login';
    console.log(`🔄 SecureRouter: Raiz redirecionando para ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Routes>
      {/* Login - apenas para não autenticados */}
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
      
      {/* Rotas protegidas - apenas para autenticados */}
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
      
      {/* Páginas de erro - sempre acessíveis */}
      <Route path="/error/500" element={<ServerError />} />
      <Route path="/error/403" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default SecureRouter;
