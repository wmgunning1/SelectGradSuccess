import { SxProps, Theme } from '@mui/material/styles';

export const tableContainer: SxProps<Theme> = {
  backgroundColor: 'white',
  color: '#333',
  padding: 4,
  margin: 4,
  borderRadius: 3,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

export const loadingContainer: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
};

export const errorContainer: SxProps<Theme> = {
  backgroundColor: '#fee',
  border: '1px solid #fcc',
  borderRadius: 1,
  padding: 2,
  margin: 2,
  color: '#c33',
};

export const filtersContainer: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  marginBottom: 3,
  flexWrap: 'wrap',
};

export const connectionMethodContainer: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  marginBottom: 3,
  flexWrap: 'wrap',
};

export const tableHeader: SxProps<Theme> = {
  backgroundColor: '#f5f5f5',
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#e8e8e8',
  },
};

export const tableRow: SxProps<Theme> = {
  '&:hover': {
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
  },
};

export const successScoreLow: SxProps<Theme> = {
  color: '#d32f2f',
};

export const successScoreMedium: SxProps<Theme> = {
  color: '#f57c00',
};

export const successScoreHigh: SxProps<Theme> = {
  color: '#388e3c',
};
