import config from '@config'

const baseUrl = config.url.API_URL

// Jobs
export async function getJobs(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    
    const path = `${config.beehiveApi.JOBADS_PATH}?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getJob(id: number) {
    const path = `${config.beehiveApi.JOBADS_PATH}${id}`
    return await getWrapper(path)
}

export async function postJob(body: PostJobProps) {
    return await postWrapper(config.beehiveApi.JOBADS_PATH, body)
}

export async function deleteJob(id: number) {
    const path = `${config.beehiveApi.JOBADS_PATH}${id}`
    return await deleteWrapper(path)
}

// Jobs - Skill
export async function postSkill(body: PostSkillProps) {
    return await postWrapper(config.beehiveApi.SKILLS_PATH, body)
}

// Cities
export async function getCities() {
    const path = `${config.beehiveApi.CITIES_PATH}`
    return await getWrapper(path)
}

export async function postCity(body: PostCityProps) {
    return await postWrapper(config.beehiveApi.CITIES_PATH_2, body)
}

export async function deleteCity(body: DeleteCityProps) {
    return await deleteWrapper(config.beehiveApi.CITIES_PATH_2,body)
}

// Events
export async function getEvents(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    
    const path = `${config.beehiveApi.EVENTS_PATH}?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getEvent(id: number) {
    const path = `${config.beehiveApi.EVENTS_PATH}${id}`
    return await getWrapper(path)
}

export async function postEvent(body: PostEventProps) {
    return await postWrapper(config.beehiveApi.EVENTS_PATH, body)
}

export async function deleteEvent(id: number) {
    const path = `${config.beehiveApi.EVENTS_PATH}${id}`
    return await deleteWrapper(path)
}


// Events - Categories
export async function getCategories() {
    const path = `${config.beehiveApi.CATEGORIES_PATH}`
    return await getWrapper(path)
}

export async function getAudiences() {
    const path = `${config.beehiveApi.AUDIENCES_PATH}`
    return await getWrapper(path)
}

export async function getAudience(id: number) {
    const path = `${config.beehiveApi.AUDIENCES_PATH}${id}`
    return await getWrapper(path)
}

export async function postAudience(body: PostAudienceProps) {
    return await postWrapper(config.beehiveApi.AUDIENCES_PATH_2, body)
}

export async function deleteAudience(body: DeleteAudienceProps) {
    return await deleteWrapper(config.beehiveApi.AUDIENCES_PATH_2, body)
}

export async function postOrganizationEvent(body: PostOrganizationEventProps) {
    return await postWrapper(config.beehiveApi.ORGANIZATIONS_PATH_2, body)
}

export async function deleteOrganizationEvent(body: DeleteOrganizationEventProps) {
    return await deleteWrapper(config.beehiveApi.ORGANIZATIONS_PATH_2, body)
}

// Locations
export async function getLocations(type: string | null = null, limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    if (type) queryParts.append('type', type)

    const path = `${config.beehiveApi.LOCATIONS_PATH}?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getLocation(id: number) {
    const path = `${config.beehiveApi.LOCATIONS_PATH}${id}`
    return await getWrapper(path)
}

export async function postLocation(body: PostLocationProps) {
    return await postWrapper(config.beehiveApi.LOCATIONS_PATH, body)
}

export async function deleteLocation(id: number) {
    const path = `${config.beehiveApi.LOCATIONS_PATH}${id}`
    return await deleteWrapper(path)
}

// Organizations
export async function getOrganizations(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getOrganization(shortname: string) {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${shortname}`
    return await getWrapper(path)
}

export async function postOrganization(body: PostOrganizationProps) {
    return await postWrapper(config.beehiveApi.ORGANIZATIONS_PATH, body)
}

export async function deleteOrganization(shortname: string) {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${shortname}`
    return await deleteWrapper(path)
}

// Rules
export async function getRules(limit: number | number = 20, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    const path = `${config.beehiveApi.RULES_PATH}?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getRule(id: number) {
    const path = `${config.beehiveApi.RULES_PATH}?${id}`
    return await getWrapper(path)
}

export async function postRule(body: PostRuleProps) {
    return await postWrapper(config.beehiveApi.RULES_PATH, body)
}

async function getWrapper(path: string, options = {}) {
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

async function deleteWrapper(path: string, options = {}) {
    const defaultOptions = {
        method: 'DELETE',
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