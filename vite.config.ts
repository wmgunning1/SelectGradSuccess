import * as path from 'path';
import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import type { VitePWAOptions } from 'vite-plugin-pwa';
import { VitePWA } from 'vite-plugin-pwa';

import manifest from './manifest';

const local = 'local';

process.env = { ...process.env, ...loadEnv('', process.cwd()) };

const env = (process.env.REACT_APP_ENV = process.env.REACT_APP_ENV || local);

const pwaOptions: Partial<VitePWAOptions> = {
  base: `/${process.env.VITE_BASE_URL}/`,
  includeAssets: ['favicon.svg'],
  manifest: manifest(process.env),
  srcDir: 'src',
  filename: 'sw.ts',
  strategies: 'injectManifest',
  injectManifest: {
    maximumFileSizeToCacheInBytes: Number.MAX_SAFE_INTEGER,
    minify: false,
    enableWorkboxModulesLogs: true,
  },
};

const replaceOptions = {
  __DATE__: new Date().toISOString(),
  preventAssignment: true,
};
const reload = process.env.RELOAD_SW === 'true';
const selfDestroying = process.env.SW_DESTROY === 'true';

if (reload) {
  // @ts-expect-error just ignore
  replaceOptions.__RELOAD_SW__ = 'true';
}

if (selfDestroying) pwaOptions.selfDestroying = selfDestroying;

export default defineConfig({
  base: `/${process.env.VITE_BASE_URL}/`,
  define: {
    'process.env': process.env,
  },
  server: {
    host: true,
    port: 3000,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  plugins: [react(), VitePWA(pwaOptions), replace(replaceOptions)],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
