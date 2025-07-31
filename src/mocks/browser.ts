import { setupWorker } from 'msw/browser';

import { handlers } from './endpoints';

export const worker = setupWorker(...handlers);
