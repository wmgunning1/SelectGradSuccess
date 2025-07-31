import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider } from '@mui/material';

import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '@/store/store';
import theme from '@/theme';

export interface TestHarnessProps {
  /** Last route to be added to initial route entries stack. */
  route?: string;

  /** The components under test. */
  children: ReactNode;
}

const ComponentWithRouter = (props: TestHarnessProps) =>
  props?.route ? (
    <MemoryRouter initialEntries={['/', props.route]} children={props.children} />
  ) : (
    <MemoryRouter children={props?.children} />
  );

export const TestHarness = (props: TestHarnessProps) => {
  return (
    <Provider
      store={store}
      children={
        <PersistGate persistor={persistor}>
          <ThemeProvider theme={theme}>{ComponentWithRouter(props)}</ThemeProvider>{' '}
        </PersistGate>
      }
    ></Provider>
  );
};
