import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Button, List, ListItem,
  ListItemText, ListItemSecondaryAction, Chip, Paper, Alert, AlertTitle,
} from '@mui/material';
import {
  Add as AddIcon, ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon, Warning as WarningIcon,
  Schedule as PendingIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';
import { useNotifications } from '../../context/NotificationContext';
import { APPLICATION_STATUS, statusConfig } from '../../data/mockApplications';
import { formatRelativeTime } from '../../utils/formatters';

const QuickStatCard = ({ title, value, color, icon }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: `${color}.main` }}>{value}</Typography>
        </Box>
        <Box sx={{ color: `${color}.main`, opacity: 0.7 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications } = useApplications();
  const { notifications, unreadCount } = useNotifications();

  const activeApps = applications.filter(a =>
    [APPLICATION_STATUS.SUBMITTED, APPLICATION_STATUS.UNDER_REVIEW, APPLICATION_STATUS.PENDING_APPROVAL].includes(a.status)
  );
  const needsAction = applications.filter(a => a.status === APPLICATION_STATUS.INFO_REQUESTED);
  const approvedApps = applications.filter(a => a.status === APPLICATION_STATUS.APPROVED);

  const recentNotifications = notifications.slice(0, 3);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom>Welcome back, {user?.firstName || 'Parent'}</Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your childcare assistance applications
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/applications/new')}>
          New Application
        </Button>
      </Box>

      {needsAction.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} action={
          <Button color="inherit" size="small" onClick={() => navigate('/applications')}>View</Button>
        }>
          <AlertTitle>Action Required</AlertTitle>
          You have {needsAction.length} application{needsAction.length > 1 ? 's' : ''} that need additional information.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <QuickStatCard
            title="Active Applications"
            value={activeApps.length}
            color="info"
            icon={<PendingIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <QuickStatCard
            title="Needs Action"
            value={needsAction.length}
            color="warning"
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <QuickStatCard
            title="Approved Benefits"
            value={approvedApps.length}
            color="success"
            icon={<CheckIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Applications</Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/applications')}>
                View All
              </Button>
            </Box>
            {applications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary" gutterBottom>No applications yet</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/applications/new')}>
                  Start Your First Application
                </Button>
              </Box>
            ) : (
              <List>
                {applications.slice(0, 4).map((app) => (
                  <ListItem
                    key={app.id}
                    sx={{ borderBottom: 1, borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    onClick={() => navigate(`/applications/${app.id}`)}
                  >
                    <ListItemText
                      primary={app.id}
                      secondary={`Last updated ${formatRelativeTime(app.lastUpdated || app.submittedAt)}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={statusConfig[app.status]?.label}
                        color={statusConfig[app.status]?.color}
                        size="small"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Notifications
                {unreadCount > 0 && (
                  <Chip label={unreadCount} color="error" size="small" sx={{ ml: 1 }} />
                )}
              </Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/notifications')}>
                View All
              </Button>
            </Box>
            {recentNotifications.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No notifications
              </Typography>
            ) : (
              <List>
                {recentNotifications.map((notif) => (
                  <ListItem key={notif.id} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <ListItemText
                      primary={notif.title}
                      secondary={formatRelativeTime(notif.timestamp)}
                      primaryTypographyProps={{ fontWeight: notif.read ? 400 : 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParentDashboard;
