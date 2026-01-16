import packageInfo from './package.json'

const { env } = process

const config = {
    url: {
        git: env.GIT_URL || 'https://gitlab.login.no',
        cdn: env.CDN_URL || 'https://cdn.login.no',
        authentik: env.AUTHENTIK_URL || 'https://authentik.login.no',
        api: env.WORKERBEE_API_URL || 'https://workerbee.login.no/api/v2',
        bot: env.TEKKOM_BOT_API_URL || 'https://bot.login.no/api',
        internal: env.INTERNAL_API_URL || 'https://internal.login.no/api',
        beekeeper: env.BEEKEEPER_API_URL || 'https://beekeeper.login.no/api',
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
        defaultCluster: 'infra-prod-cluster',
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
            live: 'traffic/live',
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
            restore: 'backup/restore',
            files : 'backup/files'
        }
    },
    version: packageInfo.version,
}

export default config
