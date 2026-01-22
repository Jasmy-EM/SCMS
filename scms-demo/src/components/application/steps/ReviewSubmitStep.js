import React from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Divider, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import {
  CheckCircle as CheckIcon, Warning as WarningIcon,
  Person as PersonIcon, Home as HomeIcon, Work as WorkIcon,
  ChildCare as ChildIcon, Business as ProviderIcon,
  Description as DocIcon, VerifiedUser as CertIcon,
} from '@mui/icons-material';
import { formatDate, formatCurrency } from '../../../utils/formatters';

const SectionCard = ({ title, icon: Icon, children, complete, stepNumber }) => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {complete ? (
          <CheckIcon color="success" fontSize="small" />
        ) : (
          <WarningIcon color="warning" fontSize="small" />
        )}
        <Icon color="action" fontSize="small" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {stepNumber && `Step ${stepNumber}: `}{title}
        </Typography>
        <Chip
          label={complete ? 'Complete' : 'Incomplete'}
          size="small"
          color={complete ? 'success' : 'warning'}
          variant="outlined"
          sx={{ ml: 'auto' }}
        />
      </Box>
      {children}
    </CardContent>
  </Card>
);

const ReviewSubmitStep = ({ data }) => {
  // Check completeness of each section
  const personalComplete = data.applicant?.firstName && data.applicant?.lastName &&
    data.applicant?.dateOfBirth && data.applicant?.ssn && data.applicant?.maritalStatus &&
    data.applicant?.primaryLanguage;

  const contactComplete = data.contact?.streetAddress && data.contact?.city &&
    data.contact?.zipCode && data.contact?.county && data.contact?.phone &&
    data.contact?.email && data.contact?.preferredContactMethod;

  const householdComplete = data.household?.size && data.household?.dependents !== undefined &&
    data.household?.monthlyIncome && data.household?.incomeFrequency &&
    data.household?.primaryIncomeSource;

  const employmentComplete = data.employment?.status &&
    (['Full-Time', 'Part-Time', 'Self-Employed'].includes(data.employment?.status)
      ? data.employment?.hoursPerWeek && data.employment?.grossMonthlyIncome
      : true);

  const childrenComplete = data.children?.length > 0 &&
    data.children.every(c => c.firstName && c.lastName && c.dateOfBirth &&
      c.ssn && c.relationship && c.careNeeded?.length > 0 && c.preferredStartDate);

  const providerComplete = !!data.providerSelection?.providerId;

  const documentsComplete = data.documents?.length >= 3;

  const certificationComplete = data.certifications?.accuracy &&
    data.certifications?.verificationPermission && data.certifications?.fraudUnderstanding &&
    data.certifications?.programRules && data.signature?.fullName;

  const allComplete = personalComplete && contactComplete && householdComplete &&
    employmentComplete && childrenComplete && providerComplete && documentsComplete &&
    certificationComplete;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Review Your Application</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review all information below before submitting. Use the Back button to make any corrections.
      </Typography>

      {!allComplete && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Application Incomplete:</strong> Some required information is missing.
            Please go back and complete all sections before submitting.
          </Typography>
        </Alert>
      )}

      {allComplete && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Ready to Submit:</strong> All required information has been provided.
            Click "Submit Application" below to complete your submission.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* Personal & Contact Information */}
          <SectionCard
            title="Personal & Contact Information"
            icon={PersonIcon}
            complete={personalComplete && contactComplete}
            stepNumber="1-2"
          >
            <Typography variant="body2">
              <strong>Name:</strong> {data.applicant?.firstName} {data.applicant?.middleInitial} {data.applicant?.lastName}
            </Typography>
            <Typography variant="body2">
              <strong>Date of Birth:</strong> {formatDate(data.applicant?.dateOfBirth)}
            </Typography>
            <Typography variant="body2">
              <strong>Marital Status:</strong> {data.applicant?.maritalStatus || '-'}
            </Typography>
            <Typography variant="body2">
              <strong>Language:</strong> {data.applicant?.primaryLanguage || '-'}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2">
              <strong>Address:</strong> {data.contact?.streetAddress}{data.contact?.apartment ? `, ${data.contact.apartment}` : ''}
            </Typography>
            <Typography variant="body2" sx={{ ml: 8 }}>
              {data.contact?.city}, {data.contact?.state} {data.contact?.zipCode}
            </Typography>
            <Typography variant="body2">
              <strong>County:</strong> {data.contact?.county || '-'}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {data.contact?.phone || '-'}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {data.contact?.email || '-'}
            </Typography>
            <Typography variant="body2">
              <strong>Preferred Contact:</strong> {data.contact?.preferredContactMethod || '-'}
            </Typography>
          </SectionCard>

          {/* Household Information */}
          <SectionCard
            title="Household Information"
            icon={HomeIcon}
            complete={householdComplete}
            stepNumber="3"
          >
            <Typography variant="body2">
              <strong>Household Size:</strong> {data.household?.size || '-'}
            </Typography>
            <Typography variant="body2">
              <strong>Dependents:</strong> {data.household?.dependents ?? '-'}
            </Typography>
            <Typography variant="body2">
              <strong>Monthly Income:</strong> {data.household?.monthlyIncome ? formatCurrency(data.household.monthlyIncome) : '-'}
            </Typography>
            <Typography variant="body2">
              <strong>Income Frequency:</strong> {data.household?.incomeFrequency || '-'}
            </Typography>
            <Typography variant="body2">
              <strong>Income Source:</strong> {data.household?.primaryIncomeSource || '-'}
            </Typography>
            {data.household?.fplPercentage > 0 && (
              <Chip
                label={`${data.household.fplPercentage}% FPL`}
                size="small"
                color={data.household.fplPercentage <= 200 ? 'success' : 'warning'}
                sx={{ mt: 1 }}
              />
            )}
          </SectionCard>

          {/* Employment Information */}
          <SectionCard
            title="Employment Information"
            icon={WorkIcon}
            complete={employmentComplete}
            stepNumber="4"
          >
            <Typography variant="body2">
              <strong>Status:</strong> {data.employment?.status || '-'}
            </Typography>
            {['Full-Time', 'Part-Time'].includes(data.employment?.status) && (
              <>
                <Typography variant="body2">
                  <strong>Employer:</strong> {data.employment?.employerName || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Job Title:</strong> {data.employment?.jobTitle || '-'}
                </Typography>
              </>
            )}
            {['Full-Time', 'Part-Time', 'Self-Employed'].includes(data.employment?.status) && (
              <>
                <Typography variant="body2">
                  <strong>Hours/Week:</strong> {data.employment?.hoursPerWeek || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Gross Monthly:</strong> {data.employment?.grossMonthlyIncome ? formatCurrency(data.employment.grossMonthlyIncome) : '-'}
                </Typography>
              </>
            )}
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Children Information */}
          <SectionCard
            title="Children Information"
            icon={ChildIcon}
            complete={childrenComplete}
            stepNumber="5"
          >
            {data.children?.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>DOB</TableCell>
                      <TableCell>Care Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.children.map((child, index) => (
                      <TableRow key={child.id || index}>
                        <TableCell>
                          {child.firstName} {child.lastName}
                          {child.specialNeeds && (
                            <Chip label="Special Needs" size="small" color="info" sx={{ ml: 1 }} />
                          )}
                        </TableCell>
                        <TableCell>{formatDate(child.dateOfBirth)}</TableCell>
                        <TableCell>{child.careNeeded?.join(', ') || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">No children added</Typography>
            )}
          </SectionCard>

          {/* Provider Selection */}
          <SectionCard
            title="Provider Selection"
            icon={ProviderIcon}
            complete={providerComplete}
            stepNumber="6"
          >
            {data.providerSelection?.providerId ? (
              <>
                <Typography variant="body2">
                  <strong>Provider:</strong> {data.providerSelection.providerName}
                </Typography>
                <Typography variant="body2">
                  <strong>License:</strong> {data.providerSelection.providerLicense}
                </Typography>
                <Typography variant="body2">
                  <strong>Address:</strong> {data.providerSelection.providerAddress}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {data.providerSelection.providerPhone}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">No provider selected</Typography>
            )}
          </SectionCard>

          {/* Documents */}
          <SectionCard
            title="Documents Uploaded"
            icon={DocIcon}
            complete={documentsComplete}
            stepNumber="7"
          >
            {data.documents?.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {data.documents.map((doc) => (
                  <Chip
                    key={doc.id}
                    label={doc.name}
                    size="small"
                    icon={<CheckIcon />}
                    color="success"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No documents uploaded</Typography>
            )}
          </SectionCard>

          {/* Certification */}
          <SectionCard
            title="Certification & Signature"
            icon={CertIcon}
            complete={certificationComplete}
            stepNumber="8"
          >
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {data.certifications?.accuracy ? <CheckIcon color="success" fontSize="small" /> : <WarningIcon color="warning" fontSize="small" />}
                </ListItemIcon>
                <ListItemText primary="Accuracy certification" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {data.certifications?.verificationPermission ? <CheckIcon color="success" fontSize="small" /> : <WarningIcon color="warning" fontSize="small" />}
                </ListItemIcon>
                <ListItemText primary="Verification permission" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {data.certifications?.fraudUnderstanding ? <CheckIcon color="success" fontSize="small" /> : <WarningIcon color="warning" fontSize="small" />}
                </ListItemIcon>
                <ListItemText primary="Fraud understanding" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {data.certifications?.programRules ? <CheckIcon color="success" fontSize="small" /> : <WarningIcon color="warning" fontSize="small" />}
                </ListItemIcon>
                <ListItemText primary="Program rules agreement" />
              </ListItem>
            </List>
            {data.signature?.fullName && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Signed by:</strong> {data.signature.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Date: {formatDate(data.signature.date)}
                </Typography>
              </Box>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

// No validation needed for review step - validation happens on previous steps
ReviewSubmitStep.validate = () => ({});

export default ReviewSubmitStep;
