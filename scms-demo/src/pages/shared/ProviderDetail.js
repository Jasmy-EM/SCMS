import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Grid, Card, CardContent, Button, Chip,
  Rating, Divider, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import {
  ArrowBack as BackIcon, LocationOn as LocationIcon,
  Phone as PhoneIcon, Email as EmailIcon, Language as WebIcon,
  CheckCircle as CheckIcon, AccessTime as TimeIcon,
  ChildCare as ChildIcon,
} from '@mui/icons-material';
import { mockProviders } from '../../data/mockProviders';
import { useAuth } from '../../context/AuthContext';

const ProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isParent } = useAuth();

  const provider = mockProviders.find(p => p.id === id);

  if (!provider) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" gutterBottom>Provider Not Found</Typography>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/providers')}>
          Back to Providers
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/providers')} sx={{ mb: 2 }}>
        Back to Providers
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>{provider.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip label={provider.type} />
              <Chip
                label={provider.status}
                color={provider.status === 'Active' ? 'success' : provider.status === 'Pending' ? 'warning' : 'error'}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={provider.rating} precision={0.5} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>({provider.rating})</Typography>
              </Box>
            </Box>
          </Box>
          {isParent && provider.status === 'Active' && (
            <Button variant="contained" onClick={() => navigate('/applications/new')}>
              Apply with this Provider
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            <Card variant="outlined">
              <CardContent>
                <List dense>
                  <ListItem>
                    <ListItemIcon><LocationIcon /></ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={`${provider.address}, ${provider.city}, ${provider.state} ${provider.zipCode}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText primary="Phone" secondary={provider.phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><EmailIcon /></ListItemIcon>
                    <ListItemText primary="Email" secondary={provider.email || 'Not provided'} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WebIcon /></ListItemIcon>
                    <ListItemText primary="Website" secondary={provider.website || 'Not provided'} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>License Information</Typography>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">License Number</Typography>
                    <Typography>{provider.licenseNumber}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">License Expiry</Typography>
                    <Typography>{provider.licenseExpiry}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">County</Typography>
                    <Typography>{provider.county}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Capacity</Typography>
                    <Typography>{provider.capacity} children</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Program Details</Typography>
            <Card variant="outlined">
              <CardContent>
                <List dense>
                  <ListItem>
                    <ListItemIcon><ChildIcon /></ListItemIcon>
                    <ListItemText primary="Age Range" secondary={provider.ageRange} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><TimeIcon /></ListItemIcon>
                    <ListItemText primary="Hours of Operation" secondary={provider.hoursOfOperation || 'Mon-Fri 6:30 AM - 6:00 PM'} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon color={provider.acceptsSubsidy ? 'success' : 'disabled'} /></ListItemIcon>
                    <ListItemText
                      primary="Subsidy Acceptance"
                      secondary={provider.acceptsSubsidy ? 'Accepts state childcare subsidy' : 'Does not accept subsidy'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Services Offered</Typography>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {(provider.services || ['Full-Time Care', 'Part-Time Care', 'Before/After School', 'Summer Program']).map((service) => (
                    <Chip key={service} label={service} variant="outlined" size="small" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Rate Schedule</Typography>
            <TableContainer component={Card} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Age Group</TableCell>
                    <TableCell align="right">Daily Rate</TableCell>
                    <TableCell align="right">Weekly Rate</TableCell>
                    <TableCell align="right">Monthly Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Infant (0-12 months)</TableCell>
                    <TableCell align="right">$75</TableCell>
                    <TableCell align="right">$350</TableCell>
                    <TableCell align="right">$1,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Toddler (1-2 years)</TableCell>
                    <TableCell align="right">$65</TableCell>
                    <TableCell align="right">$300</TableCell>
                    <TableCell align="right">$1,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Preschool (3-5 years)</TableCell>
                    <TableCell align="right">$55</TableCell>
                    <TableCell align="right">$250</TableCell>
                    <TableCell align="right">$1,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>School Age (6+ years)</TableCell>
                    <TableCell align="right">$45</TableCell>
                    <TableCell align="right">$200</TableCell>
                    <TableCell align="right">$800</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProviderDetail;
