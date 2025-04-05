import config from '@config'

const baseUrl = config.url.API_URL

// Props
type postJobProps = {
    application_deadline: string
    application_url: string
    banner_image: string
    description_long_en: string
    description_long_no: string
    description_short_en: string
    description_short_no: string
    highlight: boolean
    job_type: string
    organization: string
    position_title_en: string
    position_title_no: string
    time_expire: string
    time_publish: string
    title_en: string
    title_no: string
    visible: boolean
}

type postCityProps = {
    application_deadline: string
    application_url: string
    banner_image: string
    description_long_en: string
    description_long_no: string
    description_short_en: string
    description_short_no: string
    highlight: boolean
    job_type: string
    organization: string
    position_title_en: string
    position_title_no: string
    time_expire: string
    time_publish: string
    title_en: string
    title_no: string
    visible: boolean
}

type postSkillProps = {
    id: number
    skill: string
}

type postEventProps = {
    canceled: boolean
    capacity: number
    category: number
    description_en: string
    description_no: string
    digital: boolean
    full: boolean
    highlight: boolean
    image_banner: string
    image_small: string
    informational_en: string
    informational_no: string
    link_discord: string
    link_facebook: string
    link_signup: string
    link_stream: string
    location: number
    name_en: string
    name_no: string
    parent: number
    rule: number
    time_end: string
    time_publish: string
    time_signup_deadline: string
    time_signup_release: string
    time_start: string
    time_type: string
    visible: boolean
}

type postAudienceProps = {
    audience: number
    event: number
}

type postOrganizationEventProps = {
    event: number
    organization: string
}

type postLocationProps = {
    address_postcode: number
    address_street: string
    city_name: string
    coordinate_lat: number
    coordinate_long: number
    mazemap_campus_id: number
    mazemap_poi_id: number
    name_en: string
    name_no: string
    type: string
    url: string
}

type postOrganizationProps = {
    description_en: string
    description_no: string
    link_facebook: string
    link_homepage: string
    link_instagram: string
    link_linkedin: string
    logo: string
    name_en: string
    name_no: string
    shortname: string
    type: number
}

type postRuleProps = {
    description_en: string
    description_no: string
    name_en: string
    name_no: string
}

// Jobs
export async function getJobs(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    
    const path = `${config.beehiveApi.JOBADS_PATH}?${queryParts.toString()}`
    return await _fetchWrapper(path)
}

export async function getJob(id: number) {
    const path = `${config.beehiveApi.JOBADS_PATH}${id}`
    return await _fetchWrapper(path)
}

export async function postJob(body: postJobProps) {
    return await _PostWrapper(config.beehiveApi.JOBADS_PATH, body)
}

// Jobs - Skill
export async function postSkill(body: postSkillProps) {
    return await _PostWrapper(config.beehiveApi.SKILLS_PATH, body)
}

// Cities
export async function getCities() {
    const path = `${config.beehiveApi.CITIES_PATH}`
    return await _fetchWrapper(path)
}

export async function postCity(body: postCityProps) {
    return await _PostWrapper(config.beehiveApi.CITIES_PATH_2, body)
}

// Events
export async function getEvents(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    
    const path = `${config.beehiveApi.EVENTS_PATH}?${queryParts.toString()}`
    return await _fetchWrapper(path)
}

export async function getEvent(id: number) {
    const path = `${config.beehiveApi.EVENTS_PATH}${id}`
    return await _fetchWrapper(path)
}

export async function postEvent(body: postEventProps) {
    return await _PostWrapper(config.beehiveApi.EVENTS_PATH, body)
}

// Events - Categories
export async function getCategories() {
    const path = `${config.beehiveApi.CATEGORIES_PATH}`
    return await _fetchWrapper(path)
}

export async function getAudiences() {
    const path = `${config.beehiveApi.AUDIENCES_PATH}`
    return await _fetchWrapper(path)
}

export async function getAudience(id: number) {
    const path = `${config.beehiveApi.AUDIENCES_PATH}${id}`
    return await _fetchWrapper(path)
}

export async function postAudience(body: postAudienceProps) {
    return await _PostWrapper(config.beehiveApi.AUDIENCES_PATH_2, body)
}

export async function postOrganizationEvent(body: postOrganizationEventProps) {
    return await _PostWrapper(config.beehiveApi.ORGANIZATIONS_PATH_2, body)
}

// Locations
export async function getLocations(type: string | null = null, limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    if (type) queryParts.append('type', type)

    const path = `${config.beehiveApi.LOCATIONS_PATH}?${queryParts.toString()}`
    return await _fetchWrapper(path)
}

export async function getLocation(id: number) {
    const path = `${config.beehiveApi.LOCATIONS_PATH}${id}`
    return await _fetchWrapper(path)
}

export async function postLocation(body: postLocationProps) {
    return await _PostWrapper(config.beehiveApi.LOCATIONS_PATH, body)
}

// Organizations
export async function getOrganizations(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}?${queryParts.toString()}`
    return await _fetchWrapper(path)
}

export async function getOrganization(shortname: string | null = null) {
    const queryParts = new URLSearchParams()

    if(shortname) queryParts.append('shortname', shortname)

    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}?${queryParts.toString()}`
    return await _fetchWrapper(path)
}

export async function postOrganization(body: postOrganizationProps) {
    return await _PostWrapper(config.beehiveApi.ORGANIZATIONS_PATH, body)
}

// Rules
export async function getRules(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    const path = `${config.beehiveApi.RULES_PATH}?${queryParts.toString()}`
    return await _fetchWrapper(path)
}

export async function getRule(id: number) {
    const path = `${config.beehiveApi.RULES_PATH}?${id}`
    return await _fetchWrapper(path)
}

export async function postRule(body: postRuleProps) {
    return await _PostWrapper(config.beehiveApi.RULES_PATH, body)
}

async function _fetchWrapper(path: string, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${baseUrl}${path}`, finalOptions)
        const data = await response.json()

        if (!response.ok) {
            return null
        }

        return data
    // eslint-disable-next-line
    } catch (error: any) {
        return JSON.stringify(error.message) || 'Unknown error! Please contact TekKom'
    }
}

async function _PostWrapper(path: string, data = {}) {
    const defaultOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }

    try {
        const response = await fetch(`${baseUrl}${path}`, defaultOptions)
        const data = await response.json()

        if (!response.ok) {
            return null
        }

        return data
    // eslint-disable-next-line
    } catch (error: any) {
        return JSON.stringify(error.message) || 'Unknown error! Please contact TekKom'
    }
}

