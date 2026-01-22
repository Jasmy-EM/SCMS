import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Grid, Chip, Button, Divider, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, FormControl, InputLabel, Select, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Alert, Tabs, Tab,
  List, ListItem, ListItemText, IconButton, Tooltip,
} from '@mui/material';
import {
  ArrowBack as BackIcon, CheckCircle as ApproveIcon, Cancel as RejectIcon,
  Info as InfoIcon, Add as AddIcon, Check as CheckIcon, Close as CloseIcon,
  Warning as WarningIcon,
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

const CaseReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getApplication, updateApplicationStatus, addCaseNote } = useApplications();
  const [tabValue, setTabValue] = useState(0);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [infoRequestReason, setInfoRequestReason] = useState('');
  const [newNote, setNewNote] = useState('');
  const [noteCategory, setNoteCategory] = useState('General');

  const application = getApplication(id);

  if (!application) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" gutterBottom>Case Not Found</Typography>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/cases')}>
          Back to Cases
        </Button>
      </Box>
    );
  }

  const handleAction = (type) => {
    setActionType(type);
    setShowActionDialog(true);
  };

  const handleConfirmAction = () => {
    let newStatus;
    let additionalData = {};

    switch (actionType) {
      case 'approve':
        newStatus = APPLICATION_STATUS.PENDING_APPROVAL;
        additionalData.caseworkerRecommendation = 'Approve';
        break;
      case 'reject':
        newStatus = APPLICATION_STATUS.PENDING_APPROVAL;
        additionalData.caseworkerRecommendation = 'Reject';
        additionalData.rejectionReason = recommendation;
        break;
      case 'request-info':
        newStatus = APPLICATION_STATUS.INFO_REQUESTED;
        additionalData.infoRequestedDescription = infoRequestReason;
        break;
      default:
        return;
    }

    updateApplicationStatus(id, newStatus, additionalData);
    setShowActionDialog(false);
    navigate('/cases');
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      addCaseNote(id, newNote, noteCategory);
      setNewNote('');
    }
  };

  const eligibility = application.eligibility || {};

  return (
    <Box>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/cases')} sx={{ mb: 2 }}>
        Back to Cases
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>{application.id}</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={statusConfig[application.status]?.label}
                color={statusConfig[application.status]?.color}
              />
              {application.slaDueDate && new Date(application.slaDueDate) <= new Date() && (
                <Chip label="Overdue" color="error" size="small" icon={<WarningIcon />} />
              )}
            </Box>
          </Box>
          {application.status === APPLICATION_STATUS.UNDER_REVIEW && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<InfoIcon />}
                onClick={() => handleAction('request-info')}
              >
                Request Info
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<RejectIcon />}
                onClick={() => handleAction('reject')}
              >
                Recommend Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={() => handleAction('approve')}
              >
                Recommend Approve
              </Button>
            </Box>
          )}
        </Box>

        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tab label="Overview" />
          <Tab label="Eligibility" />
          <Tab label="Documents" />
          <Tab label="Notes & History" />
        </Tabs>

        {tabValue === 0 && (
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
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography>{application.contact?.phone || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">County</Typography>
                      <Typography>{application.contact?.county || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">SLA Due Date</Typography>
                      <Typography color={application.slaDueDate && new Date(application.slaDueDate) <= new Date() ? 'error' : 'inherit'}>
                        {application.slaDueDate ? formatDate(application.slaDueDate) : '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Household & Employment</Typography>
              <Card variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">FPL %</Typography>
                      <Typography>{application.household?.fplPercentage || '-'}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Monthly Income</Typography>
                      <Typography>{application.employment?.grossMonthlyIncome ? formatCurrency(application.employment.grossMonthlyIncome) : '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Work Hours/Week</Typography>
                      <Typography>{application.employment?.hoursPerWeek || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Employment Status</Typography>
                      <Typography>{application.employment?.status || '-'}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Children</Typography>
              <TableContainer component={Card} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Care Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {application.children?.map((child, idx) => {
                      const age = child.dateOfBirth
                        ? Math.floor((new Date() - new Date(child.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
                        : '-';
                      return (
                        <TableRow key={child.id || idx}>
                          <TableCell>{child.firstName} {child.lastName}</TableCell>
                          <TableCell>{formatDate(child.dateOfBirth)}</TableCell>
                          <TableCell>{age} years</TableCell>
                          <TableCell>{child.careType?.join(', ') || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Provider</Typography>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1">{application.provider?.name || '-'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    License: {application.provider?.licenseNumber || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {application.provider?.address || '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Box>
            <Alert severity={Object.values(eligibility).every(v => v) ? 'success' : 'warning'} sx={{ mb: 3 }}>
              {Object.values(eligibility).every(v => v)
                ? 'All eligibility criteria are met.'
                : 'Some eligibility criteria are not met. Review carefully before proceeding.'}
            </Alert>
            <Card variant="outlined">
              <CardContent>
                <EligibilityItem
                  label="Income Eligibility"
                  met={eligibility.income}
                  detail={`FPL: ${application.household?.fplPercentage || '-'}% (Max: ${eligibilityConfig.fplThresholds.level1}%)`}
                />
                <EligibilityItem
                  label="Employment Eligibility"
                  met={eligibility.employment}
                  detail={`Hours: ${application.employment?.hoursPerWeek || '-'}/week (Min: ${eligibilityConfig.minimumWorkHours})`}
                />
                <EligibilityItem
                  label="Child Age Eligibility"
                  met={eligibility.childAge}
                  detail={`Age limit: ${eligibilityConfig.maxChildAge} years`}
                />
                <EligibilityItem
                  label="Residency Verification"
                  met={eligibility.residency}
                  detail={application.contact?.county ? `County: ${application.contact.county}` : 'Not verified'}
                />
                <EligibilityItem
                  label="Provider Verification"
                  met={eligibility.provider}
                  detail={application.provider?.licenseNumber ? 'Licensed provider' : 'Not verified'}
                />
              </CardContent>
            </Card>
          </Box>
        )}

        {tabValue === 2 && (
          <TableContainer component={Card} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {application.documents?.length > 0 ? (
                  application.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{doc.type.replace(/_/g, ' ')}</TableCell>
                      <TableCell>
                        <Chip
                          label={doc.status}
                          color={doc.status === 'verified' ? 'success' : doc.status === 'pending' ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDateTime(doc.uploadedAt)}</TableCell>
                      <TableCell>
                        <Button size="small">View</Button>
                        {doc.status === 'pending' && (
                          <>
                            <Button size="small" color="success">Verify</Button>
                            <Button size="small" color="error">Reject</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center' }}>No documents uploaded</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Add Note</Typography>
              <Card variant="outlined" sx={{ p: 2 }}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select value={noteCategory} onChange={(e) => setNoteCategory(e.target.value)} label="Category">
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Eligibility">Eligibility</MenuItem>
                    <MenuItem value="Documents">Documents</MenuItem>
                    <MenuItem value="Contact">Contact</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Add a case note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNote} disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </Card>

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>Notes</Typography>
              <List>
                {application.notes?.length > 0 ? (
                  application.notes.map((note) => (
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
                  ))
                ) : (
                  <Typography color="text.secondary" sx={{ py: 2 }}>No notes yet</Typography>
                )}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>History</Typography>
              <List>
                {application.history?.map((item, index) => (
                  <ListItem key={index} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <ListItemText
                      primary={item.action}
                      secondary={`${item.performedBy} • ${formatDateTime(item.timestamp)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onClose={() => setShowActionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' && 'Recommend Approval'}
          {actionType === 'reject' && 'Recommend Rejection'}
          {actionType === 'request-info' && 'Request Additional Information'}
        </DialogTitle>
        <DialogContent>
          {actionType === 'approve' && (
            <DialogContentText>
              This case will be sent to a supervisor for final approval. Are you sure you want to recommend approval?
            </DialogContentText>
          )}
          {actionType === 'reject' && (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                Please provide a reason for recommending rejection.
              </DialogContentText>
              <FormControl fullWidth>
                <InputLabel>Rejection Reason</InputLabel>
                <Select value={recommendation} onChange={(e) => setRecommendation(e.target.value)} label="Rejection Reason">
                  <MenuItem value="Income Over Limit">Income Over Limit</MenuItem>
                  <MenuItem value="Insufficient Work Hours">Insufficient Work Hours</MenuItem>
                  <MenuItem value="Child Age Ineligible">Child Age Ineligible</MenuItem>
                  <MenuItem value="Missing Documents">Missing Documents</MenuItem>
                  <MenuItem value="Fraudulent Information">Fraudulent Information</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          {actionType === 'request-info' && (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                Describe what additional information is needed from the applicant.
              </DialogContentText>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="e.g., Please upload current pay stubs from the last 30 days."
                value={infoRequestReason}
                onChange={(e) => setInfoRequestReason(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowActionDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={actionType === 'reject' ? 'error' : actionType === 'request-info' ? 'warning' : 'success'}
            disabled={(actionType === 'reject' && !recommendation) || (actionType === 'request-info' && !infoRequestReason)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CaseReview;
