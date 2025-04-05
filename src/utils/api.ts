import config from '@config'

const baseUrl = config.url.API_URL

// Jobs
export async function getJobs(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    
    const path = `${config.beehiveApi.JOBADS_PATH}?${queryParts.toString()}`
    return await fetchWrapper(path)
}

export async function getJob(id: number) {
    const path = `${config.beehiveApi.JOBADS_PATH}${id}`
    return await fetchWrapper(path)
}

export async function postJob(body: PostJobProps) {
    return await postWrapper(config.beehiveApi.JOBADS_PATH, body)
}

// Jobs - Skill
export async function postSkill(body: PostSkillProps) {
    return await postWrapper(config.beehiveApi.SKILLS_PATH, body)
}

// Cities
export async function getCities() {
    const path = `${config.beehiveApi.CITIES_PATH}`
    return await fetchWrapper(path)
}

export async function postCity(body: PostCityProps) {
    return await postWrapper(config.beehiveApi.CITIES_PATH_2, body)
}

// Events
export async function getEvents(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    
    const path = `${config.beehiveApi.EVENTS_PATH}?${queryParts.toString()}`
    return await fetchWrapper(path)
}

export async function getEvent(id: number) {
    const path = `${config.beehiveApi.EVENTS_PATH}${id}`
    return await fetchWrapper(path)
}

export async function postEvent(body: PostEventProps) {
    return await postWrapper(config.beehiveApi.EVENTS_PATH, body)
}

// Events - Categories
export async function getCategories() {
    const path = `${config.beehiveApi.CATEGORIES_PATH}`
    return await fetchWrapper(path)
}

export async function getAudiences() {
    const path = `${config.beehiveApi.AUDIENCES_PATH}`
    return await fetchWrapper(path)
}

export async function getAudience(id: number) {
    const path = `${config.beehiveApi.AUDIENCES_PATH}${id}`
    return await fetchWrapper(path)
}

export async function postAudience(body: PostAudienceProps) {
    return await postWrapper(config.beehiveApi.AUDIENCES_PATH_2, body)
}

export async function postOrganizationEvent(body: PostOrganizationEventProps) {
    return await postWrapper(config.beehiveApi.ORGANIZATIONS_PATH_2, body)
}

// Locations
export async function getLocations(type: string | null = null, limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    if (type) queryParts.append('type', type)

    const path = `${config.beehiveApi.LOCATIONS_PATH}?${queryParts.toString()}`
    return await fetchWrapper(path)
}

export async function getLocation(id: number) {
    const path = `${config.beehiveApi.LOCATIONS_PATH}${id}`
    return await fetchWrapper(path)
}

export async function postLocation(body: PostLocationProps) {
    return await postWrapper(config.beehiveApi.LOCATIONS_PATH, body)
}

// Organizations
export async function getOrganizations(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}?${queryParts.toString()}`
    return await fetchWrapper(path)
}

export async function getOrganization(shortname: string | null = null) {
    const queryParts = new URLSearchParams()

    if(shortname) queryParts.append('shortname', shortname)

    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}?${queryParts.toString()}`
    return await fetchWrapper(path)
}

export async function postOrganization(body: PostOrganizationProps) {
    return await postWrapper(config.beehiveApi.ORGANIZATIONS_PATH, body)
}

// Rules
export async function getRules(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    const path = `${config.beehiveApi.RULES_PATH}?${queryParts.toString()}`
    return await fetchWrapper(path)
}

export async function getRule(id: number) {
    const path = `${config.beehiveApi.RULES_PATH}?${id}`
    return await fetchWrapper(path)
}

export async function postRule(body: PostRuleProps) {
    return await postWrapper(config.beehiveApi.RULES_PATH, body)
}

async function fetchWrapper(path: string, options = {}) {
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

async function postWrapper(path: string, data = {}) {
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

