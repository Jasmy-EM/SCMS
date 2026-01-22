export const eligibilityConfig = {
  fplPercentage: 200,
  fplByHouseholdSize: {
    1: 1255, 2: 1703, 3: 2150, 4: 2598, 5: 3046, 6: 3494, 7: 3941, 8: 4389, additional: 448,
  },
  minWorkHours: 20,
  childAgeMax: 13,
  childAgeMaxSpecialNeeds: 18,
};

export const systemSettings = {
  sessionTimeout: 30,
  sessionMaxDuration: 8,
  lockoutThreshold: 5,
  lockoutDuration: 30,
  draftRetention: 90,
  senderEmail: 'noreply@state.gov',
  senderName: 'State Childcare Program',
  portalUrl: 'https://scms.state.gov',
};

export const featureFlags = {
  smsNotificationsEnabled: true,
  emailNotificationsEnabled: true,
  draftAutoSaveEnabled: true,
  providerMapEnabled: true,
  providerRatingsEnabled: false,
};

export const documentTypes = [
  { code: 'income_proof', label: 'Proof of Income', required: true },
  { code: 'employment_verification', label: 'Employment Verification', required: true },
  { code: 'identity_document', label: 'Identity Document', required: true },
  { code: 'birth_certificate', label: 'Child Birth Certificate', required: true },
  { code: 'immunization_records', label: 'Immunization Records', required: true },
  { code: 'residency_proof', label: 'Proof of Residency', required: true },
  { code: 'special_needs_documentation', label: 'Special Needs Documentation', required: false },
];

export const rejectionReasons = [
  { code: 'INCOME_OVER_LIMIT', label: 'Income Over Limit' },
  { code: 'EMPLOYMENT_INSUFFICIENT', label: 'Employment Hours Insufficient' },
  { code: 'MISSING_DOCUMENTS', label: 'Missing Required Documents' },
  { code: 'RESIDENCY_INVALID', label: 'Residency Requirements Not Met' },
  { code: 'CHILD_AGE_INELIGIBLE', label: 'Child Age Ineligible' },
  { code: 'PROVIDER_INVALID', label: 'Selected Provider Invalid' },
  { code: 'OTHER', label: 'Other' },
];

export const announcements = [
  {
    id: 'ann-001',
    text: 'System maintenance scheduled for Sunday 2:00 AM - 4:00 AM EST',
    type: 'info',
    startDate: '2026-01-20',
    endDate: '2026-01-26',
    isActive: true,
  },
];
