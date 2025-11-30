import packageInfo from './package.json'

const { env } = process

const config = {
    url: {
        API_URL: env.API_URL || 'https://workerbee.login.no/api/v2',
        CDN_URL: env.CDN_URL || 'https://cdn.login.no',
        TEKKOM_BOT_API_URL: env.TEKKOM_BOT_API_URL,
        GITLAB_URL: 'https://gitlab.login.no',
        AUTHENTIK_URL: 'https://authentik.login.no',
        system: 'https://internal.login.no/api'
    },
    beehiveApi: {
        SKILLS_PATH: '/jobs/skills/',
        CITIES_PATH: '/cities/',
        CITIES_PATH_2: '/jobs/cities/',
        AUDIENCES_PATH_2: '/events/audiences/',
        ORGANIZATIONS_PATH_2: '/events/organizations/',
        AUDIENCES_PATH: '/audiences/',
        ORGANIZATIONS_PATH: '/organizations/',
        RULES_PATH: '/rules/',
        IMAGES_PATH: '/images',
    },
    workerbeeApi: {
        albums: {
            PATH: '/albums/',
        },
        alerts: {
            PATH: '/alerts/',
        },
        events: {
            PATH: '/events/',
            PATH_PROTECTED: '/events/protected/',
            CATEGORIES: '/categories',
            AUDIENCES: '/audiences',
            TIME_TYPES: '/events/time',
        },
        honey: {
            PATH: '/honeys/',
            SERVICES: '/text/',
        },
        images: {
            PATH: '/images/',
        },
        jobs: {
            PATH: '/jobs/',
            PATH_PROTECTED: '/jobs/protected/',
            TYPES: '/jobs/types/all',
        },
        locations: {
            PATH: '/locations/',
        },
        organizations: {
            PATH: '/organizations/',
        },
        rules: {
            PATH: '/rules/',
        },
        statistics: {
            PATH: '/stats/',
        },
        system: {
            ws: {
                docker: '/ws/docker/',
                stats: '/ws/stats/',
            },
            docker: {
                path: '/docker',
                restart_service: '/restart/service/',
                restart: '/restart/'
            },
            ingress: '/ingress',
            stats: '/stats',
        },
    },
    tekkomBotApi: {
        ANNOUNCEMENT_PATH: '/announcements',
        CHANNELS_PATH: '/channels',
        ROLES_PATH: '/roles',
    },
    time: {
        TIME_UNSET: '0001-01-01T00:00:00Z',
        TIME_UNSET_START: '00:00:01',
        TIME_UNSET_END: '23:59:59',
    },
    auth: {
        BASE_URL: env.BASE_URL,
        LOGIN_URL: `${env.BASE_URL}/api/login`,
        REDIRECT_URL: `${env.BASE_URL}/api/callback`,
        TOKEN_URL: `${env.BASE_URL}/api/token`,
        LOGOUT_URL: `${env.BASE_URL}/api/logout`,
    },
    authentik: {
        CLIENT_ID: env.AUTHENTIK_CLIENT_ID,
        CLIENT_SECRET: env.AUTHENTIK_CLIENT_SECRET,
        AUTH_URL: `${env.AUTHENTIK_URL}/application/o/authorize/`,
        TOKEN_URL: `${env.AUTHENTIK_URL}/application/o/token/`,
        USERINFO_URL: `${env.AUTHENTIK_URL}/application/o/userinfo/`,
        TOKEN: `${env.AUTHENTIK_API_TOKEN}`,
    },
    beekeeper: {
        api: env.NEXT_PUBLIC_BEEKEEPER_API_URL || 'https://api.beekeeper.login.no/api',
        serverAPI: env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api',
        defaultCluster: 'infra-prod-cluster',
        basePath: '/service/prod/global',
    },
    version: packageInfo.version,
}

export default config
