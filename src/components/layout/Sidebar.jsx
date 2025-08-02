import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  List as ListIcon,
  PersonAdd as PersonAddIcon,
  LocalBar as WineIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: theme.palette.common.white,
    border: 'none',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  }
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  minHeight: 80,
  borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
  marginBottom: theme.spacing(1)
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 12,
  margin: theme.spacing(0.5, 2),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(8px)'
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)'
    }
  }
}));

const UserSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
  marginBottom: theme.spacing(1)
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: theme.palette.common.white,
  fontWeight: 'bold',
  fontSize: '1.2rem'
}));

const MenuOverlay = styled(Box)(({ theme, open }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: theme.zIndex.drawer - 1,
  opacity: open ? 1 : 0,
  visibility: open ? 'visible' : 'hidden',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('md')]: {
    display: 'none'
  }
}));

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/home'
  },
  {
    text: 'Listagem de Vinhos',
    icon: <ListIcon />,
    path: '/listagem'
  },
  {
    text: 'Cadastrar Vinho',
    icon: <PersonAddIcon />,
    path: '/cadastrar'
  },
  {
    text: 'Configurações',
    icon: <SettingsIcon />,
    path: '/configuracoes'
  }
];

function Sidebar({ open, onClose, permanent = false }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleItemClick = (path) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    // Em produção, faria logout real
    navigate('/login');
    if (isMobile && onClose) {
      onClose();
    }
  };

  const isItemSelected = (path) => {
    if (path === '/home' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <DrawerHeader>
        <WineIcon sx={{ fontSize: 32, mr: 2 }} />
        <Box flex={1}>
          <Typography variant="h6" fontWeight="bold">
            SacaRolha
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Cadastro de Vinhos
          </Typography>
        </Box>
        {isMobile && (
          <IconButton
            onClick={onClose}
            sx={{ color: 'white', ml: 1 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DrawerHeader>

      {/* User Section */}
      <UserSection>
        <Box display="flex" alignItems="center" mb={1}>
          <UserAvatar>JS</UserAvatar>
          <Box ml={2} flex={1}>
            <Typography variant="subtitle1" fontWeight="medium">
              João Silva
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Administrador
            </Typography>
          </Box>
        </Box>
        <Chip
          label="Online"
          size="small"
          sx={{
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            color: '#4CAF50',
            border: '1px solid #4CAF50'
          }}
        />
      </UserSection>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton
              selected={isItemSelected(item.path)}
              onClick={() => handleItemClick(item.path)}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: isItemSelected(item.path) ? 'bold' : 'medium'
                  }
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
        <StyledListItemButton onClick={handleLogout}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </StyledListItemButton>
      </Box>
    </Box>
  );

  if (permanent) {
    return (
      <StyledDrawer variant="permanent" open>
        {drawerContent}
      </StyledDrawer>
    );
  }

  return (
    <>
      <MenuOverlay open={open} onClick={onClose} />
      <StyledDrawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true // Better mobile performance
        }}
      >
        {drawerContent}
      </StyledDrawer>
    </>
  );
}

export default Sidebar;
