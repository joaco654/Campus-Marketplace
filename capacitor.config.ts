import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.campusmarketplace.app',
  appName: 'Campus Marketplace',
  webDir: 'out',
  server: {
    url: process.env.NODE_ENV === 'production'
      ? 'https://campus-marketplace-fa87029iw-joaco654s-projects.vercel.app'
      : 'http://10.0.2.2:3000', // Android emulator localhost
    cleartext: process.env.NODE_ENV !== 'production'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
