import packageInfo from './package.json'

const { env } = process

const config = {
    url: {
        API_URL: env.API_URL || 'https://workerbee-v2.login.no/api/v2',
        CDN_URL: env.CDN_URL || 'https://cdn.login.no',
        TEKKOM_BOT_API_URL: env.NEXT_PUBLIC_TEKKOM_BOT_API_URL,
        GITLAB_URL: 'https://gitlab.login.no',
        AUTHENTIK_URL: 'https://authentik.login.no',
    },
    firebase: {
        type: env.TYPE,
        project_id: env.PROJECT_ID,
        private_key_id: env.PRIVATE_KEY_ID,
        private_key: env.PRIVATE_KEY,
        client_email: env.CLIENT_EMAIL,
        client_id: env.CLIENT_ID,
        auth_uri: env.AUTH_URI,
        token_uri: env.TOKEN_URI,
        auth_provider_x509_cert_url: env.AUTH_CERT_URL,
        client_x509_cert_url: env.CLIENT_CERT_URL,
        universe_domain: env.UNIVERSE_DOMAIN,
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
        events: {
            PATH: '/events/',
            PATH_PROTECTED: '/events/protected/',
            CATEGORIES: '/events/categories/all',
            AUDIENCES: '/events/audiences',
            TIME_TYPES: '/events/time',
        },
        jobs: {
            PATH: '/jobs/',
            PATH_PROTECTED: '/jobs/protected/',
            TYPES: '/jobs/types/all',
        },
        locations: {
            PATH: '/locations/',
        }
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
    },
    version: packageInfo.version,
}

export default config
