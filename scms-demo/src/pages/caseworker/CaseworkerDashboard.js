import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Button, List, ListItem,
  ListItemText, ListItemSecondaryAction, Chip, Paper, Alert, AlertTitle,
  LinearProgress, Divider,
} from '@mui/material';
import {
  ArrowForward as ArrowIcon, Warning as WarningIcon,
  Schedule as PendingIcon, AssignmentTurnedIn as CompletedIcon,
  Assignment as CaseIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';
import { APPLICATION_STATUS, statusConfig } from '../../data/mockApplications';
import { formatRelativeTime, formatDate } from '../../utils/formatters';

const StatCard = ({ title, value, subtitle, color, icon }) => (
  <Card>
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

const CaseworkerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications } = useApplications();

  // Filter cases assigned to this caseworker
  const myCases = applications.filter(a => a.assignedCaseworker === user?.id);
  const pendingReview = myCases.filter(a => a.status === APPLICATION_STATUS.UNDER_REVIEW);
  const infoRequested = myCases.filter(a => a.status === APPLICATION_STATUS.INFO_REQUESTED);
  const pendingApproval = myCases.filter(a => a.status === APPLICATION_STATUS.PENDING_APPROVAL);

  // Cases due soon (within 2 days)
  const dueSoon = myCases.filter(a => {
    if (!a.slaDueDate) return false;
    const dueDate = new Date(a.slaDueDate);
    const now = new Date();
    const diffDays = (dueDate - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 2;
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>Welcome, {user?.firstName || 'Caseworker'}</Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your case workload summary for today
        </Typography>
      </Box>

      {dueSoon.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} action={
          <Button color="inherit" size="small" onClick={() => navigate('/cases')}>View</Button>
        }>
          <AlertTitle>Cases Due Soon</AlertTitle>
          You have {dueSoon.length} case{dueSoon.length > 1 ? 's' : ''} with SLA deadlines in the next 2 days.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Assigned"
            value={myCases.length}
            color="primary"
            icon={<CaseIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Review"
            value={pendingReview.length}
            color="warning"
            icon={<PendingIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Awaiting Info"
            value={infoRequested.length}
            color="info"
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sent for Approval"
            value={pendingApproval.length}
            color="success"
            icon={<CompletedIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Cases Requiring Action</Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/cases')}>
                View All Cases
              </Button>
            </Box>
            {pendingReview.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No cases pending review</Typography>
              </Box>
            ) : (
              <List>
                {pendingReview.slice(0, 5).map((app) => (
                  <ListItem
                    key={app.id}
                    sx={{ borderBottom: 1, borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    onClick={() => navigate(`/cases/${app.id}`)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {app.id}
                          {app.slaDueDate && new Date(app.slaDueDate) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) && (
                            <Chip label="Due Soon" color="warning" size="small" />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          {app.applicant?.firstName} {app.applicant?.lastName} •
                          SLA Due: {app.slaDueDate ? formatDate(app.slaDueDate) : 'N/A'}
                        </>
                      }
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

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Workload Distribution</Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Under Review</Typography>
                <Typography variant="body2">{pendingReview.length}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={myCases.length ? (pendingReview.length / myCases.length) * 100 : 0}
                color="warning"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Info Requested</Typography>
                <Typography variant="body2">{infoRequested.length}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={myCases.length ? (infoRequested.length / myCases.length) * 100 : 0}
                color="info"
              />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Pending Approval</Typography>
                <Typography variant="body2">{pendingApproval.length}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={myCases.length ? (pendingApproval.length / myCases.length) * 100 : 0}
                color="success"
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Stats</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">County</Typography>
              <Typography variant="body2">{user?.county || 'Franklin'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Cases This Month</Typography>
              <Typography variant="body2">{myCases.length}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Avg. Processing Time</Typography>
              <Typography variant="body2">3.2 days</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseworkerDashboard;
