import { SxProps, Theme } from '@mui/material/styles';

export const dashboardContainer: SxProps<Theme> = {
  minHeight: '100vh',
  position: 'relative',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
  backgroundImage: `
    radial-gradient(circle at 20% 80%, rgba(120, 113, 255, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 184, 77, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 113, 255, 0.2) 0%, transparent 50%)
  `,
  backgroundAttachment: 'fixed',
  padding: 0,
  overflow: 'hidden',
};

export const backgroundOverlay: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(59, 130, 246, 0.8) 50%, rgba(6, 182, 212, 0.7) 100%)',
  zIndex: 1,
};

export const heroSection: SxProps<Theme> = {
  position: 'relative',
  zIndex: 2,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  py: 8,
};

export const utechLogo: SxProps<Theme> = {
  height: 'auto',
  width: '240px',
  maxWidth: '100%',
  mb: 4,
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
  },
};

export const dashboardTitle: SxProps<Theme> = {
  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
  fontWeight: 700,
  marginBottom: 3,
  color: 'white',
  textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
  letterSpacing: '-0.02em',
};

export const dashboardSubtitle: SxProps<Theme> = {
  fontSize: { xs: '1.1rem', md: '1.3rem' },
  marginBottom: 4,
  maxWidth: '700px',
  marginLeft: 'auto',
  marginRight: 'auto',
  opacity: 0.95,
  color: 'white',
  textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
  lineHeight: 1.6,
};

export const featureCard: SxProps<Theme> = {
  height: '100%',
  borderRadius: 3,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    background: 'rgba(255, 255, 255, 1)',
    '& .MuiSvgIcon-root': {
      transform: 'scale(1.1)',
      color: '#2563eb',
    },
  },
  '&:active': {
    transform: 'translateY(-4px)',
  },
};

export const featureIcon: SxProps<Theme> = {
  fontSize: '3rem',
  color: '#3b82f6',
  transition: 'all 0.3s ease',
};

export const buttonContainer: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  flexWrap: 'wrap',
  maxWidth: '900px',
  width: '100%',
};

export const navButton: SxProps<Theme> = {
  borderRadius: 3,
  fontSize: '1.1rem',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  minWidth: { xs: '280px', md: '200px' },
  height: '56px',
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',

  // Primary button (contained)
  '&.MuiButton-contained': {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(59, 130, 246, 0.6)',
    },
  },

  // Secondary button (outlined)
  '&.MuiButton-outlined': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    },
  },

  // Text button
  '&.MuiButton-text': {
    color: 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
};
