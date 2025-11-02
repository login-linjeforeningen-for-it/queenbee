'use server'

import config from '@config'
import { deleteWrapper, getWrapper, postWrapper, putWrapper } from '@utils/apiWrapper'


type GetParamsProps = {
    type?: string
    search?: string
    offset?: number
    limit?: number
    orderBy?: string
    sort?: 'asc' | 'desc'
}

// ------------------------------------------ Events ------------------------------------------

export async function getEvents({ search, offset, limit, orderBy, sort }: GetParamsProps = {}): Promise<GetEventsProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (limit)      queryParts.append('limit', String(limit))
    if (offset)     queryParts.append('offset', String(offset))
    if (orderBy)    queryParts.append('orderBy', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const path = `${config.workerbeeApi.events.PATH_PROTECTED}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getAllEvents(): Promise<GetAllEventsProps | string> {
    const path = `${config.workerbeeApi.events.PATH}all/`
    return await getWrapper({ path })
}

export async function getEvent(id: number): Promise<GetEventProps | string> {
    const path = `${config.workerbeeApi.events.PATH_PROTECTED}${id}`
    return await getWrapper({ path })
}

export async function postEvent(body: PostEventProps): Promise<PostEventProps | string> {
    return await postWrapper({ path: config.workerbeeApi.events.PATH, data: body })
}

export async function putEvent(id: number, body: PutEventProps): Promise<PutEventProps | string> {
    const path = `${config.workerbeeApi.events.PATH}${id}`
    return await putWrapper({ path, data: body })
}

export async function deleteEvent(id: number) {
    const path = `${config.workerbeeApi.events.PATH}${id}`
    return await deleteWrapper({ path })
}

export async function getCategories(): Promise<GetCategoriesProps | string> {
    const path = `${config.workerbeeApi.events.CATEGORIES}`
    return await getWrapper({ path })
}

export async function getAudiences(): Promise<GetAudiencesProps | string> {
    const path = `${config.workerbeeApi.events.AUDIENCES}`
    return await getWrapper({ path })
}

export async function getTimeTypes(): Promise<string[] | string> {
    const path = `${config.workerbeeApi.events.TIME_TYPES}`
    return await getWrapper({ path })
}

// ------------------------------------------ Jobs ------------------------------------------

export async function getJobs({ search, limit, offset, orderBy, sort }: GetParamsProps = {}): Promise<GetJobsProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (limit)      queryParts.append('limit', String(limit))
    if (offset)     queryParts.append('offset', String(offset))
    if (orderBy)    queryParts.append('orderBy', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const path = `${config.workerbeeApi.jobs.PATH_PROTECTED}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getJob(id: number): Promise<GetJobProps | string> {
    const path = `${config.workerbeeApi.jobs.PATH_PROTECTED}${id}`
    return await getWrapper({ path })
}

export async function postJob(body: PostJobProps): Promise<PostJobProps | string> {
    return await postWrapper({ path: config.workerbeeApi.jobs.PATH, data: body })
}

export async function putJob(id: number, body: PutJobProps): Promise<PutJobProps | string> {
    const path = `${config.workerbeeApi.jobs.PATH}${id}`
    return await putWrapper({ path, data: body })
}

export async function deleteJob(id: number) {
    const path = `${config.workerbeeApi.jobs.PATH}${id}`
    return await deleteWrapper({ path })
}

export async function getTypes(): Promise<GetJobTypesProps | string> {
    const path = `${config.workerbeeApi.jobs.TYPES}`
    return await getWrapper({ path })
}

// ------------------------------------------ Organizations ------------------------------------------

export async function getOrganizations({ search, offset, limit, orderBy, sort }: GetParamsProps = {}):
Promise<GetOrganizationsProps | string>
{
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (limit)      queryParts.append('limit', String(limit))
    if (offset)     queryParts.append('offset', String(offset))
    if (orderBy)    queryParts.append('orderBy', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getOrganization(id: number): Promise<GetOrganizationProps | string> {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${id}`
    return await getWrapper({ path })
}

export async function getAllOrganizations(): Promise<GetAllOrganizationsProps | string> {
    const path = `${config.workerbeeApi.organizations.PATH}all/`
    return await getWrapper({ path })
}

export async function postOrganization(body: PostOrganizationProps): Promise<PostOrganizationProps | string> {
    return await postWrapper({ path: config.beehiveApi.ORGANIZATIONS_PATH, data: body })
}

export async function putOrganization(id: number, body: PutOrganizationProps): Promise<PutOrganizationProps | string> {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${id}`
    return await putWrapper({ path, data: body })
}

export async function deleteOrganization(id: number) {
    const path = `${config.beehiveApi.ORGANIZATIONS_PATH}${id}`
    return await deleteWrapper({ path })
}

// ------------------------------------------ Locations ------------------------------------------

export async function getLocations({ type, search, offset, limit, orderBy, sort }: GetParamsProps = {}):
Promise<GetLocationsProps | string> {
    const queryParts = new URLSearchParams()
    if (type)       queryParts.append('type', type)
    if (search)     queryParts.append('search', String(search))
    if (offset)     queryParts.append('offset', String(offset))
    if (limit)      queryParts.append('limit', String(limit))
    if (orderBy)    queryParts.append('orderBy', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const path = `${config.workerbeeApi.locations.PATH}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getLocation(id: number): Promise<GetLocationProps | string> {
    const path = `${config.workerbeeApi.locations.PATH}${id}`
    return await getWrapper({ path })
}

export async function getAllLocations(): Promise<GetAllLocationsProps | string> {
    const path = `${config.workerbeeApi.locations.PATH}all/`
    return await getWrapper({ path })
}

export async function postLocation(body: PostLocationProps): Promise<PostLocationProps | string> {
    return await postWrapper({ path: config.workerbeeApi.locations.PATH, data: body })
}

export async function putLocation(id: number, body: PutLocationProps): Promise<PutLocationProps | string> {
    const path = `${config.workerbeeApi.locations.PATH}${id}`
    return await putWrapper({ path, data: body })
}

export async function deleteLocation(id: number) {
    const path = `${config.workerbeeApi.locations.PATH}${id}`
    return await deleteWrapper({ path })
}

// ------------------------------------------ Rules ------------------------------------------

export async function getRules({ search, offset, limit, orderBy, sort }: GetParamsProps = {}): Promise<GetRulesProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (offset)     queryParts.append('offset', String(offset))
    if (limit)      queryParts.append('limit', String(limit))
    if (orderBy)    queryParts.append('orderBy', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const path = `${config.beehiveApi.RULES_PATH}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getRule(id: number): Promise<GetRuleProps | string> {
    const path = `${config.beehiveApi.RULES_PATH}${id}`
    return await getWrapper({ path })
}

export async function getAllRules(): Promise<GetAllRulesProps | string> {
    const path = `${config.workerbeeApi.rules.PATH}all/`
    return await getWrapper({ path })
}

export async function postRule(body: PostRuleProps): Promise<PostRuleProps | string> {
    return await postWrapper({ path: config.beehiveApi.RULES_PATH, data: body })
}

export async function putRule(id: number, body: PutRuleProps): Promise<PutRuleProps | string> {
    const path = `${config.beehiveApi.RULES_PATH}${id}`
    return await putWrapper({ path, data: body })
}

export async function deleteRule(id: number) {
    const path = `${config.beehiveApi.RULES_PATH}${id}`
    return await deleteWrapper({ path })
}

// ------------------------------------------ Announcements ------------------------------------------

export async function getChannels(): Promise<ChannelResponse[] | string> {
    const path = config.tekkomBotApi.CHANNELS_PATH
    return await getWrapper({ path, custom: 'tekkom' })
}

export async function getRoles(): Promise<RoleResponse[] | string> {
    const path = config.tekkomBotApi.ROLES_PATH
    return await getWrapper({ path, custom: 'tekkom' })
}

export async function getAnnouncement(id: number): Promise<GetAnnouncementProps[] | string> {
    const path = `${config.tekkomBotApi.ANNOUNCEMENT_PATH}?id=${id}`
    return await getWrapper({ path, custom: 'tekkom' })
}

export async function getAnnouncements() {
    const path = config.tekkomBotApi.ANNOUNCEMENT_PATH
    const data = await getWrapper({ path, custom: 'tekkom' })
    return data
}

export async function postAnnouncement(body: PostAnnouncementProps): Promise<PostAnnouncementProps | string> {
    return await postWrapper({
        path: config.tekkomBotApi.ANNOUNCEMENT_PATH,
        data: body,
        custom: 'tekkom'
    })
}

export async function putAnnouncement(body: PutAnnouncementProps): Promise<PutAnnouncementProps | string> {
    return await putWrapper({
        path: config.tekkomBotApi.ANNOUNCEMENT_PATH,
        data: body,
        custom: 'tekkom'
    })
}

export async function deleteAnnouncement(id: number) {
    const path = `${config.tekkomBotApi.ANNOUNCEMENT_PATH}`
    return await deleteWrapper({
        path,
        options: { body: JSON.stringify({ id }) },
        custom: 'tekkom'
    })
}

// ------------------------------------------ Albums ------------------------------------------

export async function getAlbums({ search, offset, limit, orderBy, sort }: GetParamsProps = {}): Promise<GetAlbumsProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (offset)     queryParts.append('offset', String(offset))
    if (limit)      queryParts.append('limit', String(limit))
    if (orderBy)    queryParts.append('orderBy', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const path = `${config.workerbeeApi.albums.PATH}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getAlbum(id: number): Promise<GetAlbumProps | string> {
    const path = `${config.workerbeeApi.albums.PATH}${id}`
    return await getWrapper({ path })
}

export async function postAlbum(body: PostAlbumProps): Promise<PostAlbumProps | string> {
    return await postWrapper({ path: config.workerbeeApi.albums.PATH, data: body })
}

export async function postAlbumImages(id: number, body: File[]): Promise<object | string> {
    const formData = new FormData()
    body.forEach(file => {
        formData.append('images', file)
    })
    const path = `${config.workerbeeApi.albums.PATH}${id}`
    return await postWrapper({ path, data: formData })
}

export async function putAlbum(id: number, body: PutAlbumProps): Promise<PutAlbumProps | string> {
    const path = `${config.workerbeeApi.albums.PATH}${id}`
    return await putWrapper({ path, data: body })
}

export async function deleteAlbum(id: number) {
    const path = `${config.workerbeeApi.albums.PATH}${id}`
    return await deleteWrapper({ path })
}


// ------------------------------------------ Images ------------------------------------------

export async function getImages(type: 'events' | 'jobs' | 'organizations'): Promise<string[] | string> {
    const path = `${config.workerbeeApi.images.PATH}${type}`
    return await getWrapper({ path })
}

export async function uploadImage(type: ImagePaths, file: File): Promise<{ status: number, data: string }> {
    const path = `${config.workerbeeApi.images.PATH}${type}`
    const formData = new FormData()
    formData.append('image', file)

    const response = await postWrapper({ path, data: formData, status: true })
    // If response is a Response object:
    const status = response.status
    const data = response.data
    return { status, data }
}

export async function deleteImage(type: ImagePaths, imageName: string): Promise<string> {
    const path = `${config.workerbeeApi.images.PATH}${type}/${imageName}`
    return await deleteWrapper({ path })
}