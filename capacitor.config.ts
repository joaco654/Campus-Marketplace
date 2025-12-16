import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.campusmarketplace.app',
  appName: 'Campus Marketplace',
  webDir: 'out',
  server: {
    url: process.env.NODE_ENV === 'production'
      ? 'https://your-production-url.vercel.app' // Replace with your Vercel/Supabase URL
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
