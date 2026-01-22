import React, { useState } from 'react';
import {
  Box, Paper, Typography, List, ListItem, ListItemText, ListItemIcon,
  ListItemSecondaryAction, IconButton, Chip, Button, Tabs, Tab, Divider,
  Menu, MenuItem,
} from '@mui/material';
import {
  Notifications as NotifIcon, CheckCircle as ReadIcon,
  Delete as DeleteIcon, MoreVert as MoreIcon,
  Info as InfoIcon, Warning as WarningIcon, Error as ErrorIcon,
  CheckCircleOutline as SuccessIcon,
} from '@mui/icons-material';
import { useNotifications } from '../../context/NotificationContext';
import { formatRelativeTime } from '../../utils/formatters';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success': return <SuccessIcon color="success" />;
    case 'warning': return <WarningIcon color="warning" />;
    case 'error': return <ErrorIcon color="error" />;
    default: return <InfoIcon color="info" />;
  }
};

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const handleMenuOpen = (event, notif) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedNotif(notif);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedNotif(null);
  };

  const handleMarkAsRead = () => {
    if (selectedNotif) {
      markAsRead(selectedNotif.id);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedNotif) {
      deleteNotification(selectedNotif.id);
    }
    handleMenuClose();
  };

  const getFilteredNotifications = () => {
    if (tabValue === 1) {
      return notifications.filter(n => !n.read);
    }
    if (tabValue === 2) {
      return notifications.filter(n => n.read);
    }
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button variant="outlined" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </Box>

      <Paper>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`All (${notifications.length})`} />
          <Tab label={`Unread (${unreadCount})`} />
          <Tab label={`Read (${notifications.length - unreadCount})`} />
        </Tabs>

        {filteredNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotifIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        ) : (
          <List>
            {filteredNotifications.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <ListItem
                  sx={{
                    bgcolor: notif.read ? 'transparent' : 'action.hover',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notif.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: notif.read ? 400 : 600 }}
                        >
                          {notif.title}
                        </Typography>
                        {!notif.read && (
                          <Chip label="New" color="primary" size="small" />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatRelativeTime(notif.timestamp)}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={(e) => handleMenuOpen(e, notif)}>
                      <MoreIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        {selectedNotif && !selectedNotif.read && (
          <MenuItem onClick={handleMarkAsRead}>
            <ReadIcon sx={{ mr: 1 }} /> Mark as Read
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Notifications;
