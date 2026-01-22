import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Stepper, Step, StepLabel, Button, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { useApplications } from '../../context/ApplicationContext';

// Import step components
import ApplicantInfoStep from '../../components/application/steps/ApplicantInfoStep';
import HouseholdInfoStep from '../../components/application/steps/HouseholdInfoStep';
import EmploymentInfoStep from '../../components/application/steps/EmploymentInfoStep';
import ChildrenInfoStep from '../../components/application/steps/ChildrenInfoStep';
import ProviderSelectionStep from '../../components/application/steps/ProviderSelectionStep';
import DocumentUploadStep from '../../components/application/steps/DocumentUploadStep';
import CertificationStep from '../../components/application/steps/CertificationStep';
import ReviewSubmitStep from '../../components/application/steps/ReviewSubmitStep';

// Steps configuration matching form builder spec
const steps = [
  { label: 'Personal & Contact', component: ApplicantInfoStep },
  { label: 'Household', component: HouseholdInfoStep },
  { label: 'Employment', component: EmploymentInfoStep },
  { label: 'Children', component: ChildrenInfoStep },
  { label: 'Provider', component: ProviderSelectionStep },
  { label: 'Documents', component: DocumentUploadStep },
  { label: 'Certification', component: CertificationStep },
  { label: 'Review & Submit', component: ReviewSubmitStep },
];

const NewApplication = () => {
  const navigate = useNavigate();
  const { currentDraft, updateDraft, submitApplication, startNewApplication } = useApplications();

  // Initialize draft if none exists
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (currentDraft) {
      setDraft(currentDraft);
    } else {
      const newDraft = startNewApplication();
      setDraft(newDraft);
    }
  }, []);

  // Update local draft when context changes
  useEffect(() => {
    if (currentDraft) {
      setDraft(currentDraft);
    }
  }, [currentDraft]);

  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Update active step when draft loads
  useEffect(() => {
    if (draft?.currentStep) {
      setActiveStep(draft.currentStep);
    }
  }, [draft?.currentStep]);

  const handleNext = () => {
    // Validate current step
    const StepComponent = steps[activeStep].component;
    if (StepComponent.validate) {
      const stepErrors = StepComponent.validate(draft || {});
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }
    setErrors({});

    if (activeStep === steps.length - 1) {
      setShowSubmitDialog(true);
    } else {
      const newStep = activeStep + 1;
      setActiveStep(newStep);
      updateDraft({ currentStep: newStep });
    }
  };

  const handleBack = () => {
    const newStep = activeStep - 1;
    setActiveStep(newStep);
    updateDraft({ currentStep: newStep });
    setErrors({});
  };

  const handleSubmit = () => {
    const newApp = submitApplication();
    setShowSubmitDialog(false);
    if (newApp) {
      navigate(`/applications/${newApp.id}`, { state: { justSubmitted: true } });
    }
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const handleSaveAndExit = () => {
    navigate('/applications');
  };

  const handleDiscardAndExit = () => {
    localStorage.removeItem('scms_draft_application');
    navigate('/applications');
  };

  // Show loading while draft initializes
  if (!draft) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const StepContent = steps[activeStep].component;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">New Application</Typography>
        <Button variant="outlined" onClick={handleExit}>Save & Exit</Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Please correct the errors below before continuing.
          </Alert>
        )}

        <StepContent
          data={draft}
          onChange={updateDraft}
          errors={errors}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Submit Application' : 'Continue'}
          </Button>
        </Box>
      </Paper>

      {/* Exit Dialog */}
      <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)}>
        <DialogTitle>Save your progress?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your application has been automatically saved as a draft. Would you like to continue later or discard this application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscardAndExit} color="error">Discard</Button>
          <Button onClick={handleSaveAndExit} variant="contained">Save & Exit</Button>
        </DialogActions>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Submit Application?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Once submitted, you will not be able to make changes to your application. A caseworker will review your application and may contact you if additional information is needed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewApplication;
