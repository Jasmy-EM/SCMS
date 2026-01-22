import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Paper, Typography, Grid, Chip, Button, Divider, List, ListItem,
  ListItemText, Alert, AlertTitle, Card, CardContent, Stepper, Step, StepLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import {
  ArrowBack as BackIcon, Download as DownloadIcon, Upload as UploadIcon,
  CheckCircle as CheckIcon, Warning as WarningIcon, Error as ErrorIcon,
} from '@mui/icons-material';
import { useApplications } from '../../context/ApplicationContext';
import { APPLICATION_STATUS, statusConfig } from '../../data/mockApplications';
import { formatDate, formatDateTime } from '../../utils/formatters';

const statusSteps = [
  { status: APPLICATION_STATUS.SUBMITTED, label: 'Submitted' },
  { status: APPLICATION_STATUS.UNDER_REVIEW, label: 'Under Review' },
  { status: APPLICATION_STATUS.PENDING_APPROVAL, label: 'Pending Approval' },
  { status: APPLICATION_STATUS.APPROVED, label: 'Approved' },
];

const getActiveStep = (status) => {
  const idx = statusSteps.findIndex(s => s.status === status);
  return idx >= 0 ? idx : 0;
};

const DocumentStatusIcon = ({ status }) => {
  switch (status) {
    case 'verified': return <CheckIcon color="success" />;
    case 'pending': return <WarningIcon color="warning" />;
    case 'rejected': return <ErrorIcon color="error" />;
    default: return null;
  }
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getApplication } = useApplications();

  const application = getApplication(id);
  const justSubmitted = location.state?.justSubmitted;

  if (!application) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" gutterBottom>Application Not Found</Typography>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/applications')}>
          Back to Applications
        </Button>
      </Box>
    );
  }

  const isInfoRequested = application.status === APPLICATION_STATUS.INFO_REQUESTED;

  return (
    <Box>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/applications')} sx={{ mb: 2 }}>
        Back to Applications
      </Button>

      {justSubmitted && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>Application Submitted Successfully!</AlertTitle>
          Your application {application.id} has been submitted and will be reviewed shortly.
        </Alert>
      )}

      {isInfoRequested && (
        <Alert severity="warning" sx={{ mb: 3 }} action={
          <Button color="inherit" size="small" startIcon={<UploadIcon />}>
            Upload Documents
          </Button>
        }>
          <AlertTitle>Additional Information Required</AlertTitle>
          {application.infoRequestedDescription || 'Please upload the requested documents to continue processing your application.'}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>{application.id}</Typography>
            <Chip
              label={statusConfig[application.status]?.label}
              color={statusConfig[application.status]?.color}
              sx={{ mr: 1 }}
            />
          </Box>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Download PDF
          </Button>
        </Box>

        {application.status !== APPLICATION_STATUS.REJECTED && (
          <Stepper activeStep={getActiveStep(application.status)} alternativeLabel sx={{ mb: 4 }}>
            {statusSteps.map((step) => (
              <Step key={step.status}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

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
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography>
                      {application.contact?.streetAddress ? (
                        <>
                          {application.contact.streetAddress} {application.contact.apartment}<br />
                          {application.contact.city}, {application.contact.state} {application.contact.zipCode}
                        </>
                      ) : '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Provider Information</Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">Provider Name</Typography>
                <Typography gutterBottom>{application.provider?.name || '-'}</Typography>
                <Typography variant="body2" color="text.secondary">License Number</Typography>
                <Typography gutterBottom>{application.provider?.licenseNumber || '-'}</Typography>
                <Typography variant="body2" color="text.secondary">Address</Typography>
                <Typography>{application.provider?.address || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Children</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Care Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {application.children?.length > 0 ? (
                application.children.map((child, index) => (
                  <TableRow key={child.id || index}>
                    <TableCell>{child.firstName} {child.lastName}</TableCell>
                    <TableCell>{formatDate(child.dateOfBirth)}</TableCell>
                    <TableCell>{child.careType?.join(', ') || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center' }}>No children listed</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {application.documents?.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Documents</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Uploaded</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {application.documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{doc.type.replace(/_/g, ' ')}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DocumentStatusIcon status={doc.status} />
                        <span style={{ textTransform: 'capitalize' }}>{doc.status}</span>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDateTime(doc.uploadedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {application.history?.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Application History</Typography>
          <List>
            {application.history.map((item, index) => (
              <ListItem key={index} sx={{ borderBottom: index < application.history.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                <ListItemText
                  primary={item.action}
                  secondary={`${item.performedBy} • ${formatDateTime(item.timestamp)}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default ApplicationDetail;
