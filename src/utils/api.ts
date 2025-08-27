import config from '@config'

const baseUrl = config.url.API_URL

async function callApi<T>(path: string, options?: RequestInit): Promise<T | string> {
    try {
        const res = await fetch(`${baseUrl}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {})
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            return await res.text()
        }

        return await res.json()
    } catch (err) {
        console.error('API client fetch failed:', err)
        return String(err)
    }
}

// Events
export async function getEvents(limit: number | number = 10, offset: number | number = 0): Promise<GetEventsProps | string> {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    const path = `${config.beehiveApi.EVENTS_PATH}?${queryParts.toString()}`
    return await callApi(path)
}

export async function getEvent(id: number): Promise<GetEventProps | string> {
    const path = `${config.beehiveApi.EVENTS_PATH}${id}`
    return await callApi(path)
}

export async function postEvent(body: PostEventProps): Promise<PostEventProps | string> {
    const path = config.beehiveApi.EVENTS_PATH
    return await callApi(path, {
        method: 'POST',
        body: JSON.stringify(body),
    })
}

export async function deleteEvent(id: number): Promise<string | void> {
    const path = `${config.beehiveApi.EVENTS_PATH}${id}`
    return await callApi(path, {
        method: 'DELETE',
    })
}

export async function patchEvent(body: PatchEventProps): Promise<PatchEventProps | string> {
    const path = `${config.beehiveApi.EVENTS_PATH}`
    return await callApi(path, {
        method: 'PATCH',
        body: JSON.stringify(body),
    })
}

// Events - Categories
export async function getCategories(): Promise<GetCategoriesProps | string> {
    const path = `${config.beehiveApi.CATEGORIES_PATH}`
    return await callApi(path)
}

export async function getAudiences(): Promise<GetAudiencesProps | string> {
    const path = `${config.beehiveApi.AUDIENCES_PATH}`
    return await callApi(path)
}

export async function getAudience(id: number) {
    const path = `${config.beehiveApi.AUDIENCES_PATH}${id}`
    return await callApi(path)
}

export async function postAudience(body: AudienceProps) {
    const path = config.beehiveApi.AUDIENCES_PATH_2
    const data = await callApi(path, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return data
}

export async function deleteAudience(body: AudienceProps) {
    const path = config.beehiveApi.AUDIENCES_PATH_2
    const data = await callApi(path, {
        method: 'DELETE',
        body: JSON.stringify(body),
    })

    return data
}

export async function postOrganizationEvent(body: PostOrganizationProps): Promise<PostOrganizationProps | string> {
    const path = config.beehiveApi.ORGANIZATIONS_PATH_2
    const data = await callApi(path, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return data as PostOrganizationProps | string
}

export async function deleteOrganizationEvent(body: OrganizationEventProps) {
    const path = config.beehiveApi.ORGANIZATIONS_PATH_2
    const data = await callApi(path, {
        method: 'DELETE',
        body: JSON.stringify(body),
    })

    return data
}

// Event - Images
export async function getEventBannerImages(): Promise<GetImageProps | string> {
    const path = `${config.beehiveApi.IMAGES_PATH}${config.beehiveApi.EVENTS_PATH}banner`
    return await callApi(path)
}

export async function getEventSmallImages(): Promise<GetImageProps | string> {
    const path = `${config.beehiveApi.IMAGES_PATH}${config.beehiveApi.EVENTS_PATH}small`
    return await callApi(path)
}


// Jobs
export async function getJobs(limit: number | number = 10, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    const path = `${config.beehiveApi.JOBADS_PATH}?${queryParts.toString()}`
    return await callApi(path)
}

export async function getJob(id: number): Promise<GetJobProps | string> {
    const path = `${config.beehiveApi.JOBADS_PATH}${id}`
    return await callApi(path)
}

export async function postJob(body: PostJobProps): Promise<PostJobProps | string> {
    const path = config.beehiveApi.JOBADS_PATH
    const data = await callApi(path, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return data as PostJobProps | string
}

export async function deleteJob(id: number) {
    const path = `${config.beehiveApi.JOBADS_PATH}${id}`
    const data = await callApi(path, { method: 'DELETE' })
    return data
}

export async function patchJob(body: PatchJobProps): Promise<PatchJobProps | string> {
    const path = config.beehiveApi.JOBADS_PATH
    const data = await callApi(path, {
        method: 'PATCH',
        body: JSON.stringify(body),
    })

    return data as PatchJobProps | string
}

// Jobs - Images
export async function getJobImages(): Promise<GetImageProps | string> {
    const path = `${config.beehiveApi.IMAGES_PATH}${config.beehiveApi.JOBADS_PATH}`
    return await callApi(path)
}

// Jobs - Skill
export async function postSkill(body: SkillProps) {
    const data = await callApi(config.beehiveApi.SKILLS_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return data
}

// Cities
export async function getCities() {
    const path = `${config.beehiveApi.CITIES_PATH}`
    return await callApi(path)
}

export async function postCity(body: CityProps) {
    const data = await callApi(config.beehiveApi.CITIES_PATH_2, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return data
}

export async function deleteCity(body: CityProps) {
    const data = await callApi(config.beehiveApi.CITIES_PATH_2, {
        method: 'DELETE',
        body: JSON.stringify(body),
    })

    return data
}

// Locations
export async function getLocations(type: string | null = null, limit: number | number = 10, offset: number | number = 0): Promise<GetLocationsProps | string> {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    if (type) queryParts.append('type', type)

    const path = `${config.beehiveApi.LOCATIONS_PATH}?${queryParts.toString()}`
    return await callApi(path)
}

export async function getLocation(id: number): Promise<GetLocationProps | string> {
    const path = `${config.beehiveApi.LOCATIONS_PATH}${id}`
    return await callApi(path)
}

export async function postLocation(
    body: PostLocationProps
): Promise<PostLocationProps | string> {
    const data = await callApi(config.beehiveApi.LOCATIONS_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return data as PostLocationProps | string
}

export async function deleteLocation(id: number) {
    const path = `${config.beehiveApi.LOCATIONS_PATH}${id}`
    const data = await callApi(path, {
        method: 'DELETE',
    })

    return data
}

export async function patchLocation(
    body: PatchLocationProps
): Promise<PatchLocationProps | string> {
    const path = `${config.beehiveApi.LOCATIONS_PATH}`
    const data = await callApi(path, {
        method: 'PATCH',
        body: JSON.stringify(body),
    })

    return data as PatchLocationProps | string
}

// Organizations
export async function getOrganizations(limit: number | number = 10, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}?${queryParts.toString()}`
    return await callApi(path)
}

export async function getOrganization(shortname: string): Promise<GetOrganizationProps | string> {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${shortname}`
    return await callApi(path)
}

export async function postOrganization(
    body: PostOrganizationProps
): Promise<PostOrganizationProps | string> {
    const data = await callApi(config.beehiveApi.ORGANIZATIONS_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return data as PostOrganizationProps | string
}

export async function deleteOrganization(shortname: string) {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${shortname}`
    const data = await callApi(path, {
        method: 'DELETE',
    })
    return data
}

export async function patchOrganization(
    shortname: string,
    body: PatchOrganizationProps
): Promise<PatchOrganizationProps | string> {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${shortname}`
    const data = await callApi(path, {
        method: 'PATCH',
        body: JSON.stringify(body),
    })

    return data as PatchOrganizationProps | string
}

// Organizations - Images
export async function getOrganizationImages(): Promise<GetImageProps | string> {
    const path = `${config.beehiveApi.IMAGES_PATH}${config.beehiveApi.ORGANIZATIONS_PATH}`
    return await callApi(path)
}

// Rules
export async function getRules(limit: number | number = 10, offset: number | number = 0) {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    const path = `${config.beehiveApi.RULES_PATH}?${queryParts.toString()}`
    return await callApi(path)
}

export async function getRule(id: number): Promise<GetRuleProps | string> {
    const path = `${config.beehiveApi.RULES_PATH}${id}`
    return await callApi(path)
}

export async function postRule(body: PostRuleProps): Promise<PostRuleProps | string> {
    const data = await callApi(config.beehiveApi.RULES_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return data as PostRuleProps | string
}

export async function patchRule(body: PatchRuleProps): Promise<PatchRuleProps | string> {
    const data = await callApi(config.beehiveApi.RULES_PATH, {
        method: 'PATCH',
        body: JSON.stringify(body),
    })
    return data as PatchRuleProps | string
}

export async function deleteRule(id: number) {
    const path = `${config.beehiveApi.RULES_PATH}${id}`
    const data = await callApi(path, {
        method: 'DELETE',
    })
    return data
}
