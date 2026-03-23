import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    env: {
        TZ: 'Europe/Oslo',
    },
    images: {
        qualities: [25, 50, 75, 100],
        remotePatterns: [
            { protocol: 'https', hostname: 'cdn.login.no', pathname: '/**' },
        ],
    },
    output: 'standalone'
}

export default nextConfig
