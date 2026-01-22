import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Button, List, ListItem,
  ListItemText, ListItemSecondaryAction, Chip, Paper, Alert, AlertTitle,
  LinearProgress, Divider,
} from '@mui/material';
import {
  ArrowForward as ArrowIcon, Gavel as ApprovalIcon,
  Groups as TeamIcon, TrendingUp as TrendingIcon,
  Schedule as PendingIcon,
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

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications } = useApplications();

  // Pending approval cases (supervisor queue)
  const pendingApproval = applications.filter(a => a.status === APPLICATION_STATUS.PENDING_APPROVAL);
  const recommendApprove = pendingApproval.filter(a => a.caseworkerRecommendation === 'Approve');
  const recommendReject = pendingApproval.filter(a => a.caseworkerRecommendation === 'Reject');

  // All team cases
  const teamCases = applications.filter(a =>
    [APPLICATION_STATUS.UNDER_REVIEW, APPLICATION_STATUS.INFO_REQUESTED, APPLICATION_STATUS.PENDING_APPROVAL].includes(a.status)
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>Welcome, {user?.firstName || 'Supervisor'}</Typography>
        <Typography variant="body1" color="text.secondary">
          Review and approve cases from your team
        </Typography>
      </Box>

      {pendingApproval.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }} action={
          <Button color="inherit" size="small" onClick={() => navigate('/approvals')}>Review</Button>
        }>
          <AlertTitle>Pending Your Approval</AlertTitle>
          You have {pendingApproval.length} case{pendingApproval.length > 1 ? 's' : ''} waiting for your review.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Approval"
            value={pendingApproval.length}
            color="warning"
            icon={<ApprovalIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Recommend Approve"
            value={recommendApprove.length}
            color="success"
            icon={<TrendingIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Recommend Reject"
            value={recommendReject.length}
            color="error"
            icon={<PendingIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Team Cases"
            value={teamCases.length}
            color="info"
            icon={<TeamIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Cases Pending Approval</Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/approvals')}>
                View All
              </Button>
            </Box>
            {pendingApproval.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No cases pending approval</Typography>
              </Box>
            ) : (
              <List>
                {pendingApproval.slice(0, 5).map((app) => (
                  <ListItem
                    key={app.id}
                    sx={{ borderBottom: 1, borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    onClick={() => navigate(`/approvals/${app.id}`)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {app.id}
                          <Chip
                            label={app.caseworkerRecommendation}
                            color={app.caseworkerRecommendation === 'Approve' ? 'success' : 'error'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          {app.applicant?.firstName} {app.applicant?.lastName} •
                          Submitted: {formatDate(app.submittedAt)}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); navigate(`/approvals/${app.id}`); }}>
                        Review
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Approval Queue</Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Recommend Approve</Typography>
                <Typography variant="body2" color="success.main">{recommendApprove.length}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pendingApproval.length ? (recommendApprove.length / pendingApproval.length) * 100 : 0}
                color="success"
              />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Recommend Reject</Typography>
                <Typography variant="body2" color="error.main">{recommendReject.length}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pendingApproval.length ? (recommendReject.length / pendingApproval.length) * 100 : 0}
                color="error"
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Team Overview</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">County</Typography>
              <Typography variant="body2">{user?.county || 'Franklin'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Active Cases</Typography>
              <Typography variant="body2">{teamCases.length}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Avg. Approval Time</Typography>
              <Typography variant="body2">1.5 days</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Approval Rate</Typography>
              <Typography variant="body2">87%</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupervisorDashboard;
