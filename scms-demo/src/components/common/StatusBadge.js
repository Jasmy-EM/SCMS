import React from 'react';
import { Chip } from '@mui/material';
import { statusConfig } from '../../data/mockApplications';

const StatusBadge = ({ status, size = 'small' }) => {
  const config = statusConfig[status] || { label: status, color: 'default' };
  return <Chip label={config.label} color={config.color} size={size} sx={{ fontWeight: 600 }} />;
};

export default StatusBadge;
