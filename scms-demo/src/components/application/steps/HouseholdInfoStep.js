import React from 'react';
import {
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  Typography, InputAdornment, Alert, FormHelperText,
} from '@mui/material';
import { eligibilityConfig } from '../../../data/mockConfig';

const HouseholdInfoStep = ({ data, onChange, errors }) => {
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    const newHousehold = {
      ...data.household,
      [field]: value,
    };

    // Calculate FPL percentage when income or size changes
    if (field === 'monthlyIncome' || field === 'size') {
      const income = field === 'monthlyIncome' ? parseFloat(value) : parseFloat(data.household?.monthlyIncome || 0);
      const size = field === 'size' ? parseInt(value) : parseInt(data.household?.size || 1);

      if (income > 0 && size > 0) {
        // 2024 FPL guidelines (simplified)
        const fplBySize = {
          1: 15060, 2: 20440, 3: 25820, 4: 31200, 5: 36580, 6: 41960, 7: 47340, 8: 52720,
        };
        const additionalPerson = 5380; // For each person above 8
        const annualIncome = income * 12;
        let fplThreshold;
        if (size <= 8) {
          fplThreshold = fplBySize[size];
        } else {
          fplThreshold = fplBySize[8] + (additionalPerson * (size - 8));
        }
        const fplPercentage = Math.round((annualIncome / fplThreshold) * 100);

        newHousehold.fplPercentage = fplPercentage;
      }
    }

    onChange({ household: newHousehold });
  };

  const fplPercentage = data.household?.fplPercentage || 0;
  const isEligible = fplPercentage <= eligibilityConfig.fplThresholds.level3;

  return (
    <Box>
      {/* Step 3: Household Information */}
      <Typography variant="h6" gutterBottom>Household Information</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide information about your household size and income.
      </Typography>

      {/* Household Composition Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Household Composition
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Household Size"
            type="number"
            value={data.household?.size || ''}
            onChange={handleChange('size')}
            inputProps={{ min: 1, max: 20 }}
            error={!!errors?.size}
            helperText={errors?.size || 'Total people in household (1-20)'}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Number of Dependents"
            type="number"
            value={data.household?.dependents || ''}
            onChange={handleChange('dependents')}
            inputProps={{ min: 0, max: 19 }}
            error={!!errors?.dependents}
            helperText={errors?.dependents || 'Must be less than household size'}
          />
        </Grid>
      </Grid>

      {/* Income Information Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, mt: 4 }}>
        Income Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Monthly Household Income"
            type="number"
            value={data.household?.monthlyIncome || ''}
            onChange={handleChange('monthlyIncome')}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            inputProps={{ min: 0, max: 50000, step: 0.01 }}
            error={!!errors?.monthlyIncome}
            helperText={errors?.monthlyIncome || 'Total household income before taxes'}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors?.incomeFrequency}>
            <InputLabel>Income Frequency</InputLabel>
            <Select
              value={data.household?.incomeFrequency || ''}
              onChange={handleChange('incomeFrequency')}
              label="Income Frequency"
            >
              <MenuItem value="">How often is income received?</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Bi-weekly">Bi-weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Annual">Annual</MenuItem>
            </Select>
            {errors?.incomeFrequency && <FormHelperText>{errors.incomeFrequency}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors?.primaryIncomeSource}>
            <InputLabel>Primary Income Source</InputLabel>
            <Select
              value={data.household?.primaryIncomeSource || ''}
              onChange={handleChange('primaryIncomeSource')}
              label="Primary Income Source"
            >
              <MenuItem value="">Primary source of income</MenuItem>
              <MenuItem value="Employment">Employment</MenuItem>
              <MenuItem value="Self-Employment">Self-Employment</MenuItem>
              <MenuItem value="Unemployment Benefits">Unemployment Benefits</MenuItem>
              <MenuItem value="Social Security">Social Security</MenuItem>
              <MenuItem value="Child Support">Child Support</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {errors?.primaryIncomeSource && <FormHelperText>{errors.primaryIncomeSource}</FormHelperText>}
          </FormControl>
        </Grid>

        {/* FPL Eligibility Alert */}
        {fplPercentage > 0 && (
          <Grid item xs={12}>
            <Alert severity={isEligible ? 'success' : 'warning'}>
              <Typography variant="body2">
                <strong>Estimated Federal Poverty Level: {fplPercentage}%</strong>
              </Typography>
              <Typography variant="caption">
                {isEligible
                  ? `Based on your income, you may be eligible for childcare assistance (threshold: ${eligibilityConfig.fplThresholds.level3}% FPL).`
                  : `Your income exceeds the eligibility threshold of ${eligibilityConfig.fplThresholds.level3}% FPL. You may not qualify for assistance.`}
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

HouseholdInfoStep.validate = (data) => {
  const errors = {};

  // Household Size validation
  if (!data.household?.size) {
    errors.size = 'Household size is required';
  } else {
    const size = parseInt(data.household.size);
    if (size < 1 || size > 20) {
      errors.size = 'Household size must be between 1 and 20';
    }
  }

  // Number of Dependents validation
  if (data.household?.dependents === undefined || data.household?.dependents === '') {
    errors.dependents = 'Number of dependents is required';
  } else {
    const dependents = parseInt(data.household.dependents);
    const size = parseInt(data.household?.size || 0);
    if (dependents < 0 || dependents > 19) {
      errors.dependents = 'Number of dependents must be between 0 and 19';
    } else if (dependents >= size) {
      errors.dependents = 'Dependents must be less than household size';
    }
  }

  // Monthly Income validation
  if (!data.household?.monthlyIncome) {
    errors.monthlyIncome = 'Monthly household income is required';
  } else {
    const income = parseFloat(data.household.monthlyIncome);
    if (income < 0) {
      errors.monthlyIncome = 'Income cannot be negative';
    } else if (income > 50000) {
      errors.monthlyIncome = 'Income cannot exceed $50,000 per month';
    }
  }

  // Income Frequency validation
  if (!data.household?.incomeFrequency) {
    errors.incomeFrequency = 'Income frequency is required';
  }

  // Primary Income Source validation
  if (!data.household?.primaryIncomeSource) {
    errors.primaryIncomeSource = 'Primary income source is required';
  }

  return errors;
};

export default HouseholdInfoStep;
