import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

import MainLayout from '@/layout/MainLayout';

import { buttonContainer, dashboardContainer, dashboardSubtitle, dashboardTitle, navButton, usiLogo } from './styles';

const SelectGradSuccessComponent = () => {
  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate('/');
  };

  const handleNavigateToPredictor = () => {
    navigate('/select-grad-success/predictor');
  };

  const handleNavigateToTable = () => {
    navigate('/select-grad-success/predictor');
  };

  const handleNavigateToSharePoint = () => {
    navigate('/select-grad-success/sharepoint');
  };

  return (
    <Box sx={dashboardContainer}>
      <Box sx={usiLogo}>USI</Box>
      <Typography variant="h1" sx={dashboardTitle}>
        Select Graduate Success Tools
      </Typography>
      <Typography sx={dashboardSubtitle}>
        Empowering USI Account Managers & Leaders to explore role expectations, assess competencies, and plan for career
        growth through a guided, interactive experience
      </Typography>

      <Box sx={buttonContainer}>
        <Button sx={navButton} onClick={handleNavigateToHome} variant="contained">
          ← Back to Home
        </Button>

        <Button sx={navButton} onClick={handleNavigateToPredictor} variant="contained">
          Select Grad Success Predictor →
        </Button>

        <Button sx={navButton} onClick={handleNavigateToTable} variant="contained">
          Select vs MM Table →
        </Button>

        <Button sx={navButton} onClick={handleNavigateToSharePoint} variant="contained">
          SharePoint Integration →
        </Button>
      </Box>
    </Box>
  );
};

const SelectGradSuccess = () => <MainLayout pageContent={<SelectGradSuccessComponent />} />;

export default SelectGradSuccess;
