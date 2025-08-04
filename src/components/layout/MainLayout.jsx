import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Sidebar from './Sidebar';
import useLogout from '../../hooks/useLogout';
import useCurrentUser from '../../hooks/useCurrentUser';

const drawerWidth = 280;

const StyledAppBar = styled(AppBar)(({ theme, open }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up('md')]: {
    width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
    marginLeft: open ? drawerWidth : 0,
  }
}));

const Main = styled('main')(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? drawerWidth : 0,
    width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
  }
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: theme.palette.common.white,
  fontSize: '0.9rem',
  fontWeight: 'bold'
}));

function MainLayout({ children }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const logout = useLogout();
  const currentUser = useCurrentUser();
  
  // Sidebar sempre aberto em desktop, controlado pelo usuário em mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Controla apenas o menu mobile
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleProfileMenuClose();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/listagem':
        return 'Listagem de Vinhos';
      case '/cadastrar':
        return location.search.includes('edit') ? 'Editar Vinho' : 'Cadastrar Vinho';
      case '/visualizar':
        return 'Detalhes do Vinho';
      case '/configuracoes':
        return 'Configurações';
      case '/home':
      case '/':
        return 'Dashboard';
      default:
        return 'SacaRolha';
    }
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <StyledAppBar position="fixed" open={!isMobile}>
        <Toolbar>
          {/* Ícone de menu APENAS em dispositivos móveis */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="toggle mobile menu"
              onClick={handleMobileMenuToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            {getPageTitle()}
          </Typography>

          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <UserAvatar>
              {currentUser?.displayName 
                ? currentUser.displayName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)
                : currentUser?.email?.slice(0, 2).toUpperCase() || 'U'
              }
            </UserAvatar>
          </IconButton>
        </Toolbar>
      </StyledAppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id="primary-search-account-menu"
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 1,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {currentUser?.displayName || 'Usuário'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentUser?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfileMenuClose}>
          <AccountCircleIcon sx={{ mr: 2 }} />
          Meu Perfil
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <SettingsIcon sx={{ mr: 2 }} />
          Configurações
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 2 }} />
          Sair
        </MenuItem>
      </Menu>

      {/* Sidebar */}
      <Sidebar
        open={isMobile ? mobileMenuOpen : true}
        onClose={() => setMobileMenuOpen(false)}
        permanent={!isMobile}
      />

      {/* Main Content */}
      <Main open={!isMobile}>
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </Box>
      </Main>
    </Box>
  );
}

export default MainLayout;
