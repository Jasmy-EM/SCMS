import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockApplications, getDraftApplication, APPLICATION_STATUS } from '../data/mockApplications';

const ApplicationContext = createContext(null);

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) throw new Error('useApplications must be used within ApplicationProvider');
  return context;
};

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState(mockApplications);
  const [currentDraft, setCurrentDraft] = useState(() => {
    const saved = localStorage.getItem('scms_draft_application');
    return saved ? JSON.parse(saved) : null;
  });

  const getApplicationById = useCallback((id) => applications.find(app => app.id === id), [applications]);

  const getApplicationsByStatus = useCallback((status) => applications.filter(app => app.status === status), [applications]);

  const getApplicationsForUser = useCallback(() => {
    return applications.filter(app => app.applicant?.lastName === 'Johnson');
  }, [applications]);

  const getAssignedCases = useCallback((caseworkerId) => {
    return applications.filter(app => app.assignedCaseworker === caseworkerId);
  }, [applications]);

  const getPendingApprovals = useCallback(() => {
    return applications.filter(app => app.status === APPLICATION_STATUS.PENDING_APPROVAL);
  }, [applications]);

  const startNewApplication = useCallback(() => {
    const draft = getDraftApplication();
    setCurrentDraft(draft);
    localStorage.setItem('scms_draft_application', JSON.stringify(draft));
    return draft;
  }, []);

  const updateDraft = useCallback((updates) => {
    setCurrentDraft(prev => {
      const updated = { ...prev, ...updates, lastSaved: new Date().toISOString() };
      localStorage.setItem('scms_draft_application', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const submitApplication = useCallback(() => {
    if (!currentDraft) return null;
    const newId = `APP-2026-${String(applications.length + 1).padStart(5, '0')}`;
    const newApplication = {
      ...currentDraft,
      id: newId,
      status: APPLICATION_STATUS.SUBMITTED,
      submittedAt: new Date().toISOString(),
      history: [{ action: 'Application Submitted', performedBy: 'Sarah Johnson', timestamp: new Date().toISOString() }],
    };
    setApplications(prev => [...prev, newApplication]);
    setCurrentDraft(null);
    localStorage.removeItem('scms_draft_application');
    return newApplication;
  }, [currentDraft, applications.length]);

  const updateApplicationStatus = useCallback((applicationId, newStatus, additionalData = {}) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: newStatus,
          lastUpdated: new Date().toISOString(),
          ...additionalData,
          history: [...(app.history || []), { action: `Status changed to ${newStatus}`, performedBy: 'Current User', timestamp: new Date().toISOString() }],
        };
      }
      return app;
    }));
  }, []);

  const addCaseNote = useCallback((applicationId, note) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return { ...app, notes: [...(app.notes || []), { id: `note-${Date.now()}`, ...note, createdAt: new Date().toISOString() }] };
      }
      return app;
    }));
  }, []);

  const value = {
    applications,
    currentDraft,
    getApplicationById,
    getApplicationsByStatus,
    getApplicationsForUser,
    getAssignedCases,
    getPendingApprovals,
    startNewApplication,
    updateDraft,
    submitApplication,
    updateApplicationStatus,
    addCaseNote,
  };

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
};
