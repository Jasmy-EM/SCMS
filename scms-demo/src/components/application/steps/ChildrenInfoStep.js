import React from 'react';
import {
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  Typography, Button, Card, CardContent, IconButton, Chip, FormControlLabel,
  Checkbox, FormGroup, FormHelperText, Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const emptyChild = {
  firstName: '',
  middleInitial: '',
  lastName: '',
  dateOfBirth: '',
  ssn: '',
  gender: '',
  relationship: '',
  specialNeeds: false,
  specialNeedsDescription: '',
  careNeeded: [],
  preferredStartDate: '',
};

const careTypeOptions = [
  { value: 'Full-Time', label: 'Full-Time' },
  { value: 'Part-Time', label: 'Part-Time' },
  { value: 'Before School', label: 'Before School' },
  { value: 'After School', label: 'After School' },
  { value: 'Weekends', label: 'Weekends' },
];

const ChildrenInfoStep = ({ data, onChange, errors }) => {
  const children = data.children || [];

  const handleAddChild = () => {
    if (children.length >= 4) return; // Max 4 children per spec
    onChange({
      children: [...children, { ...emptyChild, id: `child-${Date.now()}` }],
    });
  };

  const handleRemoveChild = (index) => {
    const newChildren = children.filter((_, i) => i !== index);
    onChange({ children: newChildren });
  };

  const handleChildChange = (index, field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const newChildren = children.map((child, i) =>
      i === index ? { ...child, [field]: value } : child
    );
    onChange({ children: newChildren });
  };

  const handleCareTypeChange = (index, careType) => (event) => {
    const checked = event.target.checked;
    const newChildren = children.map((child, i) => {
      if (i !== index) return child;
      const currentCareNeeded = child.careNeeded || [];
      const newCareNeeded = checked
        ? [...currentCareNeeded, careType]
        : currentCareNeeded.filter((c) => c !== careType);
      return { ...child, careNeeded: newCareNeeded };
    });
    onChange({ children: newChildren });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getChildError = (index, field) => {
    if (Array.isArray(errors?.children)) {
      return errors.children[index]?.[field];
    }
    return null;
  };

  return (
    <Box>
      {/* Step 5: Child Information */}
      <Typography variant="h6" gutterBottom>Child Information</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add information for each child who will receive childcare assistance (1-4 children).
      </Typography>

      {typeof errors?.children === 'string' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.children}
        </Alert>
      )}

      {children.length === 0 ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center', mb: 3 }}>
          <Typography color="text.secondary" gutterBottom>
            No children added yet
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddChild}>
            Add Child
          </Button>
        </Card>
      ) : (
        <>
          {children.map((child, index) => {
            const age = calculateAge(child.dateOfBirth);
            const maxAge = child.specialNeeds ? 18 : 13;
            const ageValid = age === null || age <= maxAge;

            return (
              <Card key={child.id || index} variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Child {index + 1}
                      </Typography>
                      {age !== null && (
                        <Chip
                          label={`${age} years old`}
                          size="small"
                          color={ageValid ? 'success' : 'error'}
                        />
                      )}
                    </Box>
                    {children.length > 1 && (
                      <IconButton color="error" onClick={() => handleRemoveChild(index)} title="Remove child">
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Grid container spacing={2}>
                    {/* Name Fields */}
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        required
                        label="Child First Name"
                        value={child.firstName || ''}
                        onChange={handleChildChange(index, 'firstName')}
                        error={!!getChildError(index, 'firstName')}
                        helperText={getChildError(index, 'firstName') || "Child's legal first name"}
                        size="small"
                        inputProps={{ maxLength: 50 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        label="M.I."
                        value={child.middleInitial || ''}
                        onChange={handleChildChange(index, 'middleInitial')}
                        placeholder="M"
                        size="small"
                        inputProps={{ maxLength: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        required
                        label="Child Last Name"
                        value={child.lastName || ''}
                        onChange={handleChildChange(index, 'lastName')}
                        error={!!getChildError(index, 'lastName')}
                        helperText={getChildError(index, 'lastName') || "Child's legal last name"}
                        size="small"
                        inputProps={{ maxLength: 50 }}
                      />
                    </Grid>

                    {/* DOB, Gender, SSN */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="Child Date of Birth"
                        type="date"
                        value={child.dateOfBirth || ''}
                        onChange={handleChildChange(index, 'dateOfBirth')}
                        InputLabelProps={{ shrink: true }}
                        error={!!getChildError(index, 'dateOfBirth')}
                        helperText={getChildError(index, 'dateOfBirth')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Child Gender</InputLabel>
                        <Select
                          value={child.gender || ''}
                          onChange={handleChildChange(index, 'gender')}
                          label="Child Gender"
                        >
                          <MenuItem value="">Select gender (optional)</MenuItem>
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                          <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="Child SSN"
                        value={child.ssn || ''}
                        onChange={handleChildChange(index, 'ssn')}
                        placeholder="XXX-XX-XXXX"
                        error={!!getChildError(index, 'ssn')}
                        helperText={getChildError(index, 'ssn') || 'Required for verification'}
                        size="small"
                        inputProps={{ maxLength: 11 }}
                      />
                    </Grid>

                    {/* Relationship */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small" required error={!!getChildError(index, 'relationship')}>
                        <InputLabel>Relationship to Applicant</InputLabel>
                        <Select
                          value={child.relationship || ''}
                          onChange={handleChildChange(index, 'relationship')}
                          label="Relationship to Applicant"
                        >
                          <MenuItem value="">Relationship to you</MenuItem>
                          <MenuItem value="Child">Child</MenuItem>
                          <MenuItem value="Stepchild">Stepchild</MenuItem>
                          <MenuItem value="Grandchild">Grandchild</MenuItem>
                          <MenuItem value="Foster Child">Foster Child</MenuItem>
                          <MenuItem value="Legal Ward">Legal Ward</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                        {getChildError(index, 'relationship') && (
                          <FormHelperText>{getChildError(index, 'relationship')}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Preferred Start Date */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Preferred Start Date"
                        type="date"
                        value={child.preferredStartDate || ''}
                        onChange={handleChildChange(index, 'preferredStartDate')}
                        InputLabelProps={{ shrink: true }}
                        error={!!getChildError(index, 'preferredStartDate')}
                        helperText={getChildError(index, 'preferredStartDate') || 'Must be a future date'}
                        size="small"
                      />
                    </Grid>

                    {/* Care Type Needed - Multi-checkbox */}
                    <Grid item xs={12}>
                      <FormControl
                        component="fieldset"
                        required
                        error={!!getChildError(index, 'careNeeded')}
                      >
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Child Care Type Needed (select all that apply) *
                        </Typography>
                        <FormGroup row>
                          {careTypeOptions.map((option) => (
                            <FormControlLabel
                              key={option.value}
                              control={
                                <Checkbox
                                  checked={(child.careNeeded || []).includes(option.value)}
                                  onChange={handleCareTypeChange(index, option.value)}
                                  size="small"
                                />
                              }
                              label={option.label}
                            />
                          ))}
                        </FormGroup>
                        {getChildError(index, 'careNeeded') && (
                          <FormHelperText>{getChildError(index, 'careNeeded')}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Special Needs */}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={child.specialNeeds || false}
                            onChange={handleChildChange(index, 'specialNeeds')}
                          />
                        }
                        label="Does child have special needs?"
                      />
                    </Grid>

                    {/* Special Needs Description - Conditional */}
                    {child.specialNeeds && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          required
                          multiline
                          rows={3}
                          label="Special Needs Description"
                          value={child.specialNeedsDescription || ''}
                          onChange={handleChildChange(index, 'specialNeedsDescription')}
                          error={!!getChildError(index, 'specialNeedsDescription')}
                          helperText={getChildError(index, 'specialNeedsDescription') || 'Describe special needs (max 500 characters)'}
                          placeholder="Describe the child's special needs and any care accommodations required"
                          inputProps={{ maxLength: 500 }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            );
          })}

          {children.length < 4 && (
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddChild}>
              Add Another Child
            </Button>
          )}
          {children.length >= 4 && (
            <Typography variant="body2" color="text.secondary">
              Maximum of 4 children per application
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

ChildrenInfoStep.validate = (data) => {
  const errors = {};

  if (!data.children || data.children.length === 0) {
    errors.children = 'At least one child is required';
    return errors;
  }

  const childErrors = data.children.map((child) => {
    const childError = {};

    // First Name validation
    if (!child.firstName?.trim()) {
      childError.firstName = 'First name is required';
    } else if (child.firstName.length > 50) {
      childError.firstName = 'First name must be 50 characters or less';
    }

    // Last Name validation
    if (!child.lastName?.trim()) {
      childError.lastName = 'Last name is required';
    } else if (child.lastName.length > 50) {
      childError.lastName = 'Last name must be 50 characters or less';
    }

    // Date of Birth validation
    if (!child.dateOfBirth) {
      childError.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(child.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      const maxAge = child.specialNeeds ? 18 : 13;
      if (age < 0) {
        childError.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (age > maxAge) {
        childError.dateOfBirth = `Child must be ${maxAge} years or younger${child.specialNeeds ? ' (special needs)' : ''}`;
      }
    }

    // SSN validation
    if (!child.ssn?.trim()) {
      childError.ssn = 'SSN is required';
    } else {
      const ssnDigits = child.ssn.replace(/\D/g, '');
      if (ssnDigits.length !== 9) {
        childError.ssn = 'SSN must be 9 digits (XXX-XX-XXXX)';
      }
    }

    // Relationship validation
    if (!child.relationship) {
      childError.relationship = 'Relationship is required';
    }

    // Care Type validation
    if (!child.careNeeded || child.careNeeded.length === 0) {
      childError.careNeeded = 'At least one care type is required';
    }

    // Preferred Start Date validation
    if (!child.preferredStartDate) {
      childError.preferredStartDate = 'Preferred start date is required';
    } else {
      const startDate = new Date(child.preferredStartDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate <= today) {
        childError.preferredStartDate = 'Start date must be in the future';
      }
    }

    // Special Needs Description validation (conditional)
    if (child.specialNeeds && !child.specialNeedsDescription?.trim()) {
      childError.specialNeedsDescription = 'Special needs description is required';
    } else if (child.specialNeeds && child.specialNeedsDescription?.length > 500) {
      childError.specialNeedsDescription = 'Description must be 500 characters or less';
    }

    return Object.keys(childError).length > 0 ? childError : null;
  });

  if (childErrors.some((e) => e !== null)) {
    errors.children = childErrors;
  }

  // Check for duplicate SSNs within the application
  const ssns = data.children
    .map((c) => c.ssn?.replace(/\D/g, ''))
    .filter((ssn) => ssn && ssn.length === 9);
  const uniqueSSNs = new Set(ssns);
  if (ssns.length !== uniqueSSNs.size) {
    if (!errors.children) errors.children = [];
    // Mark duplicate SSNs
    const seenSSNs = new Set();
    data.children.forEach((child, index) => {
      const ssn = child.ssn?.replace(/\D/g, '');
      if (ssn && ssn.length === 9) {
        if (seenSSNs.has(ssn)) {
          if (!errors.children[index]) errors.children[index] = {};
          errors.children[index].ssn = 'Duplicate SSN - each child must have a unique SSN';
        }
        seenSSNs.add(ssn);
      }
    });
  }

  return errors;
};

export default ChildrenInfoStep;
