import { api } from './api';

export const addTagTypes = ['Orders', 'Test', 'Health Check'] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getOrders: build.query<GetOrdersApiResponse, GetOrdersApiArg>({
        query: (queryArg) => ({
          url: `/orders`,
          headers: { 'Api-Version': '1.0' },
          params: { clientName: queryArg.clientName },
        }),
        providesTags: ['Orders'],
      }),
      getAbout: build.query<GetAboutApiResponse, GetAboutApiArg>({
        query: () => ({ url: `/about`, headers: { 'Api-Version': '1.0' } }),
        providesTags: ['Test'],
      }),
      getClients: build.query<GetClientsApiResponse, GetClientsApiArg>({
        query: (queryArg) => ({
          url: `/clients`,
          headers: { 'Api-Version': '1.0' },
          params: { clientName: queryArg.clientName, isIgnoreQueryFilters: queryArg.isIgnoreQueryFilters },
        }),
        providesTags: ['Test'],
      }),
      postClients: build.mutation<PostClientsApiResponse, PostClientsApiArg>({
        query: (queryArg) => ({
          url: `/clients`,
          method: 'POST',
          headers: { 'Api-Version': '1.0' },
          params: { isSoftDeleted: queryArg.isSoftDeleted },
        }),
        invalidatesTags: ['Test'],
      }),
      getSampleGuids: build.query<GetSampleGuidsApiResponse, GetSampleGuidsApiArg>({
        query: (queryArg) => ({
          url: `/sample-guids`,
          headers: { 'Api-Version': '1.0' },
          params: { isIgnoreQueryFilters: queryArg.isIgnoreQueryFilters },
        }),
        providesTags: ['Test'],
      }),
      postSampleGuids: build.mutation<PostSampleGuidsApiResponse, PostSampleGuidsApiArg>({
        query: () => ({ url: `/sample-guids`, method: 'POST', headers: { 'Api-Version': '1.0' } }),
        invalidatesTags: ['Test'],
      }),
      getClientsById: build.query<GetClientsByIdApiResponse, GetClientsByIdApiArg>({
        query: (queryArg) => ({ url: `/clients/${queryArg.id}`, headers: { 'Api-Version': '1.0' } }),
        providesTags: ['Test'],
      }),
      getErrorTest: build.query<GetErrorTestApiResponse, GetErrorTestApiArg>({
        query: () => ({ url: `/error-test`, headers: { 'Api-Version': '1.0' } }),
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
export type GetOrdersApiResponse = /** status 200 OK */ ClientDto[];
export type GetOrdersApiArg = {
  clientName?: string;
  };
export type GetAboutApiResponse = /** status 200 OK */ AboutDtoRead;
export type GetAboutApiArg = void;
export type GetClientsApiResponse = /** status 200 OK */ ClientDto[];
export type GetClientsApiArg = {
  clientName?: string;
  isIgnoreQueryFilters?: boolean;
  };
export type PostClientsApiResponse = /** status 200 OK */ ClientDto[];
export type PostClientsApiArg = {
  isSoftDeleted?: boolean;
  };
export type GetSampleGuidsApiResponse = /** status 200 OK */ Sample1GuidTableDto[];
export type GetSampleGuidsApiArg = {
  isIgnoreQueryFilters?: boolean;
  };
export type PostSampleGuidsApiResponse = /** status 200 OK */ Sample1GuidTableDto[];
export type PostSampleGuidsApiArg = void;
export type GetClientsByIdApiResponse = /** status 200 OK */ ClientDto;
export type GetClientsByIdApiArg = {
  id: number;
  };
export type GetErrorTestApiResponse = /** status 200 OK */ string;
export type GetErrorTestApiArg = void;
export type GetHealthzLiveApiResponse = /** status 200 API service is healthy */ string;
export type GetHealthzLiveApiArg = void;
export type ClientDto = {
  clientId: number;
  benefitPointId: string;
  name?: string | null;
};
export type AboutDto = {
  userName?: string | null;
};
export type AboutDtoRead = {
  userName?: string | null;
  currentVersion?: string | null;
};
export type Sample1GuidTableDto = {
  id: string;
  sampleColumn: string;
};
export type ProblemDetails = {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
};
export const {
  useGetOrdersQuery,
  useGetAboutQuery,
  useGetClientsQuery,
  usePostClientsMutation,
  useGetSampleGuidsQuery,
  usePostSampleGuidsMutation,
  useGetClientsByIdQuery,
  useGetErrorTestQuery,
  useGetHealthzLiveQuery,
} = injectedRtkApi;
