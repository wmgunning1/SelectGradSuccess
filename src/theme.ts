import { Shadows, ThemeOptions, createTheme } from '@mui/material/styles';

import { coreTheme } from '@usi/core-ui';

// A custom theme for this app
const theme = createTheme({
  ...coreTheme,
  components: {
    ...coreTheme.components,
  },
  typography: {
    ...coreTheme.typography,
  },
} as ThemeOptions);

theme.shadows = Array(theme.shadows.length).fill('none') as Shadows;

export default theme;
