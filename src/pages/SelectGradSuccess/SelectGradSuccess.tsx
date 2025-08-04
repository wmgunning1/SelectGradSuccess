import { useNavigate } from 'react-router-dom';

import { Assessment, Business, CloudUpload, Dashboard } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';

import MainLayout from '@/layout/MainLayout';

import {
  backgroundOverlay,
  buttonContainer,
  dashboardContainer,
  dashboardSubtitle,
  dashboardTitle,
  featureCard,
  featureIcon,
  heroSection,
  navButton,
  topNavigation,
  utechLogo,
} from './styles';

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
      {/* Background with gradient and overlay */}
      <Box sx={backgroundOverlay} />

      {/* Top Navigation */}
      <Box sx={topNavigation}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleNavigateToHome}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Added for contrast
            backdropFilter: 'blur(4px)', // Optional: for a frosted glass effect
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          ← Back to Home
        </Button>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={heroSection}>
        {/* UTECH Logo */}
        <Box
          component="img"
          src="/react-base/assets/logo/utech/utech-logo-primary.svg"
          alt="UTECH - Brought to you by USI"
          sx={utechLogo}
        />

        {/* Main Title and Subtitle */}
        <Typography variant="h1" sx={dashboardTitle}>
          Select Graduate Success Tools
        </Typography>
        <Typography sx={dashboardSubtitle}>
          Empowering USI Account Managers & Leaders to explore role expectations, assess competencies, and plan for
          career growth through a guided, interactive experience
        </Typography>

        {/* Feature Cards Grid */}
        <Grid container spacing={3} sx={{ mt: 4, mb: 6 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={featureCard} onClick={handleNavigateToTable}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Dashboard sx={featureIcon} />
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#1e3a8a' }}>
                  Producer Summary
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Compare producers at the region or office level. Identify grads at risk of failing or leaving USI
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={featureCard} onClick={handleNavigateToPredictor}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Assessment sx={featureIcon} />
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#1e3a8a' }}>
                  Success Predictor
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyze producer performance metrics and predict success outcomes
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={featureCard} onClick={handleNavigateToPredictor}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Business sx={featureIcon} />
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#1e3a8a' }}>
                  Business Intelligence
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Advanced analytics for strategic decision making
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={featureCard} onClick={handleNavigateToSharePoint}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <CloudUpload sx={featureIcon} />
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#1e3a8a' }}>
                  Data Integration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seamless integration with SharePoint and data sources
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={buttonContainer}>
          <Button sx={navButton} onClick={handleNavigateToPredictor} variant="contained" size="large">
            <Assessment sx={{ mr: 1 }} />
            Select Grad Success Predictor
          </Button>

          <Button sx={navButton} onClick={handleNavigateToTable} variant="outlined" size="large">
            <Dashboard sx={{ mr: 1 }} />
            Producer Summary
          </Button>

          <Button sx={navButton} onClick={handleNavigateToSharePoint} variant="outlined" size="large">
            <CloudUpload sx={{ mr: 1 }} />
            SharePoint Integration
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

const SelectGradSuccess = () => <MainLayout pageContent={<SelectGradSuccessComponent />} />;

export default SelectGradSuccess;
