import { api } from './api';

export const addTagTypes = ['Core'] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getV1GroupSizes: build.query<GetV1GroupSizesApiResponse, GetV1GroupSizesApiArg>({
        query: () => ({ url: '/v1/group-sizes' }),
        providesTags: ['Core'],
      }),
      getV1Regions: build.query<GetV1RegionsApiResponse, GetV1RegionsApiArg>({
        query: () => ({ url: '/v1/regions' }),
        providesTags: ['Core'],
      }),
      getV1Industries: build.query<GetV1IndustriesApiResponse, GetV1IndustriesApiArg>({
        query: () => ({ url: '/v1/industries' }),
        providesTags: ['Core'],
      }),
      getV1States: build.query<GetV1StatesApiResponse, GetV1StatesApiArg>({
        query: () => ({ url: '/v1/states' }),
        providesTags: ['Core'],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as coreApi };
export type GetV1GroupSizesApiResponse = /** status 200 Success */ GroupSizeResponse[];
export type GetV1GroupSizesApiArg = void;
export type GetV1RegionsApiResponse = /** status 200 Success */ RegionResponse[];
export type GetV1RegionsApiArg = void;
export type GetV1IndustriesApiResponse = /** status 200 Success */ IndustryResponse[];
export type GetV1IndustriesApiArg = void;
export type GetV1StatesApiResponse = /** status 200 Success */ StateResponse[];
export type GetV1StatesApiArg = void;
export type GroupSizeResponse = {
  id?: number;
  name?: string | null;
  displayOrder?: number;
  isDefault?: boolean;
};
export type ProblemDetails = {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
};
export type RegionResponse = {
  id?: number;
  name?: string | null;
  displayOrder?: number;
  isDefault?: boolean;
};
export type IndustryResponse = {
  id?: number;
  name?: string | null;
  displayOrder?: number;
  isDefault?: boolean;
};
export type StateResponse = {
  id?: number;
  name?: string | null;
  displayOrder?: number;
  isDefault?: boolean;
};
export const { useGetV1GroupSizesQuery, useGetV1RegionsQuery, useGetV1IndustriesQuery, useGetV1StatesQuery } =
  injectedRtkApi;
