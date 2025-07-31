import { useState } from 'react';

import { Grid, Typography } from '@mui/material';

import EnhancedAboutButton from '@/components/EnhancedAboutButton';
import LegacyAboutButton from '@/components/LegacyAboutButton';
import SelectGradSuccessButton from '@/components/SelectGradSuccessButton';
import StandardAboutButton from '@/components/StandardAboutButton';
import MainLayout from '@/layout/MainLayout';

import { homeContainer, title } from './styles';

const HomeComponent = () => {
  const [data, setData] = useState<string>('');
  const updateState = (newData: string) => {
    setData(newData);
  };
  const dataJson: { [key: string]: string } = data ? JSON.parse(data) : {};

  return (
    <Grid container spacing={2} sx={homeContainer}>
      <Grid item xs={12}>
        <Typography variant="h1" sx={title}>
          Home Page
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <LegacyAboutButton handleData={updateState} />
          </Grid>
          <Grid item xs={12}>
            <StandardAboutButton handleData={updateState} />
          </Grid>
          <Grid item xs={12}>
            <EnhancedAboutButton handleData={updateState} />
          </Grid>
          <Grid item xs={12}>
            <SelectGradSuccessButton />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={10}>
        {data && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              Response:
            </Grid>
            <Grid item xs={12}>
              {Object.entries(dataJson).map(([key, value]) => (
                <Typography key={key}>
                  {key}: {value}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={12}>
              Raw: {data}
            </Grid>
          </Grid>
        )}
        {!data && <Typography>Please select API version</Typography>}
      </Grid>
    </Grid>
  );
};

const Home = () => <MainLayout pageContent={<HomeComponent />}></MainLayout>;
export default Home;
