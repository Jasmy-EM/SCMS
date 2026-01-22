import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent, Button,
  FormControl, InputLabel, Select, MenuItem, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, Chip, Divider,
} from '@mui/material';
import {
  Download as DownloadIcon, Print as PrintIcon,
  Assessment as ReportsIcon, TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useApplications } from '../../context/ApplicationContext';
import { APPLICATION_STATUS } from '../../data/mockApplications';
import { mockProviders } from '../../data/mockProviders';

const Reports = () => {
  const { applications } = useApplications();
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState('month');
  const [county, setCounty] = useState('all');

  // Calculate metrics
  const totalApps = applications.length;
  const approvedApps = applications.filter(a => a.status === APPLICATION_STATUS.APPROVED).length;
  const rejectedApps = applications.filter(a => a.status === APPLICATION_STATUS.REJECTED).length;
  const pendingApps = applications.filter(a =>
    [APPLICATION_STATUS.SUBMITTED, APPLICATION_STATUS.UNDER_REVIEW, APPLICATION_STATUS.PENDING_APPROVAL].includes(a.status)
  ).length;

  const approvalRate = (approvedApps + rejectedApps) > 0
    ? Math.round((approvedApps / (approvedApps + rejectedApps)) * 100)
    : 0;

  // Mock county data
  const countyData = [
    { county: 'Franklin', applications: 45, approved: 38, pending: 5, rejected: 2, avgDays: 3.8 },
    { county: 'Hamilton', applications: 32, approved: 27, pending: 3, rejected: 2, avgDays: 4.1 },
    { county: 'Cuyahoga', applications: 28, approved: 22, pending: 4, rejected: 2, avgDays: 4.5 },
    { county: 'Summit', applications: 18, approved: 15, pending: 2, rejected: 1, avgDays: 3.2 },
    { county: 'Montgomery', applications: 15, approved: 12, pending: 2, rejected: 1, avgDays: 3.9 },
  ];

  // Mock provider data
  const providerData = mockProviders.slice(0, 5).map((p, idx) => ({
    name: p.name,
    type: p.type,
    children: [45, 32, 28, 18, 15][idx] || 10,
    capacity: p.capacity,
    utilizationRate: Math.round(([45, 32, 28, 18, 15][idx] || 10) / p.capacity * 100),
  }));

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Reports & Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<PrintIcon />}>Print</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>Export</Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Date Range</InputLabel>
            <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)} label="Date Range">
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>County</InputLabel>
            <Select value={county} onChange={(e) => setCounty(e.target.value)} label="County">
              <MenuItem value="all">All Counties</MenuItem>
              <MenuItem value="Franklin">Franklin</MenuItem>
              <MenuItem value="Hamilton">Hamilton</MenuItem>
              <MenuItem value="Cuyahoga">Cuyahoga</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="Overview" />
          <Tab label="By County" />
          <Tab label="By Provider" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" color="primary.main">{totalApps}</Typography>
                      <Typography variant="body2" color="text.secondary">Total Applications</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" color="success.main">{approvedApps}</Typography>
                      <Typography variant="body2" color="text.secondary">Approved</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" color="warning.main">{pendingApps}</Typography>
                      <Typography variant="body2" color="text.secondary">Pending</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" color="info.main">{approvalRate}%</Typography>
                      <Typography variant="body2" color="text.secondary">Approval Rate</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>Key Performance Indicators</Typography>
              <TableContainer component={Card} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Current</TableCell>
                      <TableCell align="right">Target</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>SLA Compliance Rate</TableCell>
                      <TableCell align="right">92%</TableCell>
                      <TableCell align="right">95%</TableCell>
                      <TableCell align="right"><Chip label="On Track" color="warning" size="small" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average Processing Time</TableCell>
                      <TableCell align="right">4.2 days</TableCell>
                      <TableCell align="right">7 days</TableCell>
                      <TableCell align="right"><Chip label="Exceeds" color="success" size="small" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Application Approval Rate</TableCell>
                      <TableCell align="right">{approvalRate}%</TableCell>
                      <TableCell align="right">85%</TableCell>
                      <TableCell align="right"><Chip label={approvalRate >= 85 ? 'Met' : 'Below'} color={approvalRate >= 85 ? 'success' : 'error'} size="small" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Document Verification Rate</TableCell>
                      <TableCell align="right">98%</TableCell>
                      <TableCell align="right">95%</TableCell>
                      <TableCell align="right"><Chip label="Exceeds" color="success" size="small" /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 1 && (
            <>
              <Typography variant="h6" gutterBottom>Applications by County</Typography>
              <TableContainer component={Card} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>County</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Approved</TableCell>
                      <TableCell align="right">Pending</TableCell>
                      <TableCell align="right">Rejected</TableCell>
                      <TableCell align="right">Avg. Days</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {countyData.map((row) => (
                      <TableRow key={row.county}>
                        <TableCell>{row.county}</TableCell>
                        <TableCell align="right">{row.applications}</TableCell>
                        <TableCell align="right">{row.approved}</TableCell>
                        <TableCell align="right">{row.pending}</TableCell>
                        <TableCell align="right">{row.rejected}</TableCell>
                        <TableCell align="right">{row.avgDays}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 2 && (
            <>
              <Typography variant="h6" gutterBottom>Provider Utilization</Typography>
              <TableContainer component={Card} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Provider</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Children</TableCell>
                      <TableCell align="right">Capacity</TableCell>
                      <TableCell align="right">Utilization</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {providerData.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell align="right">{row.children}</TableCell>
                        <TableCell align="right">{row.capacity}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${row.utilizationRate}%`}
                            color={row.utilizationRate >= 90 ? 'error' : row.utilizationRate >= 70 ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Reports;
