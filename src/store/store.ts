import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { ConfigureStoreOptions, combineReducers, configureStore } from '@reduxjs/toolkit';
import { appName, errorMiddleware, errorReducer } from '@usi/core-ui';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import { api } from '@/services/core/api';
import { api as dotnetBaseV1_0 } from '@/services/dotnetBaseV1_0/api';
import { api as dotnetBaseV2_0 } from '@/services/dotnetBaseV2_0/api';
import { api as dotnetBaseV2_1 } from '@/services/dotnetBaseV2_1/api';

import initialReducer from './initialSlice';

const rootPersistConfig = {
  key: appName,
  storage,
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [dotnetBaseV1_0.reducerPath]: dotnetBaseV1_0.reducer,
  [dotnetBaseV2_0.reducerPath]: dotnetBaseV2_0.reducer,
  [dotnetBaseV2_1.reducerPath]: dotnetBaseV2_1.reducer,
  select: persistReducer(rootPersistConfig, initialReducer),
  apiError: errorReducer,
});

export const createStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })
        .concat(api.middleware)
        .concat(dotnetBaseV1_0.middleware)
        .concat(dotnetBaseV2_0.middleware)
        .concat(dotnetBaseV2_1.middleware)
        .concat(errorMiddleware),
    ...options,
  });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const persistor = persistStore(store);
