import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockUsers, ROLES } from '../data/mockUsers';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(ROLES.PARENT);
  const [user, setUser] = useState(mockUsers[ROLES.PARENT]);

  const switchRole = useCallback((role) => {
    setCurrentRole(role);
    setUser(mockUsers[role]);
  }, []);

  const value = {
    user,
    currentRole,
    switchRole,
    isParent: currentRole === ROLES.PARENT,
    isCaseworker: currentRole === ROLES.CASEWORKER,
    isSupervisor: currentRole === ROLES.SUPERVISOR,
    isManager: currentRole === ROLES.MANAGER,
    isAdmin: currentRole === ROLES.ADMIN,
    isStaff: [ROLES.CASEWORKER, ROLES.SUPERVISOR, ROLES.MANAGER, ROLES.ADMIN].includes(currentRole),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
