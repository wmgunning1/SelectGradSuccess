// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import { setupServer } from 'msw/node';

import { handlers } from './mocks/endpoints';
import { api as coreApi } from './services/core/api';
import { store } from './store/store';

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());
// Reset any runtime request handlers we may add during the tests.
afterEach(() => {
  server.resetHandlers();
  act(() => {
    store.dispatch(coreApi.util.resetApiState());
  });
});
// Disable API mocking after the tests are done.
afterAll(() => server.close());

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: (props: { children: unknown }) => props.children,
}));

jest.mock('redux-persist', () => ({
  ...jest.requireActual('redux-persist'),
  persistReducer: jest.fn().mockImplementation((_: unknown, reducer: unknown) => reducer),
}));

jest.mock('redux-persist/es/storage', () => ({}));

const storageMock = (() => {
  let store: Record<string, unknown> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: unknown) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: storageMock,
});
class ResizeObserver {
  observe = jest.fn();

  unobserve = jest.fn();

  disconnect = jest.fn();
}

window.ResizeObserver = ResizeObserver;
window.alert = jest.fn();
