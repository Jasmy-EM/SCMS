import React from 'react';
import {
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  Typography, FormHelperText, FormControlLabel, Checkbox, InputAdornment,
  Paper, Divider,
} from '@mui/material';
import { eligibilityConfig } from '../../../data/mockConfig';

// Time options for work schedule (30-minute increments)
const timeOptions = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? 'AM' : 'PM';
    timeOptions.push({
      value: `${h}:${m}`,
      label: `${displayHour}:${m.padStart(2, '0')} ${period}`,
    });
  }
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLabels = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

const EmploymentInfoStep = ({ data, onChange, errors }) => {
  const handleChange = (field) => (event) => {
    onChange({
      employment: {
        ...data.employment,
        [field]: event.target.value,
      },
    });
  };

  const handleAddressChange = (field) => (event) => {
    onChange({
      employment: {
        ...data.employment,
        employerAddress: {
          ...data.employment?.employerAddress,
          [field]: event.target.value,
        },
      },
    });
  };

  const handleScheduleToggle = (day) => (event) => {
    onChange({
      employment: {
        ...data.employment,
        schedule: {
          ...data.employment?.schedule,
          [day]: {
            ...data.employment?.schedule?.[day],
            enabled: event.target.checked,
          },
        },
      },
    });
  };

  const handleScheduleTime = (day, field) => (event) => {
    onChange({
      employment: {
        ...data.employment,
        schedule: {
          ...data.employment?.schedule,
          [day]: {
            ...data.employment?.schedule?.[day],
            [field]: event.target.value,
          },
        },
      },
    });
  };

  const status = data.employment?.status || '';
  const showEmployerDetails = ['Full-Time', 'Part-Time'].includes(status);
  const showWorkSchedule = ['Full-Time', 'Part-Time', 'Self-Employed'].includes(status);

  return (
    <Box>
      {/* Step 4: Employment Information */}
      <Typography variant="h6" gutterBottom>Employment Information</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide details about your current employment status and work schedule.
      </Typography>

      {/* Employment Status Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Employment Status
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors?.status}>
            <InputLabel>Employment Status</InputLabel>
            <Select
              value={data.employment?.status || ''}
              onChange={handleChange('status')}
              label="Employment Status"
            >
              <MenuItem value="">Current employment status</MenuItem>
              <MenuItem value="Full-Time">Full-Time</MenuItem>
              <MenuItem value="Part-Time">Part-Time</MenuItem>
              <MenuItem value="Self-Employed">Self-Employed</MenuItem>
              <MenuItem value="Student/Training">Student/Training</MenuItem>
              <MenuItem value="Unemployed">Unemployed</MenuItem>
            </Select>
            {errors?.status && <FormHelperText>{errors.status}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>

      {/* Employer Details Section - Conditional on Full-Time or Part-Time */}
      {showEmployerDetails && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Employer Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Employer Name"
                value={data.employment?.employerName || ''}
                onChange={handleChange('employerName')}
                error={!!errors?.employerName}
                helperText={errors?.employerName || 'Name of employer'}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Job Title"
                value={data.employment?.jobTitle || ''}
                onChange={handleChange('jobTitle')}
                error={!!errors?.jobTitle}
                helperText={errors?.jobTitle || 'Your job title'}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Employer Street Address"
                value={data.employment?.employerAddress?.street || ''}
                onChange={handleAddressChange('street')}
                error={!!errors?.employerStreet}
                helperText={errors?.employerStreet}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                required
                label="Employer City"
                value={data.employment?.employerAddress?.city || ''}
                onChange={handleAddressChange('city')}
                error={!!errors?.employerCity}
                helperText={errors?.employerCity}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required error={!!errors?.employerState}>
                <InputLabel>State</InputLabel>
                <Select
                  value={data.employment?.employerAddress?.state || ''}
                  onChange={handleAddressChange('state')}
                  label="State"
                >
                  <MenuItem value="">Select State</MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
                {errors?.employerState && <FormHelperText>{errors.employerState}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Employer ZIP Code"
                value={data.employment?.employerAddress?.zipCode || ''}
                onChange={handleAddressChange('zipCode')}
                error={!!errors?.employerZip}
                helperText={errors?.employerZip}
                placeholder="12345"
                inputProps={{ maxLength: 5 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Employer Phone"
                value={data.employment?.employerPhone || ''}
                onChange={handleChange('employerPhone')}
                error={!!errors?.employerPhone}
                helperText={errors?.employerPhone}
                placeholder="(555) 000-0000"
                inputProps={{ maxLength: 14 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Employment Start Date"
                type="date"
                value={data.employment?.startDate || ''}
                onChange={handleChange('startDate')}
                error={!!errors?.startDate}
                helperText={errors?.startDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </>
      )}

      {/* Work Schedule & Income Section */}
      {showWorkSchedule && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Work Schedule & Income
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Hours Per Week"
                type="number"
                value={data.employment?.hoursPerWeek || ''}
                onChange={handleChange('hoursPerWeek')}
                error={!!errors?.hoursPerWeek}
                helperText={errors?.hoursPerWeek || `Minimum ${eligibilityConfig.minimumWorkHours} hours required for eligibility`}
                inputProps={{ min: 1, max: 80 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Gross Monthly Income"
                type="number"
                value={data.employment?.grossMonthlyIncome || ''}
                onChange={handleChange('grossMonthlyIncome')}
                error={!!errors?.grossMonthlyIncome}
                helperText={errors?.grossMonthlyIncome}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            {/* Weekly Schedule */}
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select the days you work and enter your schedule:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                {days.map((day) => (
                  <Box key={day} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={data.employment?.schedule?.[day]?.enabled || false}
                              onChange={handleScheduleToggle(day)}
                            />
                          }
                          label={dayLabels[day]}
                        />
                      </Grid>
                      {data.employment?.schedule?.[day]?.enabled && (
                        <>
                          <Grid item xs={6} sm={4}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Start Time</InputLabel>
                              <Select
                                value={data.employment?.schedule?.[day]?.startTime || ''}
                                onChange={handleScheduleTime(day, 'startTime')}
                                label="Start Time"
                              >
                                {timeOptions.map((opt) => (
                                  <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <FormControl fullWidth size="small">
                              <InputLabel>End Time</InputLabel>
                              <Select
                                value={data.employment?.schedule?.[day]?.endTime || ''}
                                onChange={handleScheduleTime(day, 'endTime')}
                                label="End Time"
                              >
                                {timeOptions.map((opt) => (
                                  <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

EmploymentInfoStep.validate = (data) => {
  const errors = {};
  const minimumWorkHours = 20;

  // Employment Status validation (always required)
  if (!data.employment?.status) {
    errors.status = 'Employment status is required';
  }

  const status = data.employment?.status;
  const showEmployerDetails = ['Full-Time', 'Part-Time'].includes(status);
  const showWorkSchedule = ['Full-Time', 'Part-Time', 'Self-Employed'].includes(status);

  // Employer Details validation (conditional)
  if (showEmployerDetails) {
    if (!data.employment?.employerName?.trim()) {
      errors.employerName = 'Employer name is required';
    }
    if (!data.employment?.jobTitle?.trim()) {
      errors.jobTitle = 'Job title is required';
    }
    if (!data.employment?.employerAddress?.street?.trim()) {
      errors.employerStreet = 'Employer street address is required';
    }
    if (!data.employment?.employerAddress?.city?.trim()) {
      errors.employerCity = 'Employer city is required';
    }
    if (!data.employment?.employerAddress?.state) {
      errors.employerState = 'Employer state is required';
    }
    if (!data.employment?.employerAddress?.zipCode?.trim()) {
      errors.employerZip = 'Employer ZIP code is required';
    } else if (!/^\d{5}$/.test(data.employment.employerAddress.zipCode)) {
      errors.employerZip = 'ZIP code must be 5 digits';
    }
    if (!data.employment?.employerPhone?.trim()) {
      errors.employerPhone = 'Employer phone is required';
    } else {
      const phoneDigits = data.employment.employerPhone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        errors.employerPhone = 'Phone must be 10 digits';
      }
    }
    if (!data.employment?.startDate) {
      errors.startDate = 'Employment start date is required';
    } else {
      const startDate = new Date(data.employment.startDate);
      if (startDate > new Date()) {
        errors.startDate = 'Start date cannot be in the future';
      }
    }
  }

  // Work Schedule validation (conditional)
  if (showWorkSchedule) {
    if (!data.employment?.hoursPerWeek) {
      errors.hoursPerWeek = 'Hours per week is required';
    } else {
      const hours = parseInt(data.employment.hoursPerWeek);
      if (hours < 1 || hours > 80) {
        errors.hoursPerWeek = 'Hours must be between 1 and 80';
      } else if (hours < minimumWorkHours) {
        errors.hoursPerWeek = `Minimum ${minimumWorkHours} hours required for eligibility`;
      }
    }

    if (!data.employment?.grossMonthlyIncome && data.employment?.grossMonthlyIncome !== 0) {
      errors.grossMonthlyIncome = 'Gross monthly income is required';
    } else if (parseFloat(data.employment.grossMonthlyIncome) < 0) {
      errors.grossMonthlyIncome = 'Income cannot be negative';
    }
  }

  return errors;
};

export default EmploymentInfoStep;
