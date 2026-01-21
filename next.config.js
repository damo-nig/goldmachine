/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '/**',
      },
    ],
  },
  // Allow external API calls
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },
  // Rewrite genesis subdomain to /genesis page
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'genesis.goldmachine.xyz',
            },
          ],
          destination: '/genesis',
        },
      ],
    }
  },
  // Redirect /genesis on main domain to subdomain
  async redirects() {
    return [
      {
        source: '/genesis',
        has: [
          {
            type: 'host',
            value: 'goldmachine.xyz',
          },
        ],
        destination: 'https://genesis.goldmachine.xyz',
        permanent: true,
      },
      {
        source: '/genesis',
        has: [
          {
            type: 'host',
            value: 'www.goldmachine.xyz',
          },
        ],
        destination: 'https://genesis.goldmachine.xyz',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
