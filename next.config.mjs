/** @type {import('next').NextConfig} */
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});


const nextConfig = {
  env: {
    API_URL: 'https://emodu.my.id/api/v2',
    NEXT_PUBLIC_API_URL: 'https://emodu.my.id/api/v2',
  },
};

export default withPWA(nextConfig);
