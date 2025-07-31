import { api } from './api';

export const addTagTypes = ['Test', 'Health Check'] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getAbout: build.query<GetAboutApiResponse, GetAboutApiArg>({
        query: () => ({ url: `/about`, headers: { 'Api-Version': '2.0' } }),
        providesTags: ['Test'],
      }),
      getClients: build.query<GetClientsApiResponse, GetClientsApiArg>({
        query: (queryArg) => ({
          url: `/clients`,
          headers: { 'Api-Version': '2.0' },
          params: { clientName: queryArg.clientName, isIgnoreQueryFilters: queryArg.isIgnoreQueryFilters },
        }),
        providesTags: ['Test'],
      }),
      getHealthzLive: build.query<GetHealthzLiveApiResponse, GetHealthzLiveApiArg>({
        query: () => ({ url: `/healthz/live` }),
        providesTags: ['Health Check'],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as dotnetBaseApi };
export type GetAboutApiResponse = /** status 200 OK */ AboutDto;
export type GetAboutApiArg = void;
export type GetClientsApiResponse = /** status 200 OK */ ClientDto[];
export type GetClientsApiArg = {
  clientName?: string;
  isIgnoreQueryFilters?: boolean;
  };
export type GetHealthzLiveApiResponse = /** status 200 API service is healthy */ string;
export type GetHealthzLiveApiArg = void;
export type AboutDto = {
  build?: string | null;
  image?: string | null;
  tag?: string | null;
  userName?: string | null;
  apiVersion?: string | null;
};
export type ClientDto = {
  clientId: number;
  benefitPointId: string;
  dbaName?: string | null;
  name?: string | null;
};
export const { useGetAboutQuery, useGetClientsQuery, useGetHealthzLiveQuery } = injectedRtkApi;
