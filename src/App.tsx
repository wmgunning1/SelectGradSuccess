import { BrowserRouter } from 'react-router-dom';

import { UsiErrorAlert, urlBase } from '@usi/core-ui';

import AppRoutes from '@/routes/AppRoutes';

const App = () => {
  const basename = `/${urlBase}/`;

  return (
    <>
      <BrowserRouter basename={basename}>
        <AppRoutes />
      </BrowserRouter>
      <UsiErrorAlert />
    </>
  );
};

export default App;
