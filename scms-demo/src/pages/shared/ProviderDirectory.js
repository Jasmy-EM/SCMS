import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Grid, Card, CardContent, CardActions, Button,
  TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem,
  Chip, Rating, Divider,
} from '@mui/material';
import {
  Search as SearchIcon, LocationOn as LocationIcon,
  Phone as PhoneIcon, ChildCare as ChildIcon,
} from '@mui/icons-material';
import { mockProviders, providerTypes, counties } from '../../data/mockProviders';
import { useAuth } from '../../context/AuthContext';

const ProviderDirectory = () => {
  const navigate = useNavigate();
  const { isParent } = useAuth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [countyFilter, setCountyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getFilteredProviders = () => {
    let filtered = mockProviders;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === typeFilter);
    }
    if (countyFilter !== 'all') {
      filtered = filtered.filter(p => p.county === countyFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.city.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const filteredProviders = getFilteredProviders();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">{isParent ? 'Find Providers' : 'Provider Directory'}</Typography>
        <Typography variant="body2" color="text.secondary">
          {filteredProviders.length} providers found
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Type">
                <MenuItem value="all">All Types</MenuItem>
                {providerTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>County</InputLabel>
              <Select value={countyFilter} onChange={(e) => setCountyFilter(e.target.value)} label="County">
                <MenuItem value="all">All Counties</MenuItem>
                {counties.map(county => (
                  <MenuItem key={county} value={county}>{county}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {!isParent && (
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredProviders.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No providers found matching your criteria</Typography>
            </Paper>
          </Grid>
        ) : (
          filteredProviders.map((provider) => (
            <Grid item xs={12} md={6} lg={4} key={provider.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{provider.name}</Typography>
                    <Chip
                      label={provider.status}
                      color={provider.status === 'Active' ? 'success' : provider.status === 'Pending' ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{provider.type}</Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={provider.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({provider.rating})
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {provider.address}<br />
                      {provider.city}, {provider.state} {provider.zipCode}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{provider.phone}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ChildIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Ages {provider.ageRange} • Capacity: {provider.capacity}
                    </Typography>
                  </Box>

                  {provider.acceptsSubsidy && (
                    <Chip label="Accepts Subsidy" color="primary" size="small" sx={{ mt: 1.5 }} variant="outlined" />
                  )}
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button size="small" onClick={() => navigate(`/providers/${provider.id}`)}>
                    View Details
                  </Button>
                  {isParent && provider.status === 'Active' && (
                    <Button size="small" color="primary">
                      Select Provider
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ProviderDirectory;
