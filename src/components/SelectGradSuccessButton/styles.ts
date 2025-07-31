import { SxProps, Theme } from '@mui/material/styles';

export const selectGradSuccessButton: SxProps<Theme> = {
  backgroundColor: '#1e40af',
  color: 'white',
  padding: '1rem 2rem',
  borderRadius: 2,
  fontSize: '1rem',
  textTransform: 'none',
  width: '100%',
  '&:hover': {
    backgroundColor: '#1e3a8a',
  },
};
