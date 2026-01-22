import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent, Button,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, Divider, Alert, Tabs, Tab,
  List, ListItem, ListItemText, ListItemSecondaryAction,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { systemSettings, featureFlags, eligibilityConfig } from '../../data/mockConfig';

const SystemSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState(systemSettings);
  const [flags, setFlags] = useState(featureFlags);
  const [eligibility, setEligibility] = useState(eligibilityConfig);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">System Settings</Typography>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
          Save Changes
        </Button>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully.
        </Alert>
      )}

      <Paper>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="General" />
          <Tab label="Eligibility" />
          <Tab label="Feature Flags" />
          <Tab label="Notifications" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Processing Settings</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TextField
                      fullWidth
                      label="SLA Processing Days"
                      type="number"
                      value={settings.slaProcessingDays}
                      onChange={(e) => setSettings({ ...settings, slaProcessingDays: parseInt(e.target.value) })}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Max File Upload Size"
                      value={settings.maxFileUploadSize}
                      onChange={(e) => setSettings({ ...settings, maxFileUploadSize: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Session Timeout"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>System Status</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.maintenanceMode}
                          onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                        />
                      }
                      label="Maintenance Mode"
                    />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 6, mt: -1 }}>
                      When enabled, only administrators can access the system.
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Allowed File Types</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TextField
                      fullWidth
                      label="Allowed Extensions"
                      value={settings.allowedFileTypes.join(', ')}
                      onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value.split(', ') })}
                      helperText="Comma-separated list of file extensions"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Income Eligibility</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TextField
                      fullWidth
                      label="FPL Threshold Level 1 (%)"
                      type="number"
                      value={eligibility.fplThresholds.level1}
                      onChange={(e) => setEligibility({
                        ...eligibility,
                        fplThresholds: { ...eligibility.fplThresholds, level1: parseInt(e.target.value) }
                      })}
                      sx={{ mb: 2 }}
                      helperText="Full subsidy eligibility threshold"
                    />
                    <TextField
                      fullWidth
                      label="FPL Threshold Level 2 (%)"
                      type="number"
                      value={eligibility.fplThresholds.level2}
                      onChange={(e) => setEligibility({
                        ...eligibility,
                        fplThresholds: { ...eligibility.fplThresholds, level2: parseInt(e.target.value) }
                      })}
                      sx={{ mb: 2 }}
                      helperText="Partial subsidy eligibility threshold"
                    />
                    <TextField
                      fullWidth
                      label="FPL Threshold Level 3 (%)"
                      type="number"
                      value={eligibility.fplThresholds.level3}
                      onChange={(e) => setEligibility({
                        ...eligibility,
                        fplThresholds: { ...eligibility.fplThresholds, level3: parseInt(e.target.value) }
                      })}
                      helperText="Minimum subsidy eligibility threshold"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Work Requirements</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TextField
                      fullWidth
                      label="Minimum Work Hours (per week)"
                      type="number"
                      value={eligibility.minimumWorkHours}
                      onChange={(e) => setEligibility({ ...eligibility, minimumWorkHours: parseInt(e.target.value) })}
                      sx={{ mb: 2 }}
                    />
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Child Eligibility</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TextField
                      fullWidth
                      label="Maximum Child Age"
                      type="number"
                      value={eligibility.maxChildAge}
                      onChange={(e) => setEligibility({ ...eligibility, maxChildAge: parseInt(e.target.value) })}
                      sx={{ mb: 2 }}
                      helperText="Children must be under this age"
                    />
                    <TextField
                      fullWidth
                      label="Minimum Child Age (months)"
                      type="number"
                      value={eligibility.minChildAge}
                      onChange={(e) => setEligibility({ ...eligibility, minChildAge: parseInt(e.target.value) })}
                      helperText="Minimum age in months"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {tabValue === 2 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Feature Flags</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Enable or disable features across the system.
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {Object.entries(flags).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        secondary={getFeatureDescription(key)}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={value}
                          onChange={(e) => setFlags({ ...flags, [key]: e.target.checked })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Email Notifications</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Application Submitted"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Application Status Change"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Document Request"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Application Approved"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Application Rejected"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Staff Notifications</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="New Case Assignment"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="SLA Warning (2 days)"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="SLA Overdue"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Pending Approval"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

const getFeatureDescription = (key) => {
  const descriptions = {
    onlineApplications: 'Allow parents to submit applications online',
    documentUpload: 'Allow document uploads through the portal',
    providerSearch: 'Enable provider search functionality',
    notifications: 'Enable system notifications',
    reporting: 'Enable reporting and analytics features',
  };
  return descriptions[key] || '';
};

export default SystemSettings;
