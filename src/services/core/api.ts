import { baseApi } from '@usi/core-ui';

import config from '@/config';

export const api = baseApi({baseUrl: `${config.apiUrl}/core`});
