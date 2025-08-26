const { API_URL, CDN_URL } = process.env
const { version } = require('./package.json')

const config = {
    url: {
        API_URL: API_URL || 'https://queenbee-api.login.no/v1',
        CDN_URL: CDN_URL || 'https://cdn.login.no'
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
        LOCATIONS_PATH: '/locations/',
        IMAGES_PATH: '/images',
        SECRET: 'secret', // Cosmic secret, quite strong password
    },
    time: {
        TIME_UNSET: '0001-01-01T00:00:00Z',
        TIME_UNSET_START: '00:00:01',
        TIME_UNSET_END: '23:59:59'
    },
    timeType: {
        DEFAULT: 'default',
        NO_END: 'no_end',
        WHOLE_DAY: 'whole_day',
        TO_BE_DETERMINED: 'tbd'
    },
    jobType: {
        FULL_TIME: 'full',
        PART_TIME: 'part',
        SUMMER: 'summer',
        VERV: 'verv'
    },
    version
}

export default config
