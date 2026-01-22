import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, TextField, InputAdornment, FormControl,
  InputLabel, Select, MenuItem, Tabs, Tab,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useApplications } from '../../context/ApplicationContext';
import { APPLICATION_STATUS, statusConfig } from '../../data/mockApplications';
import { formatDate } from '../../utils/formatters';
import { mockUsers, ROLES } from '../../data/mockUsers';

const TeamCases = () => {
  const navigate = useNavigate();
  const { applications } = useApplications();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  // All active cases
  const teamCases = applications.filter(a =>
    [APPLICATION_STATUS.SUBMITTED, APPLICATION_STATUS.UNDER_REVIEW, APPLICATION_STATUS.INFO_REQUESTED, APPLICATION_STATUS.PENDING_APPROVAL].includes(a.status)
  );

  const getCaseworkerName = (id) => {
    if (id === mockUsers[ROLES.CASEWORKER].id) {
      return `${mockUsers[ROLES.CASEWORKER].firstName} ${mockUsers[ROLES.CASEWORKER].lastName}`;
    }
    return 'Unassigned';
  };

  const getFilteredCases = () => {
    let filtered = teamCases;

    // Tab filter
    if (tabValue === 1) {
      filtered = filtered.filter(a => a.status === APPLICATION_STATUS.UNDER_REVIEW);
    } else if (tabValue === 2) {
      filtered = filtered.filter(a => a.status === APPLICATION_STATUS.INFO_REQUESTED);
    } else if (tabValue === 3) {
      filtered = filtered.filter(a => a.status === APPLICATION_STATUS.PENDING_APPROVAL);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(a =>
        a.id?.toLowerCase().includes(searchLower) ||
        a.applicant?.firstName?.toLowerCase().includes(searchLower) ||
        a.applicant?.lastName?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const filteredCases = getFilteredCases();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Team Cases</Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of all cases in your team
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`All (${teamCases.length})`} />
          <Tab label={`Under Review (${teamCases.filter(a => a.status === APPLICATION_STATUS.UNDER_REVIEW).length})`} />
          <Tab label={`Info Requested (${teamCases.filter(a => a.status === APPLICATION_STATUS.INFO_REQUESTED).length})`} />
          <Tab label={`Pending Approval (${teamCases.filter(a => a.status === APPLICATION_STATUS.PENDING_APPROVAL).length})`} />
        </Tabs>

        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search by ID or applicant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            sx={{ minWidth: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value={APPLICATION_STATUS.UNDER_REVIEW}>Under Review</MenuItem>
              <MenuItem value={APPLICATION_STATUS.INFO_REQUESTED}>Info Requested</MenuItem>
              <MenuItem value={APPLICATION_STATUS.PENDING_APPROVAL}>Pending Approval</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case ID</TableCell>
                <TableCell>Applicant</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No cases found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((app) => (
                  <TableRow key={app.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{app.id}</TableCell>
                    <TableCell>
                      {app.applicant?.firstName} {app.applicant?.lastName}
                    </TableCell>
                    <TableCell>{getCaseworkerName(app.assignedCaseworker)}</TableCell>
                    <TableCell>{formatDate(app.submittedAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig[app.status]?.label}
                        color={statusConfig[app.status]?.color}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TeamCases;
