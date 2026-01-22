import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#005EA2',
      dark: '#1A4480',
      light: '#73B3E7',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1A4480',
      dark: '#162E51',
      light: '#2378C3',
    },
    success: {
      main: '#00A91C',
      light: '#70E17B',
      dark: '#008817',
    },
    warning: {
      main: '#FFBE2E',
      light: '#FFE396',
      dark: '#E5A000',
    },
    error: {
      main: '#D54309',
      light: '#F39268',
      dark: '#B50909',
    },
    info: {
      main: '#00BDE3',
      light: '#99DEEA',
      dark: '#009EC1',
    },
    background: {
      default: '#F0F0F0',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1B1B1B',
      secondary: '#5C5C5C',
    },
  },
  typography: {
    fontFamily: '"Source Sans 3", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 700 },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    h4: { fontSize: '1.125rem', fontWeight: 600 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { padding: '10px 20px', minHeight: 44 },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 1px 3px rgba(0,0,0,0.12)' },
      },
    },
  },
});

export default theme;
