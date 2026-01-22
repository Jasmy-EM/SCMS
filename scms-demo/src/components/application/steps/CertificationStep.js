import React from 'react';
import {
  Box, Grid, TextField, Typography, FormControlLabel, Checkbox,
  Paper, Alert, Divider, FormHelperText, FormControl,
} from '@mui/material';

const certifications = [
  {
    id: 'accuracy',
    label: 'Accuracy Certification',
    text: 'I certify that all information provided in this application is true, accurate, and complete to the best of my knowledge.',
  },
  {
    id: 'verificationPermission',
    label: 'Verification Permission',
    text: 'I give permission to verify the information provided in this application, including but not limited to income, employment, residency, and child eligibility.',
  },
  {
    id: 'fraudUnderstanding',
    label: 'Fraud Understanding',
    text: 'I understand that providing false or misleading information on this application may result in denial of benefits, termination of assistance, and potential legal action.',
  },
  {
    id: 'programRules',
    label: 'Program Rules Agreement',
    text: 'I agree to comply with all program rules and requirements, including reporting any changes in income, employment, or household composition within 10 days of the change.',
  },
];

const CertificationStep = ({ data, onChange, errors }) => {
  const handleCertificationChange = (certId) => (event) => {
    onChange({
      certifications: {
        ...data.certifications,
        [certId]: event.target.checked,
      },
    });
  };

  const handleSignatureChange = (field) => (event) => {
    onChange({
      signature: {
        ...data.signature,
        [field]: event.target.value,
      },
    });
  };

  const applicantFullName = `${data.applicant?.firstName || ''} ${data.applicant?.lastName || ''}`.trim();
  const today = new Date().toISOString().split('T')[0];

  // Auto-set signature date if not set
  React.useEffect(() => {
    if (!data.signature?.date) {
      onChange({
        signature: {
          ...data.signature,
          date: today,
        },
      });
    }
  }, []);

  const allCertificationsChecked = certifications.every(
    cert => data.certifications?.[cert.id]
  );

  return (
    <Box>
      {/* Step 8: Certification & Signature */}
      <Typography variant="h6" gutterBottom>Certification & Signature</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review and agree to the following certifications, then sign your application electronically.
      </Typography>

      {/* Certifications Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Certifications
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        {certifications.map((cert, index) => (
          <Box key={cert.id} sx={{ mb: index < certifications.length - 1 ? 3 : 0 }}>
            <FormControl error={!!errors?.[cert.id]} component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.certifications?.[cert.id] || false}
                    onChange={handleCertificationChange(cert.id)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" component="span">
                      {cert.label} *
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {cert.text}
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start', m: 0 }}
              />
              {errors?.[cert.id] && (
                <FormHelperText sx={{ ml: 4 }}>{errors[cert.id]}</FormHelperText>
              )}
            </FormControl>
            {index < certifications.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Paper>

      {!allCertificationsChecked && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You must agree to all certifications above before signing your application.
        </Alert>
      )}

      {/* Electronic Signature Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Electronic Signature
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            By typing your full legal name below, you are providing your electronic signature
            and confirming that you have read and agree to all certifications above.
          </Typography>
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              required
              label="Electronic Signature"
              value={data.signature?.fullName || ''}
              onChange={handleSignatureChange('fullName')}
              error={!!errors?.fullName}
              helperText={
                errors?.fullName ||
                `Type your full legal name exactly as: ${applicantFullName || 'First Last'}`
              }
              placeholder="Type your full legal name"
              inputProps={{ maxLength: 100 }}
              disabled={!allCertificationsChecked}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Signature Date"
              type="date"
              value={data.signature?.date || today}
              onChange={handleSignatureChange('date')}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              helperText="Auto-populated (read-only)"
              disabled
            />
          </Grid>
        </Grid>

        {data.signature?.fullName && allCertificationsChecked && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
            <Typography variant="body2" color="success.main">
              <strong>Signature captured:</strong> {data.signature.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Signed on {new Date(data.signature?.date || today).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </Paper>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>What happens next?</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          After you submit your application, a caseworker will review it and may contact you
          if additional information is needed. You will receive notifications about your
          application status via your preferred contact method.
        </Typography>
      </Alert>
    </Box>
  );
};

CertificationStep.validate = (data) => {
  const errors = {};

  // Validate all certifications are checked
  certifications.forEach((cert) => {
    if (!data.certifications?.[cert.id]) {
      errors[cert.id] = `You must agree to the ${cert.label}`;
    }
  });

  // Validate electronic signature
  if (!data.signature?.fullName?.trim()) {
    errors.fullName = 'Electronic signature is required';
  } else {
    // Validate signature matches applicant name
    const applicantFullName = `${data.applicant?.firstName || ''} ${data.applicant?.lastName || ''}`.trim().toLowerCase();
    const signatureName = data.signature.fullName.trim().toLowerCase();

    if (applicantFullName && signatureName !== applicantFullName) {
      errors.fullName = `Signature must match your full legal name: ${data.applicant?.firstName} ${data.applicant?.lastName}`;
    }
  }

  // Validate signature date
  if (!data.signature?.date) {
    errors.date = 'Signature date is required';
  }

  return errors;
};

export default CertificationStep;
