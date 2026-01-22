import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, TextField, InputAdornment, FormControl,
  InputLabel, Select, MenuItem, Tabs, Tab, Button,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useApplications } from '../../context/ApplicationContext';
import { APPLICATION_STATUS, statusConfig } from '../../data/mockApplications';
import { formatDate } from '../../utils/formatters';

const PendingApprovals = () => {
  const navigate = useNavigate();
  const { applications } = useApplications();
  const [search, setSearch] = useState('');
  const [recommendationFilter, setRecommendationFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  const pendingApproval = applications.filter(a => a.status === APPLICATION_STATUS.PENDING_APPROVAL);

  const getFilteredCases = () => {
    let filtered = pendingApproval;

    // Tab filter
    if (tabValue === 1) {
      filtered = filtered.filter(a => a.caseworkerRecommendation === 'Approve');
    } else if (tabValue === 2) {
      filtered = filtered.filter(a => a.caseworkerRecommendation === 'Reject');
    }

    // Recommendation filter
    if (recommendationFilter !== 'all') {
      filtered = filtered.filter(a => a.caseworkerRecommendation === recommendationFilter);
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
        <Typography variant="h4">Pending Approvals</Typography>
        <Typography variant="body2" color="text.secondary">
          {pendingApproval.length} cases waiting for your review
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`All (${pendingApproval.length})`} />
          <Tab label={`Recommend Approve (${pendingApproval.filter(a => a.caseworkerRecommendation === 'Approve').length})`} />
          <Tab label={`Recommend Reject (${pendingApproval.filter(a => a.caseworkerRecommendation === 'Reject').length})`} />
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
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Recommendation</InputLabel>
            <Select value={recommendationFilter} onChange={(e) => setRecommendationFilter(e.target.value)} label="Recommendation">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Approve">Recommend Approve</MenuItem>
              <MenuItem value="Reject">Recommend Reject</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case ID</TableCell>
                <TableCell>Applicant</TableCell>
                <TableCell>FPL %</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Recommendation</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No cases pending approval</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((app) => (
                  <TableRow
                    key={app.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/approvals/${app.id}`)}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{app.id}</TableCell>
                    <TableCell>
                      {app.applicant?.firstName} {app.applicant?.lastName}
                    </TableCell>
                    <TableCell>{app.household?.fplPercentage || '-'}%</TableCell>
                    <TableCell>{formatDate(app.submittedAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.caseworkerRecommendation}
                        color={app.caseworkerRecommendation === 'Approve' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Button size="small" variant="outlined" onClick={() => navigate(`/approvals/${app.id}`)}>
                        Review
                      </Button>
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

export default PendingApprovals;
