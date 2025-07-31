import type { ManifestOptions } from 'vite-plugin-pwa';

const white = '#ffffff';

const manifest: (nodeEnv: Record<string, string>) => Partial<ManifestOptions> = (nodeEnv) => ({
  name: `${nodeEnv.VITE_APP_NAME} Web Application`,
  short_name: `${nodeEnv.VITE_APP_NAME} Web App`,
  theme_color: white,
  background_color: white,
  display: 'standalone',
  scope: '.',
  start_url: `/${nodeEnv.VITE_BASE_URL}/`,
  lang: 'en',
  icons: [
    {
      src: './assets/logo/white/usi-logo-wh-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: './assets/logo/white/usi-logo-wh-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: './assets/logo/white/usi-logo-wh-152x152.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
});

export default manifest;
