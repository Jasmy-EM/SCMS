import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Menu, MenuItem, TextField, InputAdornment,
  FormControl, InputLabel, Select, Tabs, Tab,
} from '@mui/material';
import {
  Add as AddIcon, MoreVert as MoreIcon, Search as SearchIcon,
  Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon,
} from '@mui/icons-material';
import { useApplications } from '../../context/ApplicationContext';
import { APPLICATION_STATUS, statusConfig } from '../../data/mockApplications';
import { formatDate } from '../../utils/formatters';

const MyApplications = () => {
  const navigate = useNavigate();
  const { applications, deleteApplication } = useApplications();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  const handleMenuOpen = (event, app) => {
    setMenuAnchor(event.currentTarget);
    setSelectedApp(app);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedApp(null);
  };

  const handleDelete = () => {
    if (selectedApp) {
      deleteApplication(selectedApp.id);
    }
    handleMenuClose();
  };

  const getFilteredApplications = () => {
    let filtered = applications;

    // Tab filter
    if (tabValue === 1) {
      filtered = filtered.filter(a =>
        [APPLICATION_STATUS.SUBMITTED, APPLICATION_STATUS.UNDER_REVIEW, APPLICATION_STATUS.PENDING_APPROVAL].includes(a.status)
      );
    } else if (tabValue === 2) {
      filtered = filtered.filter(a => a.status === APPLICATION_STATUS.INFO_REQUESTED);
    } else if (tabValue === 3) {
      filtered = filtered.filter(a =>
        [APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED].includes(a.status)
      );
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
        a.children?.some(c => c.firstName?.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  };

  const filteredApplications = getFilteredApplications();

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">My Applications</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/applications/new')}>
          New Application
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`All (${applications.length})`} />
          <Tab label={`Active (${applications.filter(a => [APPLICATION_STATUS.SUBMITTED, APPLICATION_STATUS.UNDER_REVIEW, APPLICATION_STATUS.PENDING_APPROVAL].includes(a.status)).length})`} />
          <Tab label={`Needs Action (${applications.filter(a => a.status === APPLICATION_STATUS.INFO_REQUESTED).length})`} />
          <Tab label="Completed" />
        </Tabs>

        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.entries(statusConfig).map(([status, config]) => (
                <MenuItem key={status} value={status}>{config.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Application ID</TableCell>
                <TableCell>Child(ren)</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No applications found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => (
                  <TableRow key={app.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/applications/${app.id}`)}>
                    <TableCell sx={{ fontWeight: 500 }}>{app.id}</TableCell>
                    <TableCell>
                      {app.children?.map(c => c.firstName).join(', ') || '-'}
                    </TableCell>
                    <TableCell>{app.provider?.name || '-'}</TableCell>
                    <TableCell>{app.submittedAt ? formatDate(app.submittedAt) : '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig[app.status]?.label}
                        color={statusConfig[app.status]?.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, app)}>
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { navigate(`/applications/${selectedApp?.id}`); handleMenuClose(); }}>
          <ViewIcon sx={{ mr: 1 }} /> View Details
        </MenuItem>
        {selectedApp?.status === APPLICATION_STATUS.DRAFT && (
          <MenuItem onClick={() => { navigate(`/applications/new?draft=${selectedApp?.id}`); handleMenuClose(); }}>
            <EditIcon sx={{ mr: 1 }} /> Continue Editing
          </MenuItem>
        )}
        {selectedApp?.status === APPLICATION_STATUS.DRAFT && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} /> Delete Draft
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default MyApplications;
