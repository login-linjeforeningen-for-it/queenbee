import config from '@config'
import { cookies } from 'next/headers'

const baseUrl = config.url.API_URL
const tekkomBotApiUrl = config.url.TEKKOM_BOT_API_URL

type GetWrapperProps = {
    path: string
    options?: object
    customUrl?: string
}

type PostWrapper = {
    path: string
    data?: object
    customUrl?: string
}

type DeleteWrapperProps = {
    path: string
    options?: object
    customUrl?: string
}

type PatchWrapperProps = {
    path: string
    data?: object
    options?: object
    customUrl?: string
}

// Events
export async function getEvents(
    limit: number | number = 10,
    offset: number | number = 0
): Promise<GetEventsProps | string> {
    const queryParts = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
    })

    const path = `${config.beehiveApi.EVENTS_PATH}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getEvent(id: number) {
    const path = `${config.beehiveApi.EVENTS_PATH}${id}`
    return await getWrapper({ path })
}

export async function postEvent(
    body: PostEventProps
): Promise<PostEventProps | string> {
    return await postWrapper({ path: config.beehiveApi.EVENTS_PATH, data: body })
}

export async function deleteEvent(id: number) {
    const path = `${config.beehiveApi.EVENTS_PATH}${id}`
    return await deleteWrapper({ path })
}

export async function patchEvent(
    body: PatchEventProps
): Promise<PatchEventProps | string> {
    const path = `${config.beehiveApi.EVENTS_PATH}`
    return await patchWrapper({ path, data: body })
}

// Events - Categories
export async function getCategories(): Promise<GetCategoriesProps | string> {
    const path = `${config.beehiveApi.CATEGORIES_PATH}`
    return await getWrapper({ path })
}

export async function getAudiences(): Promise<GetAudiencesProps | string> {
    const path = `${config.beehiveApi.AUDIENCES_PATH}`
    return await getWrapper({ path })
}

export async function getAudience(id: number) {
    const path = `${config.beehiveApi.AUDIENCES_PATH}${id}`
    return await getWrapper({ path })
}

export async function postAudience(body: AudienceProps) {
    return await postWrapper({ path: config.beehiveApi.AUDIENCES_PATH_2, data: body })
}

export async function deleteAudience(body: AudienceProps) {
    return await deleteWrapper({ path: config.beehiveApi.AUDIENCES_PATH_2, options: body })
}

export async function postOrganizationEvent(
    body: PostOrganizationProps
): Promise<PostOrganizationProps | string> {
    return await postWrapper({ path: config.beehiveApi.ORGANIZATIONS_PATH_2, data: body })
}

export async function deleteOrganizationEvent(body: OrganizationEventProps) {
    return await deleteWrapper({ path: config.beehiveApi.ORGANIZATIONS_PATH_2, options: body })
}

// Event - Images
export async function getEventBannerImages(): Promise<GetImageProps | string> {
    const path =
        `${config.beehiveApi.IMAGES_PATH}` +
        `${config.beehiveApi.EVENTS_PATH}banner`
    return await getWrapper({ path })
}

export async function getEventSmallImages(): Promise<GetImageProps | string> {
    const path =
        `${config.beehiveApi.IMAGES_PATH}` +
        `${config.beehiveApi.EVENTS_PATH}small`
    return await getWrapper({ path })
}

// Jobs
export async function getJobs(
    limit: number | number = 10,
    offset: number | number = 0
) {
    const queryParts = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
    })

    const path = `${config.beehiveApi.JOBADS_PATH}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getJob(id: number) {
    const path = `${config.beehiveApi.JOBADS_PATH}${id}`
    return await getWrapper({ path })
}

export async function postJob(
    body: PostJobProps
): Promise<PostJobProps | string> {
    return await postWrapper({ path: config.beehiveApi.JOBADS_PATH, data: body })
}

export async function deleteJob(id: number) {
    const path = `${config.beehiveApi.JOBADS_PATH}${id}`
    return await deleteWrapper({ path })
}

export async function patchJob(
    body: PatchJobProps
): Promise<PatchJobProps | string> {
    const path = `${config.beehiveApi.JOBADS_PATH}`
    return await patchWrapper({ path, options: body })
}

// Jobs - Images
export async function getJobImages(): Promise<GetImageProps | string> {
    const path =
        `${config.beehiveApi.IMAGES_PATH}` + `${config.beehiveApi.JOBADS_PATH}`
    return await getWrapper({ path })
}

// Jobs - Skill
export async function postSkill(body: SkillProps) {
    return await postWrapper({ path: config.beehiveApi.SKILLS_PATH, data: body })
}

// Cities
export async function getCities() {
    const path = `${config.beehiveApi.CITIES_PATH}`
    return await getWrapper({ path })
}

export async function postCity(body: CityProps) {
    return await postWrapper({ path: config.beehiveApi.CITIES_PATH_2, data: body })
}

export async function deleteCity(body: CityProps) {
    return await deleteWrapper({ path: config.beehiveApi.CITIES_PATH_2, options: body })
}

// Locations
export async function getLocations(
    type: string | null = null,
    offset: number | number = 0,
    limit?: number
): Promise<GetLocationsProps | string> {
    const queryParts = new URLSearchParams({
        offset: String(offset),
    })
    if (type) queryParts.append('type', type)
    if (limit) queryParts.append('limit', String(limit))

    const path = `${config.beehiveApi.LOCATIONS_PATH}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getLocation(id: number) {
    const path = `${config.beehiveApi.LOCATIONS_PATH}${id}`
    return await getWrapper({ path })
}

export async function postLocation(
    body: PostLocationProps
): Promise<PostLocationProps | string> {
    return await postWrapper({ path: config.beehiveApi.LOCATIONS_PATH, data: body })
}

export async function deleteLocation(id: number) {
    const path = `${config.beehiveApi.LOCATIONS_PATH}${id}`
    return await deleteWrapper({ path })
}

export async function patchLocation(
    body: PatchLocationProps
): Promise<PatchLocationProps | string> {
    const path = `${config.beehiveApi.LOCATIONS_PATH}`
    return await patchWrapper({ path, data: body })
}

// Organizations
export async function getOrganizations(
    offset: number | number = 0,
    limit?: number
) {
    const queryParts = new URLSearchParams({
        offset: String(offset)
    })
    if (limit) queryParts.append('limit', String(limit))

    const path =
        `${config.beehiveApi.ORGANIZATIONS_PATH}?` + `${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getOrganization(shortname: string) {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${shortname}`
    return await getWrapper({ path })
}

export async function postOrganization(
    body: PostOrganizationProps
): Promise<PostOrganizationProps | string> {
    return await postWrapper({ path: config.beehiveApi.ORGANIZATIONS_PATH, data: body })
}

export async function deleteOrganization(shortname: string) {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${shortname}`
    return await deleteWrapper({ path })
}

export async function patchOrganization(
    shortname: string,
    body: PatchOrganizationProps
): Promise<PatchOrganizationProps | string> {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${shortname}`
    return await patchWrapper({ path, data: body })
}

// Organizations - Images
export async function getOrganizationImages(): Promise<GetImageProps | string> {
    const path =
        `${config.beehiveApi.IMAGES_PATH}` +
        `${config.beehiveApi.ORGANIZATIONS_PATH}`
    return await getWrapper({ path })
}

// Rules
export async function getRules(
    offset: number | number = 0,
    limit?: number
) {
    const queryParts = new URLSearchParams({
        offset: String(offset),
    })
    if (limit) queryParts.append('limit', String(limit))

    const path = `${config.beehiveApi.RULES_PATH}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getRule(id: number): Promise<GetRuleProps | string> {
    const path = `${config.beehiveApi.RULES_PATH}${id}`
    return await getWrapper({ path })
}

export async function postRule(
    body: PostRuleProps
): Promise<PostRuleProps | string> {
    return await postWrapper({ path: config.beehiveApi.RULES_PATH, data: body })
}

export async function patchRule(
    body: PatchRuleProps
): Promise<PatchRuleProps | string> {
    return await patchWrapper({ path: config.beehiveApi.RULES_PATH, data: body })
}

export async function deleteRule(id: number) {
    const path = `${config.beehiveApi.RULES_PATH}${id}`
    return await deleteWrapper({ path })
}

export async function getChannels(): Promise<Channel[] | string> {
    const path = config.tekkomBotApi.CHANNELS_PATH
    return await getWrapper({ path, customUrl: tekkomBotApiUrl })
}

// Announcements
export async function getAnnouncement(
    id: number
): Promise<GetAnnouncementProps | string> {
    const path = `${config.tekkomBotApi.ANNOUNCEMENT_PATH}/${id}`
    return await getWrapper({ path, customUrl: tekkomBotApiUrl })
}

export async function getAnnouncements(
    offset: number | number = 0,
    limit?: number
) {
    const queryParts = new URLSearchParams({
        offset: String(offset),
    })
    if (limit) queryParts.append('limit', String(limit))

    const path = `${config.tekkomBotApi.ANNOUNCEMENT_PATH}?${queryParts.toString()}`
    return await getWrapper({ path, customUrl: tekkomBotApiUrl })
}

export async function postAnnouncement(
    body: PostAnnouncementProps
): Promise<PostAnnouncementProps | string> {
    return await postWrapper({
        path: config.tekkomBotApi.ANNOUNCEMENT_PATH,
        data: body,
        customUrl: tekkomBotApiUrl
    })
}

export async function patchAnnouncement(
    body: PatchAnnouncementProps
): Promise<PatchAnnouncementProps | string> {
    return await patchWrapper({
        path: config.tekkomBotApi.ANNOUNCEMENT_PATH,
        data: body,
        customUrl: config.url.TEKKOM_BOT_API_URL
    })
}

export async function deleteAnnouncement(id: number) {
    const path = `${config.tekkomBotApi.ANNOUNCEMENT_PATH}${id}`
    return await deleteWrapper({ path })
}

async function getWrapper({ path, options = {}, customUrl }: GetWrapperProps) {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value || ''

    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${customUrl ?? baseUrl}${path}`, finalOptions)
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
        // eslint-disable-next-line
    } catch (error: any) {
        console.error(error)
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}

async function postWrapper({ path, data, customUrl }: PostWrapper) {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value || ''

    const defaultOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }

    try {
        const response = await fetch(`${customUrl ?? baseUrl}${path}`, defaultOptions)
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
        // eslint-disable-next-line
    } catch (error: any) {
        console.error(JSON.stringify(error))
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}

async function deleteWrapper({ path, options, customUrl }: DeleteWrapperProps) {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value || ''

    const defaultOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${customUrl ?? baseUrl}${path}`, finalOptions)
        const data = await response.json()

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return data
        // eslint-disable-next-line
    } catch (error: any) {
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}

async function patchWrapper({ path, data = {}, options = {}, customUrl }: PatchWrapperProps) {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value || ''

    const defaultOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${customUrl ?? baseUrl}${path}`, finalOptions)
        const data = await response.json()

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return data
        // eslint-disable-next-line
    } catch (error: any) {
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}
