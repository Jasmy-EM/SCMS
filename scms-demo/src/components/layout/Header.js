import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Box, Select, FormControl,
  Divider, ListItemIcon, ListItemText, Chip, useMediaQuery, useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon, Notifications as NotificationsIcon, FamilyRestroom as FamilyIcon,
  Work as WorkIcon, SupervisorAccount as SupervisorIcon, Assessment as ManagerIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ROLES, roleLabels } from '../../data/mockUsers';

const roleIcons = {
  [ROLES.PARENT]: <FamilyIcon />,
  [ROLES.CASEWORKER]: <WorkIcon />,
  [ROLES.SUPERVISOR]: <SupervisorIcon />,
  [ROLES.MANAGER]: <ManagerIcon />,
  [ROLES.ADMIN]: <AdminIcon />,
};

const Header = ({ drawerWidth, onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { currentRole, switchRole } = useAuth();
  const { unreadCount } = useNotifications();
  const [notifAnchor, setNotifAnchor] = useState(null);

  const handleRoleChange = (event) => {
    switchRole(event.target.value);
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` } }}>
      <Toolbar>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h6" noWrap>SCMS</Typography>
          {!isMobile && <Typography variant="body2" sx={{ ml: 1, opacity: 0.8 }}>State Childcare Management System</Typography>}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip label="DEMO" size="small" sx={{ backgroundColor: 'warning.main', color: 'warning.contrastText', fontWeight: 600 }} />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={currentRole}
              onChange={handleRoleChange}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                '.MuiSvgIcon-root': { color: 'white' },
              }}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {roleIcons[value]}
                  <span>{roleLabels[value]}</span>
                </Box>
              )}
            >
              {Object.entries(roleLabels).map(([role, label]) => (
                <MenuItem key={role} value={role}>
                  <ListItemIcon>{roleIcons[role]}</ListItemIcon>
                  <ListItemText>{label}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton color="inherit" onClick={(e) => setNotifAnchor(e.currentTarget)}>
            <Badge badgeContent={unreadCount} color="error"><NotificationsIcon /></Badge>
          </IconButton>
          <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)} PaperProps={{ sx: { width: 320 } }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}><Typography variant="h6">Notifications</Typography></Box>
            <MenuItem onClick={() => { setNotifAnchor(null); navigate('/notifications'); }}>
              <Typography variant="body2">You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { setNotifAnchor(null); navigate('/notifications'); }}>
              <Typography variant="body2" color="primary">View All Notifications</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
