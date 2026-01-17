import createNextIntlPlugin from 'next-intl/plugin'
import withPWAInit from 'next-pwa'

const withPWA = withPWAInit( {
  dest        : 'public',
  register    : true,
  skipWaiting : true,
  disable     : process.env.NODE_ENV === 'development',
} )

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode : false,

  publicRuntimeConfig : {
    // Will be available on both server and client
    baseUrl : process.env.BASE_URL,
  },
  trustHost           : true,
  output              : 'standalone',
  serverRuntimeConfig : {
    // Will only be available on the server side
    baseUrl : process.env.BASE_URL, // Pass through env variables
  },
  // async rewrites() {
  //   return [
  //     {
  //       source      : '/api-web/:path*',
  //       destination : `${process.env.BASE_URL}/:path*`,
  //     },
  //   ]
  // },
  images : {
    remotePatterns : [
      {
        protocol : 'https',
        hostname : 'avatars.githubusercontent.com',
        port     : '',
        pathname : '/u/**',
      },
      {
        protocol : 'https',
        hostname : 'res.cloudinary.com',
        port     : '',
        pathname : '/*/image/upload/**',
      },
      {
        protocol : 'http',
        hostname : 'localhost',
        port     : '1337',
        pathname : '/uploads/**',
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin( './i18n/request.tsx' )
export default withPWA( withNextIntl( nextConfig ) )
