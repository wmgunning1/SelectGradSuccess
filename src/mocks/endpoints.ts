import { urlBase } from '@usi/core-ui';
import { HttpResponse, http } from 'msw';

import { API_PATHS } from '@/utilities/constants';

import { aboutData } from './dotnetBaseApiData';

const dotnetBaseUrl = `${urlBase}/${API_PATHS.DOTNET_BASE}`;

export const handlers = [
  http.get(`/${dotnetBaseUrl}/about`, ({ request }) => {
    //add fallback to avoid request error
    const requestVersion = request.headers.get('Api-Version') ?? '1.0';

    return HttpResponse.json(aboutData[requestVersion]);
  }),
];
