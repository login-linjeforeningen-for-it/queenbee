import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    env: {
        TZ: 'Europe/Oslo',
    },
    images: {
        qualities: [25, 50, 75, 100],
        remotePatterns: [
            { protocol: 'https', hostname: 's3.login.no', pathname: '/beehive/**' },
        ],
    },
    output: 'standalone'
}

export default nextConfig
