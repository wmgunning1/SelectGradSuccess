import { SxProps, Theme } from '@mui/material/styles';

export const dashboardContainer: SxProps<Theme> = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)',
  padding: 4,
  textAlign: 'center',
};

export const usiLogo: SxProps<Theme> = {
  backgroundColor: 'white',
  color: '#1e3a8a',
  padding: '0.5rem 1rem',
  borderRadius: 1,
  fontWeight: 'bold',
  display: 'inline-block',
  marginBottom: 2,
};

export const dashboardTitle: SxProps<Theme> = {
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: 2,
  color: 'white',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
};

export const dashboardSubtitle: SxProps<Theme> = {
  fontSize: '1.2rem',
  marginBottom: 6,
  maxWidth: '600px',
  marginLeft: 'auto',
  marginRight: 'auto',
  opacity: 0.9,
  color: 'white',
};

export const buttonContainer: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
};

export const navButton: SxProps<Theme> = {
  backgroundColor: '#1e40af',
  color: 'white',
  padding: '1rem 2rem',
  borderRadius: 2,
  fontSize: '1.1rem',
  transition: 'all 0.3s ease',
  minWidth: '300px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#1e3a8a',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
};
