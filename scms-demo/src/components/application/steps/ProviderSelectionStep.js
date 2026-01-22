import React, { useState } from 'react';
import {
  Box, Grid, TextField, InputAdornment, FormControl, InputLabel, Select,
  MenuItem, Typography, Card, CardContent, Chip, Rating, Alert,
  RadioGroup, FormControlLabel, Radio,
} from '@mui/material';
import {
  Search as SearchIcon, LocationOn as LocationIcon,
  CheckCircle as CheckIcon, Phone as PhoneIcon,
} from '@mui/icons-material';
import { mockProviders, providerTypes, counties } from '../../../data/mockProviders';

const ProviderSelectionStep = ({ data, onChange, errors }) => {
  // Search/filter state (not persisted per spec)
  const [searchName, setSearchName] = useState('');
  const [searchCounty, setSearchCounty] = useState(data.contact?.county || 'all');
  const [searchType, setSearchType] = useState('all');
  const [searchZip, setSearchZip] = useState('');

  const selectedProviderId = data.providerSelection?.providerId;

  const getFilteredProviders = () => {
    // Only show active providers that accept subsidies
    let filtered = mockProviders.filter(p => p.status === 'Active' && p.acceptsSubsidy);

    // Apply filters
    if (searchType !== 'all') {
      filtered = filtered.filter(p => p.type === searchType);
    }
    if (searchCounty !== 'all') {
      filtered = filtered.filter(p => p.county === searchCounty);
    }
    if (searchZip) {
      filtered = filtered.filter(p => p.zipCode.startsWith(searchZip));
    }
    if (searchName) {
      const searchLower = searchName.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const handleSelectProvider = (providerId) => {
    const provider = mockProviders.find(p => p.id === providerId);
    if (provider) {
      onChange({
        providerSelection: {
          providerId: provider.id,
          providerName: provider.name,
          providerLicense: provider.licenseNumber,
          providerAddress: `${provider.address}, ${provider.city}, ${provider.state} ${provider.zipCode}`,
          providerPhone: provider.phone,
        },
      });
    }
  };

  const filteredProviders = getFilteredProviders();
  const selectedProvider = mockProviders.find(p => p.id === selectedProviderId);

  return (
    <Box>
      {/* Step 6: Provider Selection */}
      <Typography variant="h6" gutterBottom>Provider Selection</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose a licensed childcare provider that accepts state subsidies.
      </Typography>

      {/* Show selected provider alert */}
      {selectedProvider && (
        <Alert severity="success" sx={{ mb: 3 }} icon={<CheckIcon />}>
          <Typography variant="body2">
            <strong>Selected Provider:</strong> {selectedProvider.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedProvider.address}, {selectedProvider.city}, {selectedProvider.state} {selectedProvider.zipCode}
          </Typography>
        </Alert>
      )}

      {/* Provider Search Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Provider Search
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Search by Provider Name"
            placeholder="Provider name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Filter by County</InputLabel>
            <Select
              value={searchCounty}
              onChange={(e) => setSearchCounty(e.target.value)}
              label="Filter by County"
            >
              <MenuItem value="all">All Counties</MenuItem>
              {counties.map(county => (
                <MenuItem key={county} value={county}>{county}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Filter by Provider Type</InputLabel>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              label="Filter by Provider Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              {providerTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Filter by ZIP Code"
            placeholder="ZIP Code"
            value={searchZip}
            onChange={(e) => setSearchZip(e.target.value)}
            inputProps={{ maxLength: 5 }}
          />
        </Grid>
      </Grid>

      {/* Selected Provider Section */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Select Your Childcare Provider ({filteredProviders.length} available)
      </Typography>

      {filteredProviders.length === 0 ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No providers found matching your criteria. Try adjusting your filters.
          </Typography>
        </Card>
      ) : (
        <RadioGroup
          value={selectedProviderId || ''}
          onChange={(e) => handleSelectProvider(e.target.value)}
        >
          <Grid container spacing={2}>
            {filteredProviders.map((provider) => {
              const isSelected = selectedProviderId === provider.id;
              return (
                <Grid item xs={12} md={6} key={provider.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      borderWidth: isSelected ? 2 : 1,
                      bgcolor: isSelected ? 'action.selected' : 'background.paper',
                      '&:hover': { borderColor: 'primary.main' },
                      transition: 'all 0.2s',
                    }}
                    onClick={() => handleSelectProvider(provider.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <FormControlLabel
                          value={provider.id}
                          control={<Radio />}
                          label=""
                          sx={{ m: 0, mr: -1 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {provider.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {provider.type}
                              </Typography>
                            </Box>
                            {isSelected && <CheckIcon color="primary" />}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={provider.rating} precision={0.5} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({provider.rating})
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 0.5 }}>
                            <LocationIcon fontSize="small" color="action" sx={{ mt: 0.25 }} />
                            <Typography variant="body2">
                              {provider.address}<br />
                              {provider.city}, {provider.state} {provider.zipCode}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{provider.phone}</Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={`Ages ${provider.ageRange}`} size="small" variant="outlined" />
                            <Chip label={`Capacity: ${provider.capacity}`} size="small" variant="outlined" />
                            <Chip label="Accepts Subsidy" size="small" color="success" variant="outlined" />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </RadioGroup>
      )}

      {errors?.providerId && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.providerId}
        </Alert>
      )}
    </Box>
  );
};

ProviderSelectionStep.validate = (data) => {
  const errors = {};

  if (!data.providerSelection?.providerId) {
    errors.providerId = 'Please select a childcare provider to continue';
  } else {
    // Verify the selected provider is still active
    const provider = mockProviders.find(p => p.id === data.providerSelection.providerId);
    if (!provider) {
      errors.providerId = 'Selected provider not found';
    } else if (provider.status !== 'Active') {
      errors.providerId = 'Selected provider is no longer active';
    } else if (!provider.acceptsSubsidy) {
      errors.providerId = 'Selected provider does not accept subsidies';
    }
  }

  return errors;
};

export default ProviderSelectionStep;
