import { SxProps, Theme } from '@mui/material/styles';

export const detailContainer: SxProps<Theme> = {
  backgroundColor: 'white',
  padding: 4,
  margin: 2,
  borderRadius: 3,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  position: 'relative',
};

export const headerContainer: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
  paddingBottom: 2,
  borderBottom: '1px solid #e0e0e0',
};

export const navigationButtons: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
  position: 'absolute',
  top: 32,
  right: 32,
  zIndex: 10,
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

export const infoCard: SxProps<Theme> = {
  backgroundColor: '#f8f9fa',
  padding: 3,
  borderRadius: 2,
  marginBottom: 3,
};

export const successScoreHigh: SxProps<Theme> = {
  color: '#388e3c',
};

export const successScoreMedium: SxProps<Theme> = {
  color: '#f57c00',
};

export const successScoreLow: SxProps<Theme> = {
  color: '#d32f2f',
};

export const metricItem: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingY: 1,
  borderBottom: '1px solid #e0e0e0',
  '&:last-child': {
    borderBottom: 'none',
  },
};

export const metricLabel: SxProps<Theme> = {
  fontWeight: 'medium',
  color: '#666',
};

export const metricValue: SxProps<Theme> = {
  fontWeight: 'bold',
  color: '#333',
};

// Comparison table styles
export const comparisonTableContainer: SxProps<Theme> = {
  marginTop: 4,
  marginBottom: 4,
};

export const comparisonTable: SxProps<Theme> = {
  '& .MuiTableHead-root': {
    backgroundColor: '#f5f5f5',
  },
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
    fontSize: '0.875rem',
    color: '#333',
    padding: '12px 8px',
    '&:first-of-type': {
      width: '300px',
      minWidth: '300px',
    },
    '&:nth-of-type(2)': {
      width: '120px',
      minWidth: '120px',
    },
    '&:nth-of-type(3)': {
      width: '140px',
      minWidth: '140px',
    },
    '&:nth-of-type(4)': {
      width: '120px',
      minWidth: '120px',
    },
    '&:nth-of-type(5)': {
      width: '120px',
      minWidth: '120px',
    },
    '&:nth-of-type(6)': {
      width: '120px',
      minWidth: '120px',
    },
  },
  '& .MuiTableCell-body': {
    fontSize: '0.875rem',
    padding: '8px',
    borderBottom: '1px solid #e0e0e0',
    '&:first-of-type': {
      width: '300px',
      minWidth: '300px',
    },
    '&:nth-of-type(2)': {
      width: '120px',
      minWidth: '120px',
    },
    '&:nth-of-type(3)': {
      width: '140px',
      minWidth: '140px',
    },
    '&:nth-of-type(4)': {
      width: '120px',
      minWidth: '120px',
    },
    '&:nth-of-type(5)': {
      width: '120px',
      minWidth: '120px',
    },
    '&:nth-of-type(6)': {
      width: '120px',
      minWidth: '120px',
    },
  },
};

export const categoryRow: SxProps<Theme> = {
  backgroundColor: '#f8f9fa',
  '& .MuiTableCell-root': {
    fontWeight: 'bold',
    fontSize: '0.9rem',
    color: '#333',
  },
};

export const metricRow: SxProps<Theme> = {
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
};

export const successScoreCell: SxProps<Theme> = {
  fontWeight: 'bold',
  textAlign: 'center',
};

export const riskFactorCell: SxProps<Theme> = {
  textAlign: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
};

export const weightingCell: SxProps<Theme> = {
  textAlign: 'center',
  fontWeight: 'medium',
};

export const dropdownHeader: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  backgroundColor: '#f0f0f0',
  borderRadius: '4px',
  cursor: 'pointer',
  marginBottom: 2,
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
};

export const producerSelectorContainer: SxProps<Theme> = {
  marginBottom: 3,
  padding: 2,
  backgroundColor: '#f8f9fa',
  borderRadius: 2,
};

export const tenureInfo: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  marginBottom: 2,
};

export const flagsContainer: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};
