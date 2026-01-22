import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Grid, Chip, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Alert, AlertTitle, List, ListItem, ListItemText, Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon, CheckCircle as ApproveIcon, Cancel as RejectIcon,
  Check as CheckIcon, Close as CloseIcon,
} from '@mui/icons-material';
import { useApplications } from '../../context/ApplicationContext';
import { APPLICATION_STATUS, statusConfig } from '../../data/mockApplications';
import { formatDate, formatDateTime, formatCurrency } from '../../utils/formatters';
import { eligibilityConfig } from '../../data/mockConfig';

const EligibilityItem = ({ label, met, detail }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {met ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
      <Typography>{label}</Typography>
    </Box>
    <Typography variant="body2" color="text.secondary">{detail}</Typography>
  </Box>
);

const ApprovalReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getApplication, updateApplicationStatus } = useApplications();
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [overrideReason, setOverrideReason] = useState('');

  const application = getApplication(id);

  if (!application) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" gutterBottom>Case Not Found</Typography>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/approvals')}>
          Back to Approvals
        </Button>
      </Box>
    );
  }

  const isRecommendApprove = application.caseworkerRecommendation === 'Approve';
  const eligibility = application.eligibility || {};

  const handleAction = (type) => {
    setActionType(type);
    setShowActionDialog(true);
  };

  const handleConfirmAction = () => {
    const newStatus = actionType === 'approve' ? APPLICATION_STATUS.APPROVED : APPLICATION_STATUS.REJECTED;
    const additionalData = {
      approvedAt: actionType === 'approve' ? new Date().toISOString() : undefined,
      rejectedAt: actionType === 'reject' ? new Date().toISOString() : undefined,
    };

    if (overrideReason) {
      additionalData.supervisorOverrideReason = overrideReason;
    }

    updateApplicationStatus(id, newStatus, additionalData);
    setShowActionDialog(false);
    navigate('/approvals');
  };

  const isOverride = (actionType === 'approve' && !isRecommendApprove) || (actionType === 'reject' && isRecommendApprove);

  return (
    <Box>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/approvals')} sx={{ mb: 2 }}>
        Back to Approvals
      </Button>

      <Alert
        severity={isRecommendApprove ? 'success' : 'error'}
        sx={{ mb: 3 }}
      >
        <AlertTitle>Caseworker Recommendation: {application.caseworkerRecommendation}</AlertTitle>
        {application.rejectionReason && `Reason: ${application.rejectionReason}`}
      </Alert>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>{application.id}</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={statusConfig[application.status]?.label}
                color={statusConfig[application.status]?.color}
              />
              <Chip
                label={`Recommend: ${application.caseworkerRecommendation}`}
                color={isRecommendApprove ? 'success' : 'error'}
                variant="outlined"
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<RejectIcon />}
              onClick={() => handleAction('reject')}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<ApproveIcon />}
              onClick={() => handleAction('approve')}
            >
              Approve
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Applicant Information</Typography>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Name</Typography>
                    <Typography>
                      {application.applicant?.firstName} {application.applicant?.middleInitial} {application.applicant?.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography>{application.contact?.email || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">County</Typography>
                    <Typography>{application.contact?.county || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Eligibility Summary</Typography>
            <Card variant="outlined">
              <CardContent>
                <EligibilityItem
                  label="Income"
                  met={eligibility.income}
                  detail={`${application.household?.fplPercentage || '-'}% FPL`}
                />
                <EligibilityItem
                  label="Employment"
                  met={eligibility.employment}
                  detail={`${application.employment?.hoursPerWeek || '-'} hrs/week`}
                />
                <EligibilityItem
                  label="Child Age"
                  met={eligibility.childAge}
                  detail="Within limits"
                />
                <EligibilityItem
                  label="Residency"
                  met={eligibility.residency}
                  detail={application.contact?.county || '-'}
                />
                <EligibilityItem
                  label="Provider"
                  met={eligibility.provider}
                  detail={application.provider?.name || '-'}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Children</Typography>
            <TableContainer component={Card} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Care Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {application.children?.map((child, idx) => (
                    <TableRow key={child.id || idx}>
                      <TableCell>{child.firstName} {child.lastName}</TableCell>
                      <TableCell>{formatDate(child.dateOfBirth)}</TableCell>
                      <TableCell>{child.careType?.join(', ') || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {application.notes?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Case Notes</Typography>
              <Card variant="outlined">
                <List>
                  {application.notes.map((note) => (
                    <ListItem key={note.id} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={note.category} size="small" />
                            <Typography variant="body2">{note.text}</Typography>
                          </Box>
                        }
                        secondary={formatDateTime(note.createdAt)}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onClose={() => setShowActionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' ? 'Approve Application' : 'Reject Application'}
        </DialogTitle>
        <DialogContent>
          {isOverride ? (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                You are overriding the caseworker's recommendation to {application.caseworkerRecommendation.toLowerCase()}.
              </Alert>
              <DialogContentText sx={{ mb: 2 }}>
                Please provide a reason for overriding the caseworker's recommendation.
              </DialogContentText>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Override Reason"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                required
              />
            </>
          ) : (
            <DialogContentText>
              {actionType === 'approve'
                ? 'This application will be approved and the applicant will be notified. Are you sure?'
                : 'This application will be rejected and the applicant will be notified. Are you sure?'}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowActionDialog(false); setOverrideReason(''); }}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
            disabled={isOverride && !overrideReason}
          >
            Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApprovalReview;
