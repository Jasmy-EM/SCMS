import React from 'react';
import {
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  Typography, Divider, FormHelperText,
} from '@mui/material';

const ApplicantInfoStep = ({ data, onChange, errors }) => {
  const handleChange = (section, field) => (event) => {
    onChange({
      [section]: {
        ...data[section],
        [field]: event.target.value,
      },
    });
  };

  return (
    <Box>
      {/* Step 1: Personal Information */}
      <Typography variant="h6" gutterBottom>Personal Information</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide your personal information as it appears on official documents.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            required
            label="First Name"
            value={data.applicant?.firstName || ''}
            onChange={handleChange('applicant', 'firstName')}
            error={!!errors?.firstName}
            helperText={errors?.firstName || 'Enter your legal first name'}
            inputProps={{ maxLength: 50, minLength: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Middle Initial"
            value={data.applicant?.middleInitial || ''}
            onChange={handleChange('applicant', 'middleInitial')}
            placeholder="M"
            inputProps={{ maxLength: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            required
            label="Last Name"
            value={data.applicant?.lastName || ''}
            onChange={handleChange('applicant', 'lastName')}
            error={!!errors?.lastName}
            helperText={errors?.lastName || 'Enter your legal last name'}
            inputProps={{ maxLength: 50, minLength: 1 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Date of Birth"
            type="date"
            value={data.applicant?.dateOfBirth || ''}
            onChange={handleChange('applicant', 'dateOfBirth')}
            InputLabelProps={{ shrink: true }}
            error={!!errors?.dateOfBirth}
            helperText={errors?.dateOfBirth || 'Must be 18+ years old'}
            placeholder="MM/DD/YYYY"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Social Security Number"
            value={data.applicant?.ssn || ''}
            onChange={handleChange('applicant', 'ssn')}
            placeholder="XXX-XX-XXXX"
            error={!!errors?.ssn}
            helperText={errors?.ssn || 'Your SSN is securely encrypted'}
            inputProps={{ maxLength: 11, minLength: 9 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              value={data.applicant?.gender || ''}
              onChange={handleChange('applicant', 'gender')}
              label="Gender"
            >
              <MenuItem value="">Select gender (optional)</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
              <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors?.maritalStatus}>
            <InputLabel>Marital Status</InputLabel>
            <Select
              value={data.applicant?.maritalStatus || ''}
              onChange={handleChange('applicant', 'maritalStatus')}
              label="Marital Status"
            >
              <MenuItem value="">Select marital status</MenuItem>
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
            {errors?.maritalStatus && <FormHelperText>{errors.maritalStatus}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors?.primaryLanguage}>
            <InputLabel>Primary Language</InputLabel>
            <Select
              value={data.applicant?.primaryLanguage || ''}
              onChange={handleChange('applicant', 'primaryLanguage')}
              label="Primary Language"
            >
              <MenuItem value="">Select your primary language</MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Spanish">Spanish</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {errors?.primaryLanguage && <FormHelperText>{errors.primaryLanguage}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Step 2: Contact Information */}
      <Typography variant="h6" gutterBottom>Contact Information</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide your current address and contact details.
      </Typography>

      <Grid container spacing={3}>
        {/* Address Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Address
          </Typography>
        </Grid>
        <Grid item xs={12} sm={9}>
          <TextField
            fullWidth
            required
            label="Street Address"
            value={data.contact?.streetAddress || ''}
            onChange={handleChange('contact', 'streetAddress')}
            error={!!errors?.streetAddress}
            helperText={errors?.streetAddress}
            placeholder="123 Main Street"
            inputProps={{ maxLength: 100, minLength: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Apartment/Unit"
            value={data.contact?.apartment || ''}
            onChange={handleChange('contact', 'apartment')}
            placeholder="Apt 4B"
            inputProps={{ maxLength: 20 }}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            required
            label="City"
            value={data.contact?.city || ''}
            onChange={handleChange('contact', 'city')}
            error={!!errors?.city}
            helperText={errors?.city}
            placeholder="City name"
            inputProps={{ maxLength: 50, minLength: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth required>
            <InputLabel>State</InputLabel>
            <Select
              value={data.contact?.state || 'OH'}
              onChange={handleChange('contact', 'state')}
              label="State"
            >
              <MenuItem value="OH">Ohio</MenuItem>
            </Select>
            <FormHelperText>Locked to program state</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="ZIP Code"
            value={data.contact?.zipCode || ''}
            onChange={handleChange('contact', 'zipCode')}
            error={!!errors?.zipCode}
            helperText={errors?.zipCode}
            placeholder="12345"
            inputProps={{ maxLength: 5, minLength: 5 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors?.county}>
            <InputLabel>County</InputLabel>
            <Select
              value={data.contact?.county || ''}
              onChange={handleChange('contact', 'county')}
              label="County"
            >
              <MenuItem value="">County auto-selected</MenuItem>
              <MenuItem value="Franklin">Franklin</MenuItem>
              <MenuItem value="Hamilton">Hamilton</MenuItem>
              <MenuItem value="Cuyahoga">Cuyahoga</MenuItem>
              <MenuItem value="Summit">Summit</MenuItem>
              <MenuItem value="Montgomery">Montgomery</MenuItem>
              <MenuItem value="Lucas">Lucas</MenuItem>
              <MenuItem value="Butler">Butler</MenuItem>
              <MenuItem value="Stark">Stark</MenuItem>
            </Select>
            {errors?.county && <FormHelperText>{errors.county}</FormHelperText>}
          </FormControl>
        </Grid>

        {/* Phone & Email Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
            Phone & Email
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Phone Number"
            value={data.contact?.phone || ''}
            onChange={handleChange('contact', 'phone')}
            placeholder="(555) 123-4567"
            error={!!errors?.phone}
            helperText={errors?.phone}
            inputProps={{ maxLength: 14, minLength: 10 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Alternate Phone"
            value={data.contact?.alternatePhone || ''}
            onChange={handleChange('contact', 'alternatePhone')}
            placeholder="(555) 987-6543"
            inputProps={{ maxLength: 14, minLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Email Address"
            type="email"
            value={data.contact?.email || ''}
            onChange={handleChange('contact', 'email')}
            error={!!errors?.email}
            helperText={errors?.email}
            placeholder="email@example.com"
          />
        </Grid>

        {/* Communication Preferences Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
            Communication Preferences
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors?.preferredContactMethod}>
            <InputLabel>Preferred Contact Method</InputLabel>
            <Select
              value={data.contact?.preferredContactMethod || ''}
              onChange={handleChange('contact', 'preferredContactMethod')}
              label="Preferred Contact Method"
            >
              <MenuItem value="">How should we contact you?</MenuItem>
              <MenuItem value="Email">Email</MenuItem>
              <MenuItem value="Phone">Phone</MenuItem>
              <MenuItem value="SMS">SMS</MenuItem>
            </Select>
            {errors?.preferredContactMethod && <FormHelperText>{errors.preferredContactMethod}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

ApplicantInfoStep.validate = (data) => {
  const errors = {};

  // Step 1: Personal Information validation
  if (!data.applicant?.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.applicant.firstName.length > 50) {
    errors.firstName = 'First name must be 50 characters or less';
  }

  if (!data.applicant?.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.applicant.lastName.length > 50) {
    errors.lastName = 'Last name must be 50 characters or less';
  }

  if (!data.applicant?.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const dob = new Date(data.applicant.dateOfBirth);
    const today = new Date();
    const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) {
      errors.dateOfBirth = 'Applicant must be 18 years or older';
    }
  }

  if (!data.applicant?.ssn?.trim()) {
    errors.ssn = 'Social Security Number is required';
  } else {
    const ssnDigits = data.applicant.ssn.replace(/\D/g, '');
    if (ssnDigits.length !== 9) {
      errors.ssn = 'SSN must be 9 digits (XXX-XX-XXXX)';
    }
  }

  if (!data.applicant?.maritalStatus) {
    errors.maritalStatus = 'Marital status is required';
  }

  if (!data.applicant?.primaryLanguage) {
    errors.primaryLanguage = 'Primary language is required';
  }

  // Step 2: Contact Information validation
  if (!data.contact?.streetAddress?.trim()) {
    errors.streetAddress = 'Street address is required';
  } else if (data.contact.streetAddress.length > 100) {
    errors.streetAddress = 'Street address must be 100 characters or less';
  }

  if (!data.contact?.city?.trim()) {
    errors.city = 'City is required';
  } else if (data.contact.city.length > 50) {
    errors.city = 'City must be 50 characters or less';
  }

  if (!data.contact?.zipCode?.trim()) {
    errors.zipCode = 'ZIP code is required';
  } else if (!/^\d{5}$/.test(data.contact.zipCode)) {
    errors.zipCode = 'ZIP code must be 5 numeric digits';
  }

  if (!data.contact?.county) {
    errors.county = 'County is required';
  }

  if (!data.contact?.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else {
    const phoneDigits = data.contact.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      errors.phone = 'Phone number must be 10 digits';
    }
  }

  if (!data.contact?.email?.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.contact?.preferredContactMethod) {
    errors.preferredContactMethod = 'Preferred contact method is required';
  }

  return errors;
};

export default ApplicantInfoStep;
