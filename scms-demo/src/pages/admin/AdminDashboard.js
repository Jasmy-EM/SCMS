import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Button, Paper,
  List, ListItem, ListItemText, ListItemIcon, Chip, Divider,
} from '@mui/material';
import {
  ArrowForward as ArrowIcon, People as UsersIcon,
  Business as ProvidersIcon, Settings as SettingsIcon,
  Assessment as ReportsIcon, Security as SecurityIcon,
  CheckCircle as CheckIcon, Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { mockProviders } from '../../data/mockProviders';
import { systemSettings, featureFlags } from '../../data/mockConfig';

const StatCard = ({ title, value, subtitle, color, icon, onClick }) => (
  <Card sx={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: `${color}.main` }}>{value}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
        <Box sx={{ color: `${color}.main`, opacity: 0.7 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock system stats
  const systemStats = {
    totalUsers: 156,
    activeProviders: mockProviders.filter(p => p.status === 'Active').length,
    pendingProviders: mockProviders.filter(p => p.status === 'Pending').length,
    systemUptime: '99.9%',
  };

  const recentActivities = [
    { action: 'Provider "Sunshine Daycare" license renewed', time: '2 hours ago', type: 'success' },
    { action: 'New caseworker account created', time: '5 hours ago', type: 'info' },
    { action: 'System settings updated', time: '1 day ago', type: 'warning' },
    { action: 'Provider "ABC Learning" flagged for review', time: '2 days ago', type: 'warning' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>System Administration</Typography>
        <Typography variant="body1" color="text.secondary">
          Manage users, providers, and system settings
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={systemStats.totalUsers}
            color="primary"
            icon={<UsersIcon sx={{ fontSize: 40 }} />}
            onClick={() => navigate('/users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Providers"
            value={systemStats.activeProviders}
            color="success"
            icon={<ProvidersIcon sx={{ fontSize: 40 }} />}
            onClick={() => navigate('/providers')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Providers"
            value={systemStats.pendingProviders}
            color="warning"
            icon={<ProvidersIcon sx={{ fontSize: 40 }} />}
            onClick={() => navigate('/providers')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Uptime"
            value={systemStats.systemUptime}
            color="info"
            icon={<SecurityIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Quick Actions</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<UsersIcon />}
                  onClick={() => navigate('/users')}
                  sx={{ py: 2 }}
                >
                  Manage Users
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ProvidersIcon />}
                  onClick={() => navigate('/providers')}
                  sx={{ py: 2 }}
                >
                  Manage Providers
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<SettingsIcon />}
                  onClick={() => navigate('/settings')}
                  sx={{ py: 2 }}
                >
                  System Settings
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ReportsIcon />}
                  onClick={() => navigate('/reports')}
                  sx={{ py: 2 }}
                >
                  View Reports
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Feature Flags</Typography>
            <List>
              {Object.entries(featureFlags).map(([key, value]) => (
                <ListItem key={key} sx={{ py: 1 }}>
                  <ListItemIcon>
                    {value ? <CheckIcon color="success" /> : <WarningIcon color="warning" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  />
                  <Chip
                    label={value ? 'Enabled' : 'Disabled'}
                    color={value ? 'success' : 'default'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Activity</Typography>
            </Box>
            <List>
              {recentActivities.map((activity, index) => (
                <ListItem key={index} sx={{ borderBottom: index < recentActivities.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                  <ListItemText
                    primary={activity.action}
                    secondary={activity.time}
                  />
                  <Chip
                    label={activity.type}
                    color={activity.type === 'success' ? 'success' : activity.type === 'warning' ? 'warning' : 'info'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>System Configuration</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">SLA Processing Days</Typography>
              <Typography variant="body2">{systemSettings.slaProcessingDays} days</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Max File Upload Size</Typography>
              <Typography variant="body2">{systemSettings.maxFileUploadSize}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Session Timeout</Typography>
              <Typography variant="body2">{systemSettings.sessionTimeout}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Maintenance Mode</Typography>
              <Chip
                label={systemSettings.maintenanceMode ? 'On' : 'Off'}
                color={systemSettings.maintenanceMode ? 'error' : 'success'}
                size="small"
              />
            </Box>
            <Button
              variant="text"
              endIcon={<ArrowIcon />}
              onClick={() => navigate('/settings')}
              sx={{ mt: 2 }}
            >
              View All Settings
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
