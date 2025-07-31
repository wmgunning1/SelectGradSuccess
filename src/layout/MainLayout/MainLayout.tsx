import { Grid } from '@mui/material';

import { UsiFooter, UsiHeader, appName } from '@usi/core-ui';

import { contentContainer, mainLayoutContainer } from './styles';
import { MainLayoutProps } from './types';

const MainLayout = ({ pageContent }: MainLayoutProps) => {
  return (
    <Grid container data-testid="main-layout" sx={mainLayoutContainer}>
      <UsiHeader title={appName} />

      <Grid item xs sx={contentContainer}>
        {pageContent}
      </Grid>
      {/* feedbackFormUrl and issueFormUrl props in UsiFooter should be used to generate footer buttons, please add links
      to the corresponding types.ts file and pass them in here to the component below */}
      <UsiFooter />
    </Grid>
  );
};

export default MainLayout;
