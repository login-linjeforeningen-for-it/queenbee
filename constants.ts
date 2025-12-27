import packageInfo from './package.json'

const { env } = process

const config = {
    url: {
        api: env.API_URL || 'https://workerbee.login.no/api/v2',
        cdn: env.CDN_URL || 'https://cdn.login.no',
        bot: env.TEKKOM_BOT_API_URL,
        git: 'https://gitlab.login.no',
        authentik: 'https://authentik.login.no',
        system: 'https://internal.login.no/api'
    },
    workerbee: {
        albums: {
            path: 'albums',
        },
        alerts: {
            path: 'alerts',
        },
        events: {
            path: 'events',
            path_protected: 'events/protected',
            categories: 'categories',
            audiences: 'audiences',
            time_types: 'events/time',
        },
        honey: {
            path: 'honeys',
            services: 'text',
        },
        images: {
            path: 'images',
        },
        jobs: {
            path: 'jobs',
            path_protected: 'jobs/protected',
            types: 'jobs/types/all',
        },
        locations: {
            path: 'locations',
        },
        organizations: {
            path: 'organizations',
        },
        rules: {
            path: 'rules',
        },
        statistics: {
            path: 'stats',
        },
    },
    bot: {
        announcements: 'announcements',
        channels: 'channels',
        roles: 'roles',
    },
    auth: {
        url: {
            base: env.BASE_URL,
            login: `${env.BASE_URL}/api/login`,
            redirect: `${env.BASE_URL}/api/callback`,
            token: `${env.BASE_URL}/api/token`,
        }
    },
    authentik: {
        client: {
            id: env.AUTHENTIK_CLIENT_ID,
            secret: env.AUTHENTIK_CLIENT_SECRET,
        },
        url: {
            auth: `${env.AUTHENTIK_URL}/application/o/authorize/`,
            userinfo: `${env.AUTHENTIK_URL}/application/o/userinfo/`,
            token: `${env.AUTHENTIK_URL}/application/o/token/`,
        },
        token: env.AUTHENTIK_API_TOKEN,
    },
    beekeeper: {
        api: env.NEXT_PUBLIC_BEEKEEPER_API_URL || 'https://beekeeper.login.no/api',
        server: env.NEXT_PUBLIC_API_URL || 'https://beekeeper.login.no/api',
        // server: env.NEXT_PUBLIC_API_URL || 'http://beekeeper_api:8080/api', // 20ms faster
        defaultCluster: 'infra-prod-cluster',
        db: {
            base: env.DB,
            user: env.BEEKEEPER_DB_USER,
            host: env.BEEKEEPER_DB_HOST,
            password: env.BEEKEEPER_DB_PASSWORD,
            port: env.BEEKEEPER_DB_PORT,
            max: env.DB_MAX_CONN,
            idle: env.DB_IDLE_TIMEOUT_MS,
            timeout: env.DB_TIMEOUT_MS,
        },
        cache: {
            ttl: Number(env.CACHE_TTL) || 60000,
        },
        status: {
            services: {
                get: 'monitoring',
                put: 'monitoring',
                post: 'monitoring',
                delete: 'monitoring',
            },
            notifications: {
                get: 'monitoring/notifications',
                put: 'monitoring/notification',
                post: 'monitoring/notification',
                delete: 'monitoring/notification',
            },
            tags: {
                get: 'monitoring/tags',
                post: 'monitoring/tag',
                delete: 'monitoring/tag'
            }
        },
        traffic: {
            metrics: 'traffic/metrics',
            records: 'traffic/records',
            domains: 'traffic/domains',
        },
        dashboard: {
            internal: 'dashboard/internal'
        }
    },
    internal: {
        ws: {
            docker: 'ws/docker',
            stats: 'ws/stats',
        },
        docker: {
            path: 'docker',
            restart_service: 'restart/service',
            restart: 'restart'
        },
        ingress: 'ingress',
        stats: 'stats',
        backups: {
            get: 'backup',
            files : 'backup/files'
        }
    },
    version: packageInfo.version,
}

export default config
