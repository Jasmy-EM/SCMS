import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, Box, Divider, useTheme, useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon, Description as ApplicationIcon,
  Search as SearchIcon, Notifications as NotificationsIcon,
  Settings as SettingsIcon, Assessment as ReportsIcon,
  Folder as CasesIcon, RateReview as ReviewIcon,
  Business as ProvidersIcon, People as UsersIcon,
  Tune as ConfigIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockUsers';

const getMenuItems = (role) => {
  const common = [
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  ];

  switch (role) {
    case ROLES.PARENT:
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'My Applications', icon: <ApplicationIcon />, path: '/applications' },
        { text: 'Find Providers', icon: <SearchIcon />, path: '/providers' },
        ...common,
      ];
    case ROLES.CASEWORKER:
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'My Cases', icon: <CasesIcon />, path: '/cases' },
        { text: 'Provider Directory', icon: <ProvidersIcon />, path: '/providers' },
        ...common,
      ];
    case ROLES.SUPERVISOR:
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Pending Approvals', icon: <ReviewIcon />, path: '/approvals' },
        { text: 'Team Cases', icon: <CasesIcon />, path: '/team-cases' },
        { text: 'Provider Directory', icon: <ProvidersIcon />, path: '/providers' },
        ...common,
      ];
    case ROLES.MANAGER:
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
        { text: 'Provider Management', icon: <ProvidersIcon />, path: '/providers' },
        ...common,
      ];
    case ROLES.ADMIN:
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'User Management', icon: <UsersIcon />, path: '/users' },
        { text: 'Provider Management', icon: <ProvidersIcon />, path: '/providers' },
        { text: 'System Settings', icon: <ConfigIcon />, path: '/settings' },
        { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
        ...common,
      ];
    default:
      return common;
  }
};

const Sidebar = ({ drawerWidth, mobileOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useAuth();

  const menuItems = getMenuItems(currentRole);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src="/logo192.png"
            alt="SCMS Logo"
            sx={{ width: 32, height: 32, display: { xs: 'none', md: 'block' } }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: 'primary.main' }}>
            SCMS
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.text}>
            {index > 0 && item.text === 'Notifications' && <Divider sx={{ my: 1 }} />}
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                    '&:hover': { backgroundColor: 'primary.main' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
