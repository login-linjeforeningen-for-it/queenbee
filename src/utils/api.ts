import config from '@config'

const baseUrl = config.url.API_URL

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

// Events - Categories
export async function getCategories() {
    const path = `${config.beehiveApi.CATEGORIES_PATH}`
    return await _fetchWrapper(path)
}

// Events - Categories
export async function getAudiences() {
    const path = `${config.beehiveApi.AUDIENCES_PATH}`
    return await _fetchWrapper(path)
}

export async function getAudience(id: number) {
    const path = `${config.beehiveApi.AUDIENCES_PATH}${id}`
    return await _fetchWrapper(path)
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

// Cities
export async function getCities() {
    const path = `${config.beehiveApi.CITIES_PATH}`
    return await _fetchWrapper(path)
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
