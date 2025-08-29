import packageInfo from './package.json'

const isServer = typeof window === 'undefined'
const requiredEnvironmentVariables = [
    'API_URL',
    'NEXT_PUBLIC_BROWSER_API',
    'CDN_URL',
    'TYPE',
    'PROJECT_ID',
    'PRIVATE_KEY_ID',
    'PRIVATE_KEY',
    'CLIENT_EMAIL',
    'CLIENT_ID',
    'AUTH_URI',
    'TOKEN_URI',
    'AUTH_CERT_URL',
    'CLIENT_CERT_URL',
    'UNIVERSE_DOMAIN',
    'GITLAB_MESSAGE',
]

const missingVariables = requiredEnvironmentVariables.filter(
    (key) => !process.env[key]
)

if (isServer && missingVariables.length > 0) {
    throw new Error(
        'Missing essential environment variables:\n' +
            missingVariables
                .map((key) => `${key}: ${process.env[key] || 'undefined'}`)
                .join('\n')
    )
}

const env = Object.fromEntries(
    requiredEnvironmentVariables.map((key) => [key, process.env[key]])
)

const config = {
    url: {
        NEXT_PUBLIC_BROWSER_API:
            env.NEXT_PUBLIC_BROWSER_API || 'https://api.queenbee.login.no/v1',
        API_URL: env.API_URL || 'https://api.queenbee.login.no/v1',
        CDN_URL: env.CDN_URL || 'https://cdn.login.no',
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
        EVENTS_PATH: '/events/',
        JOBADS_PATH: '/jobs/',
        SKILLS_PATH: '/jobs/skills/',
        CITIES_PATH: '/cities/',
        CITIES_PATH_2: '/jobs/cities/',
        CATEGORIES_PATH: '/categories/',
        AUDIENCES_PATH_2: '/events/audiences/',
        ORGANIZATIONS_PATH_2: '/events/organizations/',
        AUDIENCES_PATH: '/audiences/',
        ORGANIZATIONS_PATH: '/organizations/',
        RULES_PATH: '/rules/',
        ANNOUNCEMENT_PATH: '/announcement/',
        LOCATIONS_PATH: '/locations/',
        IMAGES_PATH: '/images',
    },
    time: {
        TIME_UNSET: '0001-01-01T00:00:00Z',
        TIME_UNSET_START: '00:00:01',
        TIME_UNSET_END: '23:59:59',
    },
    timeType: {
        DEFAULT: 'default',
        NO_END: 'no_end',
        WHOLE_DAY: 'whole_day',
        TO_BE_DETERMINED: 'tbd',
    },
    jobType: {
        FULL_TIME: 'full',
        PART_TIME: 'part',
        SUMMER: 'summer',
        VERV: 'verv',
    },
    version: packageInfo.version,
}

export default config
