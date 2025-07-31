import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

import MainLayout from '@/layout/MainLayout';

const SharePointComponent = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">SharePoint Integration</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Home
          </Button>
          <Button variant="outlined" onClick={() => navigate('/select-grad-success')}>
            Back to Dashboard
          </Button>
        </Box>
      </Box>
      <Typography>SharePoint integration functionality will be implemented here.</Typography>
    </Box>
  );
};

const SharePoint = () => <MainLayout pageContent={<SharePointComponent />} />;

export default SharePoint;
