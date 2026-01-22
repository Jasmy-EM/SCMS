# SCMS Demo - State Childcare Management System

A React-based demo UI for the State Childcare Management System, showcasing the application workflow for childcare subsidy management.

## Features

- **5 User Personas**: Parent, Caseworker, Supervisor, Manager, Admin
- **8-Step Application Wizard**: Complete application submission flow
- **Provider Directory**: Search and filter childcare providers
- **Case Management**: Review, approve, and manage applications
- **Role-Based Dashboards**: Tailored views for each user type

## Tech Stack

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

## Project Structure

```
scms-demo/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── application/steps/    # Application wizard steps
│   │   ├── common/               # Shared components
│   │   └── layout/               # Header, Sidebar, MainLayout
│   ├── context/                  # React Context providers
│   ├── data/                     # Mock data
│   ├── pages/
│   │   ├── admin/                # Admin pages
│   │   ├── caseworker/           # Caseworker pages
│   │   ├── manager/              # Manager pages
│   │   ├── parent/               # Parent pages
│   │   ├── shared/               # Shared pages (Providers, Notifications)
│   │   └── supervisor/           # Supervisor pages
│   ├── theme/                    # MUI theme configuration
│   ├── utils/                    # Utility functions
│   ├── App.js
│   ├── index.js
│   └── routes.js
└── package.json
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run eject` | Eject from Create React App |

## Notes

- This is a **demo/prototype** with mock data
- No backend integration - data is stored in React state and localStorage
- Draft applications are persisted in localStorage
