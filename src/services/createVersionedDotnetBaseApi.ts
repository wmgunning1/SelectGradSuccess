import config from '@/config';
import { API_PATHS } from '@/utilities/constants';
import { baseApi } from '@usi/core-ui';

const baseUrl = `${config.apiUrl}/${API_PATHS.DOTNET_BASE}`;

export const createVersionedDotnetBaseApi = (version: string) => {
  return baseApi({baseUrl, reducerPath:`${baseUrl}/${version}`});
};