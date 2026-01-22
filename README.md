# SCMS - State Childcare Management System

A comprehensive childcare subsidy management system for state agencies to process applications, manage cases, and administer childcare assistance programs.

## Project Structure

```
SCMS/
├── scms-demo/                 # React Demo UI
├── MVP/                       # MVP documentation & architecture
├── Claude.ai_Questions_Answers/  # Requirements analysis
├── SCMS_Form_Builder_Configuration_All_Modules.csv  # Form field definitions
├── SCMS_Complete_System_Documentation.md
└── Requirements Document_ State Childcare Management System (SCMS).docx
```

## Demo Application

The `scms-demo` folder contains a fully functional React prototype demonstrating the UI for all user personas.

### Features

- **5 User Personas**: Parent, Caseworker, Supervisor, Manager, Admin
- **8-Step Application Wizard**: Matches form builder configuration
- **Provider Directory**: Search and filter childcare providers
- **Case Management**: Review, approve, and manage applications
- **Role-Based Dashboards**: Tailored views for each user type

### Tech Stack

- React 18
- Material UI (MUI) v5
- React Router v6
- Context API for state management

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Navigate to the demo app
cd scms-demo

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## User Personas

Switch between personas using the dropdown in the header:

| Persona | Description |
|---------|-------------|
| **Parent** | Submit applications, track status, find providers |
| **Caseworker** | Review applications, verify documents, manage cases |
| **Supervisor** | Approve/reject applications, oversee team |
| **Manager** | View reports, monitor metrics |
| **Admin** | Manage users, configure system settings |

## Application Wizard Steps

1. **Personal & Contact Info** - Applicant details and address
2. **Household Information** - Household size and income
3. **Employment** - Employment status and work schedule
4. **Children** - Child information (up to 4 children)
5. **Provider Selection** - Choose childcare provider
6. **Documents** - Upload required documents
7. **Certification** - Review and sign certifications
8. **Review & Submit** - Final review before submission

## Documentation

- [Complete System Documentation](SCMS_Complete_System_Documentation.md)
- [Form Builder Configuration](SCMS_Form_Builder_Configuration_All_Modules.csv)
- [MVP Implementation Plan](MVP/SCMS%20MVP%20Implementation%20Plan.docx)
