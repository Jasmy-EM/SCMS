import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { ROLES } from './data/mockUsers';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';
import MyApplications from './pages/parent/MyApplications';
import NewApplication from './pages/parent/NewApplication';
import ApplicationDetail from './pages/parent/ApplicationDetail';

// Caseworker Pages
import CaseworkerDashboard from './pages/caseworker/CaseworkerDashboard';
import MyCases from './pages/caseworker/MyCases';
import CaseReview from './pages/caseworker/CaseReview';

// Supervisor Pages
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import PendingApprovals from './pages/supervisor/PendingApprovals';
import ApprovalReview from './pages/supervisor/ApprovalReview';
import TeamCases from './pages/supervisor/TeamCases';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import Reports from './pages/manager/Reports';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import SystemSettings from './pages/admin/SystemSettings';

// Shared Pages
import ProviderDirectory from './pages/shared/ProviderDirectory';
import ProviderDetail from './pages/shared/ProviderDetail';
import Notifications from './pages/shared/Notifications';

export const getRoutes = (currentRole) => {
  const getDashboard = () => {
    switch (currentRole) {
      case ROLES.PARENT:
        return <ParentDashboard />;
      case ROLES.CASEWORKER:
        return <CaseworkerDashboard />;
      case ROLES.SUPERVISOR:
        return <SupervisorDashboard />;
      case ROLES.MANAGER:
        return <ManagerDashboard />;
      case ROLES.ADMIN:
        return <AdminDashboard />;
      default:
        return <ParentDashboard />;
    }
  };

  return [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: getDashboard() },
        // Parent routes
        { path: 'applications', element: <MyApplications /> },
        { path: 'applications/new', element: <NewApplication /> },
        { path: 'applications/:id', element: <ApplicationDetail /> },
        // Caseworker routes
        { path: 'cases', element: <MyCases /> },
        { path: 'cases/:id', element: <CaseReview /> },
        // Supervisor routes
        { path: 'approvals', element: <PendingApprovals /> },
        { path: 'approvals/:id', element: <ApprovalReview /> },
        { path: 'team-cases', element: <TeamCases /> },
        // Manager routes
        { path: 'reports', element: <Reports /> },
        // Admin routes
        { path: 'users', element: <UserManagement /> },
        { path: 'settings', element: <SystemSettings /> },
        // Shared routes
        { path: 'providers', element: <ProviderDirectory /> },
        { path: 'providers/:id', element: <ProviderDetail /> },
        { path: 'notifications', element: <Notifications /> },
        // Catch all
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ];
};
