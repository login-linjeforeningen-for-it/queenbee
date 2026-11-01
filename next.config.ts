import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    env: {
        TZ: 'Europe/Oslo',
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
    images: {
        qualities: [25, 50, 75, 100],
        remotePatterns: [
            { protocol: 'https', hostname: 'tekkom-beehive.s3.de.io.cloud.ovh.net', pathname: '/**' },
        ],
    },
    output: 'standalone'
}

export default nextConfig
