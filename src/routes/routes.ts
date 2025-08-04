import { UsiAsyncComponentLoader, httpError } from '@usi/core-ui';

import { Pages, Routes } from './types';

const routes: Routes = {
  [Pages.Home]: {
    component: UsiAsyncComponentLoader(() => import('@/pages/Home')),
    path: '/',
    title: 'Home',
  },
  [Pages.SelectGradSuccess]: {
    component: UsiAsyncComponentLoader(() => import('@/pages/SelectGradSuccess')),
    path: '/select-grad-success',
    title: 'Select Grad Success',
  },
  [Pages.SelectGradSuccessPredictor]: {
    component: UsiAsyncComponentLoader(() => import('@/pages/SelectGradSuccess/Summary')),
    path: '/select-grad-success/predictor',
    title: 'Select Grad Success Predictor',
  },
  [Pages.SelectGradSuccessProducerDetail]: {
    component: UsiAsyncComponentLoader(() => import('@/pages/SelectGradSuccess/ProducerDetail')),
    path: '/select-grad-success/producer/:id',
    title: 'Producer Detail',
  },
  [Pages.SelectGradSuccessSharePoint]: {
    component: UsiAsyncComponentLoader(() => import('@/pages/SelectGradSuccess/SharePoint')),
    path: '/select-grad-success/sharepoint',
    title: 'SharePoint Integration',
  },
  [Pages.NotFound]: {
    component: UsiAsyncComponentLoader(() => {
      throw httpError[404]();
    }),
    path: '*',
  },
};

export default routes;
