import { Routes, Route, Navigate } from "react-router-dom";
import Login from '../pages/Login';
import Home from '../pages/Home';
import Listagem from '../pages/Listagem';
import Cadastrar from '../pages/Cadastrar';
import CadastrarSimple from '../pages/CadastrarSimple';
import Visualizar from '../pages/Visualizar';
import Configuracoes from '../pages/Configuracoes';
import NotFound from '../pages/NotFound';
import ServerError from '../pages/ServerError';
import Unauthorized from '../pages/Unauthorized';
import MainLayout from '../layout/MainLayout';
import UltraSecureRoute from '../common/UltraSecureRoute';
import NavigationGuard from '../common/NavigationGuard';
import PageTransition from '../common/PageTransition';

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
      <PageTransition>
        <Routes>
        {/* Rota principal redireciona para login (tela primária) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login sem layout - TELA PRIMÁRIA */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas com layout e verificação ULTRA-SEGURA */}
        <Route path="/home" element={
          <UltraSecureRoute>
            <LayoutRoute><Home /></LayoutRoute>
          </UltraSecureRoute>
        } />
        <Route path="/listagem" element={
          <UltraSecureRoute>
            <LayoutRoute><Listagem /></LayoutRoute>
          </UltraSecureRoute>
        } />
        <Route path="/cadastrar" element={
          <UltraSecureRoute>
            <LayoutRoute><Cadastrar /></LayoutRoute>
          </UltraSecureRoute>
        } />
        <Route path="/visualizar" element={
          <UltraSecureRoute>
            <LayoutRoute><Visualizar /></LayoutRoute>
          </UltraSecureRoute>
        } />
        <Route path="/configuracoes" element={
          <UltraSecureRoute>
            <LayoutRoute><Configuracoes /></LayoutRoute>
          </UltraSecureRoute>
        } />
        
        {/* Páginas de erro */}
        <Route path="/error/500" element={<ServerError />} />
        <Route path="/error/403" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </NavigationGuard>
  );
}

export default AppRoutes;