/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference lib="webworker" />

export type ImportMetaEnv = {
  readonly VITE_BASE_URL: string;
  readonly VITE_APP_NAME: string;
};

export type ImportMeta = {
  readonly VITE_BASE_URL: string;
  readonly VITE_APP_NAME: string;
};
