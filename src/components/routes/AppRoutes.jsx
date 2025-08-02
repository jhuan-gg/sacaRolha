import { Routes, Route, Navigate } from "react-router-dom";
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
import SecureRoute from '../common/SecureRoute';
import NavigationGuard from '../common/NavigationGuard';

// Componente para rotas que precisam do layout principal
function LayoutRoute({ children }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}

function AppRoutes() {
  return (
    <NavigationGuard>
      <Routes>
        {/* Rota principal redireciona para login (tela primária) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login sem layout - TELA PRIMÁRIA */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas com layout e verificação de segurança */}
        <Route path="/home" element={
          <SecureRoute>
            <LayoutRoute><Home /></LayoutRoute>
          </SecureRoute>
        } />
        <Route path="/listagem" element={
          <SecureRoute>
            <LayoutRoute><Listagem /></LayoutRoute>
          </SecureRoute>
        } />
        <Route path="/cadastrar" element={
          <SecureRoute>
            <LayoutRoute><Cadastrar /></LayoutRoute>
          </SecureRoute>
        } />
        <Route path="/visualizar" element={
          <SecureRoute>
            <LayoutRoute><Visualizar /></LayoutRoute>
          </SecureRoute>
        } />
        <Route path="/configuracoes" element={
          <SecureRoute>
            <LayoutRoute><Configuracoes /></LayoutRoute>
          </SecureRoute>
        } />
        
        {/* Páginas de erro */}
        <Route path="/error/500" element={<ServerError />} />
        <Route path="/error/403" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </NavigationGuard>
  );
}

export default AppRoutes;