import packageInfo from './package.json'

const { API_URL, NEXT_PUBLIC_BROWSER_API, CDN_URL } = process.env

const config = {
    url: {
        NEXT_PUBLIC_BROWSER_API: NEXT_PUBLIC_BROWSER_API || 'https://queenbee-api.login.no/v1',
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
    version: packageInfo.version
}
export default config
