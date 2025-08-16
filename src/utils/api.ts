import config from '@config'

const baseUrl = config.url.API_URL

// Events
export async function getEvents(limit: number | number = 10, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    
    const path = `${config.beehiveApi.EVENTS_PATH}?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getEvent(id: number) {
    const path = `${config.beehiveApi.EVENTS_PATH}${id}`
    return await getWrapper(path)
}

export async function postEvent(body: PostEventProps): Promise<EventPostResponseProps> {
    return await postWrapper(config.beehiveApi.EVENTS_PATH, body)
}

export async function deleteEvent(id: number) {
    const path = `${config.beehiveApi.EVENTS_PATH}${id}`
    return await deleteWrapper(path)
}

export async function patchEvent(body: PatchEventProps): Promise<EventPatchResponseProps> {
    const path = `${config.beehiveApi.EVENTS_PATH}`
    return await patchWrapper(path,body)
}

// Events - Categories
export async function getCategories(): Promise<CategoriesGetResponseProps> {
    const path = `${config.beehiveApi.CATEGORIES_PATH}`
    return await getWrapper(path)
}

export async function getAudiences(): Promise<AudienceGetResponseProps> {
    const path = `${config.beehiveApi.AUDIENCES_PATH}`
    return await getWrapper(path)
}

export async function getAudience(id: number) {
    const path = `${config.beehiveApi.AUDIENCES_PATH}${id}`
    return await getWrapper(path)
}

export async function postAudience(body: AudienceProps) {
    return await postWrapper(config.beehiveApi.AUDIENCES_PATH_2, body)
}

export async function deleteAudience(body: AudienceProps) {
    return await deleteWrapper(config.beehiveApi.AUDIENCES_PATH_2, body)
}

export async function postOrganizationEvent(body: PostOrganizationProps): Promise<OrganizationPostResponseProps> {
    return await postWrapper(config.beehiveApi.ORGANIZATIONS_PATH_2, body)
}

export async function deleteOrganizationEvent(body: OrganizationEventProps) {
    return await deleteWrapper(config.beehiveApi.ORGANIZATIONS_PATH_2, body)
}

// Event - Images
export async function getEventBannerImages(): Promise<ImageGetResponseProps> {
    const path = `${config.beehiveApi.IMAGES_PATH}${config.beehiveApi.EVENTS_PATH}banner`
    console.log('Fetching event banner images from:', path)
    return await getWrapper(path)
}

export async function getEventSmallImages(): Promise<ImageGetResponseProps> {
    const path = `${config.beehiveApi.IMAGES_PATH}${config.beehiveApi.EVENTS_PATH}small`
    return await getWrapper(path)
}


// Jobs
export async function getJobs(limit: number | number = 10, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    
    const path = `${config.beehiveApi.JOBADS_PATH}?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getJob(id: number) {
    const path = `${config.beehiveApi.JOBADS_PATH}${id}`
    return await getWrapper(path)
}

export async function postJob(body: PostJobProps): Promise<JobPostResponseProps> {
    return await postWrapper(config.beehiveApi.JOBADS_PATH, body)
}

export async function deleteJob(id: number) {
    const path = `${config.beehiveApi.JOBADS_PATH}${id}`
    return await deleteWrapper(path)
}

export async function patchJob(body: PatchJobProps): Promise<JobPatchResponseProps> {
    const path = `${config.beehiveApi.JOBADS_PATH}`
    return await patchWrapper(path,body)
}

// Jobs - Images
export async function getJobImages(): Promise<ImageGetResponseProps> {
    const path = `${config.beehiveApi.IMAGES_PATH}${config.beehiveApi.JOBADS_PATH}`
    return await getWrapper(path)
}

// Jobs - Skill
export async function postSkill(body: SkillProps) {
    return await postWrapper(config.beehiveApi.SKILLS_PATH, body)
}

// Cities
export async function getCities() {
    const path = `${config.beehiveApi.CITIES_PATH}`
    return await getWrapper(path)
}

export async function postCity(body: CityProps) {
    return await postWrapper(config.beehiveApi.CITIES_PATH_2, body)
}

export async function deleteCity(body: CityProps) {
    return await deleteWrapper(config.beehiveApi.CITIES_PATH_2,body)
}

// Locations
export async function getLocations(type: string | null = null, limit: number | number = 10, offset: number | number = 0): Promise<LocationGetResponseProps> {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    if (type) queryParts.append('type', type)

    const path = `${config.beehiveApi.LOCATIONS_PATH}?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getLocation(id: number) {
    const path = `${config.beehiveApi.LOCATIONS_PATH}${id}`
    return await getWrapper(path)
}

export async function postLocation(body: PostLocationProps): Promise<LocationPostResponseProps> {
    return await postWrapper(config.beehiveApi.LOCATIONS_PATH, body)
}

export async function deleteLocation(id: number) {
    const path = `${config.beehiveApi.LOCATIONS_PATH}${id}`
    return await deleteWrapper(path)
}

export async function patchLocation(body: PatchLocationProps): Promise<LocationPatchResponseProps> {
    const path = `${config.beehiveApi.LOCATIONS_PATH}`
    return await patchWrapper(path,body)
}

// Organizations
export async function getOrganizations(limit: number | number = 10, offset: number | number = 0): Promise<OrganizationGetResponseProps> {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getOrganization(shortname: string) {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${shortname}`
    return await getWrapper(path)
}

export async function postOrganization(body: PostOrganizationProps): Promise<OrganizationPostResponseProps> {
    return await postWrapper(config.beehiveApi.ORGANIZATIONS_PATH, body)
}

export async function deleteOrganization(shortname: string) {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${shortname}`
    return await deleteWrapper(path)
}

export async function patchOrganization(shortname: string, body: PatchOrganizationProps): Promise<OrganizationPatchResponseProps> {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${shortname}`
    return await patchWrapper(path,body)
}

// Organizations - Images
export async function getOrganizationImages(): Promise<ImageGetResponseProps> {
    const path = `${config.beehiveApi.IMAGES_PATH}${config.beehiveApi.ORGANIZATIONS_PATH}`
    return await getWrapper(path)
}

// Rules
export async function getRules(limit: number | number = 10, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    const path = `${config.beehiveApi.RULES_PATH}?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getRule(id: number): Promise<RuleGetResponseProps> {
    const path = `${config.beehiveApi.RULES_PATH}?${id}`
    return await getWrapper(path)
}

export async function postRule(body: PostRuleProps): Promise<RulePostResponseProps> {
    return await postWrapper(config.beehiveApi.RULES_PATH, body)
}

export async function patchRule(body: PatchRuleProps): Promise<RulePatchResponseProps> {
    return await patchWrapper(config.beehiveApi.RULES_PATH, body)
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
        if (!response.ok) {
            throw new Error(await response.json())
        }
        
        const data = await response.json()
        return data
    // eslint-disable-next-line
    } catch (error: any) {
        console.error(JSON.stringify(error))
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
        if (!response.ok) {
            return await response.json()
        }
        
        const data = await response.json()
        return data
    // eslint-disable-next-line
    } catch (error: any) {
        console.error(JSON.stringify(error))
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

async function patchWrapper(path: string, options = {}) {
    const defaultOptions = {
        method: 'PATCH',
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
