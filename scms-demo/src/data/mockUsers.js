export const ROLES = {
  PARENT: 'parent',
  CASEWORKER: 'caseworker',
  SUPERVISOR: 'supervisor',
  MANAGER: 'manager',
  ADMIN: 'admin',
};

export const mockUsers = {
  [ROLES.PARENT]: {
    id: 'usr-001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    role: ROLES.PARENT,
    phone: '(614) 555-1234',
  },
  [ROLES.CASEWORKER]: {
    id: 'usr-002',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@state.gov',
    role: ROLES.CASEWORKER,
    assignedCases: 24,
    county: 'Franklin',
  },
  [ROLES.SUPERVISOR]: {
    id: 'usr-003',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    email: 'jennifer.martinez@state.gov',
    role: ROLES.SUPERVISOR,
    county: 'Franklin',
  },
  [ROLES.MANAGER]: {
    id: 'usr-004',
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@state.gov',
    role: ROLES.MANAGER,
  },
  [ROLES.ADMIN]: {
    id: 'usr-admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@state.gov',
    role: ROLES.ADMIN,
  },
};

export const roleLabels = {
  [ROLES.PARENT]: 'Parent / Guardian',
  [ROLES.CASEWORKER]: 'Caseworker',
  [ROLES.SUPERVISOR]: 'Supervisor',
  [ROLES.MANAGER]: 'Program Manager',
  [ROLES.ADMIN]: 'System Administrator',
};
