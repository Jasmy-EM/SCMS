import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Button, Paper,
  LinearProgress, Divider,
} from '@mui/material';
import {
  ArrowForward as ArrowIcon, TrendingUp as TrendingIcon,
  Assessment as ReportsIcon, People as PeopleIcon,
  CheckCircle as ApprovedIcon, Schedule as PendingIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';
import { APPLICATION_STATUS } from '../../data/mockApplications';

const StatCard = ({ title, value, subtitle, color, icon, trend }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: `${color}.main` }}>{value}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
          {trend && (
            <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </Typography>
          )}
        </Box>
        <Box sx={{ color: `${color}.main`, opacity: 0.7 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications } = useApplications();

  const totalApplications = applications.length;
  const approvedApps = applications.filter(a => a.status === APPLICATION_STATUS.APPROVED).length;
  const pendingApps = applications.filter(a =>
    [APPLICATION_STATUS.SUBMITTED, APPLICATION_STATUS.UNDER_REVIEW, APPLICATION_STATUS.PENDING_APPROVAL].includes(a.status)
  ).length;
  const rejectedApps = applications.filter(a => a.status === APPLICATION_STATUS.REJECTED).length;

  const approvalRate = totalApplications > 0 ? Math.round((approvedApps / (approvedApps + rejectedApps)) * 100) || 0 : 0;

  // Mock metrics
  const metrics = {
    avgProcessingTime: 4.2,
    slaCompliance: 92,
    caseloadPerWorker: 24,
    childrenServed: 156,
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>Program Dashboard</Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of childcare assistance program performance
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Applications"
            value={totalApplications}
            color="primary"
            icon={<ReportsIcon sx={{ fontSize: 40 }} />}
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Approved"
            value={approvedApps}
            color="success"
            icon={<ApprovedIcon sx={{ fontSize: 40 }} />}
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={pendingApps}
            color="warning"
            icon={<PendingIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Approval Rate"
            value={`${approvalRate}%`}
            color="info"
            icon={<TrendingIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Performance Metrics</Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/reports')}>
                View Reports
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">SLA Compliance</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{metrics.slaCompliance}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.slaCompliance}
                    color={metrics.slaCompliance >= 90 ? 'success' : metrics.slaCompliance >= 75 ? 'warning' : 'error'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Target: 95%</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Avg. Processing Time</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{metrics.avgProcessingTime} days</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((7 - metrics.avgProcessingTime) / 7 * 100, 100)}
                    color="info"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Target: 7 days</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>Monthly Trends (Mock Data)</Typography>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 2 }}>
              {['Oct', 'Nov', 'Dec', 'Jan'].map((month, idx) => (
                <Box key={month} sx={{ textAlign: 'center', minWidth: 80 }}>
                  <Box
                    sx={{
                      height: [60, 75, 90, 100][idx],
                      width: 40,
                      bgcolor: 'primary.main',
                      borderRadius: 1,
                      mx: 'auto',
                      mb: 1,
                    }}
                  />
                  <Typography variant="caption">{month}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Stats</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Children Served</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{metrics.childrenServed}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Active Providers</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>42</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Caseworkers</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>8</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Avg. Caseload</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{metrics.caseloadPerWorker} cases</Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Status Distribution</Typography>
            <Divider sx={{ mb: 2 }} />
            {[
              { label: 'Approved', count: approvedApps, color: 'success.main' },
              { label: 'Pending Review', count: pendingApps, color: 'warning.main' },
              { label: 'Rejected', count: rejectedApps, color: 'error.main' },
            ].map((item) => (
              <Box key={item.label} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{item.label}</Typography>
                  <Typography variant="body2">{item.count}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalApplications > 0 ? (item.count / totalApplications) * 100 : 0}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': { bgcolor: item.color },
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;
