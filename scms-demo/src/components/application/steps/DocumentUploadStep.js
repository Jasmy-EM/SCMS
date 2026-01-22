import React, { useState } from 'react';
import {
  Box, Grid, Typography, Button, Card, CardContent, IconButton,
  Chip, Alert, LinearProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon, Description as DocIcon,
  Delete as DeleteIcon, CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Document types per form builder spec (Step 7)
const getRequiredDocuments = (data) => {
  const docs = [
    {
      type: 'income_proof',
      label: 'Proof of Income',
      description: 'Pay stubs, tax returns, etc.',
      required: true,
    },
    {
      type: 'identity_document',
      label: 'Identity Document',
      description: "Driver's license or State ID",
      required: true,
    },
    {
      type: 'residency_proof',
      label: 'Proof of Residency',
      description: 'Utility bill or lease agreement',
      required: true,
    },
  ];

  // Employment verification conditional on employment status
  const employmentStatus = data.employment?.status;
  if (['Full-Time', 'Part-Time', 'Self-Employed'].includes(employmentStatus)) {
    docs.push({
      type: 'employment_verification',
      label: 'Employment Verification',
      description: 'Employer letter, work schedule',
      required: true,
      conditional: true,
    });
  }

  // Birth certificate and immunization per child
  const children = data.children || [];
  children.forEach((child, index) => {
    docs.push({
      type: `birth_certificate_${index}`,
      label: `Birth Certificate - ${child.firstName || `Child ${index + 1}`}`,
      description: 'Birth certificate or passport',
      required: true,
      childIndex: index,
    });
    docs.push({
      type: `immunization_${index}`,
      label: `Immunization Records - ${child.firstName || `Child ${index + 1}`}`,
      description: 'Immunization records',
      required: true,
      childIndex: index,
    });
  });

  // Special needs documentation if any child has special needs
  const hasSpecialNeeds = children.some(c => c.specialNeeds);
  if (hasSpecialNeeds) {
    docs.push({
      type: 'special_needs_documentation',
      label: 'Special Needs Documentation',
      description: 'Medical or educational documentation',
      required: true,
      conditional: true,
    });
  }

  return docs;
};

const DocumentUploadStep = ({ data, onChange, errors }) => {
  const documents = data.documents || [];
  const [uploading, setUploading] = useState(null);

  const requiredDocs = getRequiredDocuments(data);

  const handleFileUpload = (docType) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload PDF, JPG, JPEG, or PNG files only.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum file size is 10MB.');
      return;
    }

    setUploading(docType);

    // Simulate upload delay
    setTimeout(() => {
      const newDoc = {
        id: `doc-${Date.now()}`,
        type: docType,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        status: 'pending',
        uploadedAt: new Date().toISOString(),
      };

      // Remove any existing document of the same type
      const filteredDocs = documents.filter(d => d.type !== docType);

      onChange({
        documents: [...filteredDocs, newDoc],
      });
      setUploading(null);
    }, 1000);
  };

  const handleRemoveDocument = (docId) => {
    onChange({
      documents: documents.filter(d => d.id !== docId),
    });
  };

  const getDocumentByType = (type) => {
    return documents.find(d => d.type === type);
  };

  const requiredDocsUploaded = requiredDocs.filter(d => getDocumentByType(d.type)).length;
  const progress = requiredDocs.length > 0 ? (requiredDocsUploaded / requiredDocs.length) * 100 : 0;

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Box>
      {/* Step 7: Document Upload */}
      <Typography variant="h6" gutterBottom>Document Upload</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload the required documents to verify your eligibility. All documents must be in PDF, JPG, JPEG, or PNG format (max 10MB per file).
      </Typography>

      {/* Progress Card */}
      <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2">
            Document Progress: {requiredDocsUploaded} of {requiredDocs.length} required documents
          </Typography>
          <Chip
            label={progress === 100 ? 'Complete' : 'Incomplete'}
            color={progress === 100 ? 'success' : 'warning'}
            size="small"
          />
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
      </Card>

      {typeof errors?.documents === 'string' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.documents}
        </Alert>
      )}

      {/* Document Checklist */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Document Checklist
      </Typography>

      <Grid container spacing={2}>
        {requiredDocs.map((doc) => {
          const uploaded = getDocumentByType(doc.type);
          const isUploading = uploading === doc.type;

          return (
            <Grid item xs={12} sm={6} key={doc.type}>
              <Card
                variant="outlined"
                sx={{
                  borderColor: uploaded ? 'success.main' : 'divider',
                  bgcolor: uploaded ? 'success.50' : 'background.paper',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {uploaded ? (
                          <CheckIcon color="success" fontSize="small" />
                        ) : (
                          <WarningIcon color="warning" fontSize="small" />
                        )}
                        <Typography variant="subtitle2">{doc.label}</Typography>
                        <Chip
                          label={doc.required ? 'Required' : 'Optional'}
                          size="small"
                          color={doc.required ? 'error' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {doc.description}
                      </Typography>
                      {doc.conditional && (
                        <Typography variant="caption" color="info.main" display="block">
                          (Based on your application details)
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {uploaded ? (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                        <DocIcon fontSize="small" color="action" />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="body2" noWrap>
                            {uploaded.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(uploaded.size)}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveDocument(uploaded.id)}
                        title="Remove document"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 2 }}>
                      <input
                        type="file"
                        id={`upload-${doc.type}`}
                        style={{ display: 'none' }}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload(doc.type)}
                      />
                      <label htmlFor={`upload-${doc.type}`}>
                        <Button
                          variant="outlined"
                          component="span"
                          size="small"
                          startIcon={<UploadIcon />}
                          disabled={isUploading}
                        >
                          {isUploading ? 'Uploading...' : 'Upload'}
                        </Button>
                      </label>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Accepted formats:</strong> PDF, JPG, JPEG, PNG (max 10MB per file)
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Make sure documents are clearly readable. Blurry or cropped documents may be rejected during review.
        </Typography>
      </Alert>
    </Box>
  );
};

DocumentUploadStep.validate = (data) => {
  const errors = {};
  const documents = data.documents || [];
  const requiredDocs = getRequiredDocuments(data);

  const missingRequired = requiredDocs.filter(
    req => req.required && !documents.find(d => d.type === req.type)
  );

  if (missingRequired.length > 0) {
    errors.documents = `Missing required documents: ${missingRequired.map(d => d.label).join(', ')}`;
  }

  return errors;
};

export default DocumentUploadStep;
