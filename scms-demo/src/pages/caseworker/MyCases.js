import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, TextField, InputAdornment, FormControl,
  InputLabel, Select, MenuItem, Tabs, Tab, IconButton, Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon, Visibility as ViewIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';
import { APPLICATION_STATUS, statusConfig } from '../../data/mockApplications';
import { formatDate } from '../../utils/formatters';

const MyCases = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications } = useApplications();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  // Filter cases assigned to this caseworker
  const myCases = applications.filter(a => a.assignedCaseworker === user?.id);

  const getFilteredCases = () => {
    let filtered = myCases;

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

  const isDueSoon = (slaDueDate) => {
    if (!slaDueDate) return false;
    const dueDate = new Date(slaDueDate);
    const now = new Date();
    const diffDays = (dueDate - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 2;
  };

  const isOverdue = (slaDueDate) => {
    if (!slaDueDate) return false;
    return new Date(slaDueDate) < new Date();
  };

  const filteredCases = getFilteredCases();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">My Cases</Typography>
        <Typography variant="body2" color="text.secondary">
          {myCases.length} cases assigned to you
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`All (${myCases.length})`} />
          <Tab label={`Under Review (${myCases.filter(a => a.status === APPLICATION_STATUS.UNDER_REVIEW).length})`} />
          <Tab label={`Info Requested (${myCases.filter(a => a.status === APPLICATION_STATUS.INFO_REQUESTED).length})`} />
          <Tab label={`Pending Approval (${myCases.filter(a => a.status === APPLICATION_STATUS.PENDING_APPROVAL).length})`} />
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
                <TableCell>County</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>SLA Due</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No cases found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((app) => (
                  <TableRow
                    key={app.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/cases/${app.id}`)}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {app.id}
                        {isOverdue(app.slaDueDate) && (
                          <Tooltip title="Overdue">
                            <WarningIcon color="error" fontSize="small" />
                          </Tooltip>
                        )}
                        {!isOverdue(app.slaDueDate) && isDueSoon(app.slaDueDate) && (
                          <Tooltip title="Due Soon">
                            <WarningIcon color="warning" fontSize="small" />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {app.applicant?.firstName} {app.applicant?.lastName}
                    </TableCell>
                    <TableCell>{app.contact?.county || '-'}</TableCell>
                    <TableCell>{formatDate(app.submittedAt)}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={isOverdue(app.slaDueDate) ? 'error' : isDueSoon(app.slaDueDate) ? 'warning.main' : 'text.primary'}
                      >
                        {app.slaDueDate ? formatDate(app.slaDueDate) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig[app.status]?.label}
                        color={statusConfig[app.status]?.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Review Case">
                        <IconButton size="small" onClick={() => navigate(`/cases/${app.id}`)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
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

export default MyCases;
