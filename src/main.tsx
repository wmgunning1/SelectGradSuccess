import { ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { UsiAuthProvider, UsiErrorFallback, initializeApp } from '@usi/core-ui';
import { PersistGate } from 'redux-persist/integration/react';

import ViewProvider from '@/contexts/ViewContext';

import App from './App';
import config from './config';
import { worker } from './mocks/browser';
import reportWebVitals from './reportWebVitals';
import { persistor, store } from './store/store';
import theme from './theme';

const container = document.getElementById('app') as Element;
const root = createRoot(container);

const renderApp = root.render(
  (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <StrictMode>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <UsiAuthProvider msalConfiguration={config.msalConfiguration}>
              <ErrorBoundary FallbackComponent={UsiErrorFallback}>
                <ViewProvider>
                  <App />
                </ViewProvider>
              </ErrorBoundary>
            </UsiAuthProvider>
          </ThemeProvider>
        </StrictMode>
      </PersistGate>
    </Provider>
  ) as ReactNode,
);

initializeApp(config, worker)
  .then(() => renderApp)
  .catch((error) => {
    throw error;
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
