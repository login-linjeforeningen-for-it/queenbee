'use server'

import config from '@config'
import { deleteWrapper, getWrapper, postWrapper, putWrapper } from '@utils/apiWrapper'
import { authentikApiWrapper } from '@utils/apiAuthentik'

type GetParamsProps = {
    type?: string
    search?: string
    offset?: number
    limit?: number
    orderBy?: string
    sort?: 'asc' | 'desc'
    historical?: boolean
}

// ---------------------------------- Events -----------------------------------

export async function getEvents({ search, offset, limit, orderBy, sort, historical }: GetParamsProps): Promise<GetEventsProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (limit)      queryParts.append('limit', String(limit))
    if (offset)     queryParts.append('offset', String(offset))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))
    if (historical) queryParts.append('historical', String(historical))

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

export async function postEvent(body: PostEventProps, repeat_type?: string, repeat_until?: string): Promise<PostEventProps | string> {
    const queryParts = new URLSearchParams()
    if (repeat_type) queryParts.append('repeat_type', String(repeat_type))
    if (repeat_until) queryParts.append('repeat_until', String(repeat_until))

    const path = `${config.workerbeeApi.events.PATH}?${queryParts.toString()}`
    return await postWrapper({ path, data: body })
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

// ---------------------------------- Jobs -------------------------------------

export async function getJobs({ search, limit, offset, orderBy, sort, historical }: GetParamsProps = {}): Promise<GetJobsProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (limit)      queryParts.append('limit', String(limit))
    if (offset)     queryParts.append('offset', String(offset))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))
    if (historical) queryParts.append('historical', String(historical))

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

// ---------------------------------- Organizations ----------------------------

export async function getOrganizations({ search, offset, limit, orderBy, sort }: GetParamsProps = {}):
Promise<GetOrganizationsProps | string>
{
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (limit)      queryParts.append('limit', String(limit))
    if (offset)     queryParts.append('offset', String(offset))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
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

// ---------------------------------- Locations --------------------------------

export async function getLocations({ type, search, offset, limit, orderBy, sort }: GetParamsProps = {}):
Promise<GetLocationsProps | string> {
    const queryParts = new URLSearchParams()
    if (type)       queryParts.append('type', type)
    if (search)     queryParts.append('search', String(search))
    if (offset)     queryParts.append('offset', String(offset))
    if (limit)      queryParts.append('limit', String(limit))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
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

// ---------------------------------- Rules ------------------------------------

export async function getRules({ search, offset, limit, orderBy, sort }: GetParamsProps = {}): Promise<GetRulesProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (offset)     queryParts.append('offset', String(offset))
    if (limit)      queryParts.append('limit', String(limit))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
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

// ------------------------------- Announcements -------------------------------

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

export async function getAnnouncements({
    search, offset, limit, orderBy, sort
}: GetParamsProps & { includePlaceholders?: boolean } = {}): Promise<GetAnnouncementsProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (limit)      queryParts.append('limit', String(limit))
    if (offset)     queryParts.append('offset', String(offset))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))
    queryParts.append('includePlaceholders', 'true')

    const path = `${config.tekkomBotApi.ANNOUNCEMENT_PATH}?${queryParts.toString()}`
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

// ---------------------------------- Albums -----------------------------------

export async function getAlbums({ search, offset, limit, orderBy, sort }: GetParamsProps = {}): Promise<GetAlbumsProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (offset)     queryParts.append('offset', String(offset))
    if (limit)      queryParts.append('limit', String(limit))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const path = `${config.workerbeeApi.albums.PATH}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getAlbum(id: number): Promise<GetAlbumProps | string> {
    const path = `${config.workerbeeApi.albums.PATH}${id}`
    return await getWrapper({ path })
}

export async function postAlbum(body: PostAlbumProps): Promise<PostAlbumProps & { id: number } | string> {
    return await postWrapper({ path: config.workerbeeApi.albums.PATH, data: body })
}

export async function getShareURLs(id: number, body: {filename: string, type: string}[]): Promise<ShareURLResponse[] | string> {
    return await postWrapper({ path: `${config.workerbeeApi.albums.PATH}${id}`, data: body })
}

export async function putAlbum(id: number, body: PutAlbumProps): Promise<PutAlbumProps | string> {
    const path = `${config.workerbeeApi.albums.PATH}${id}`
    return await putWrapper({ path, data: body })
}

export async function deleteAlbum(id: number) {
    const path = `${config.workerbeeApi.albums.PATH}${id}`
    return await deleteWrapper({ path })
}

export async function deleteAlbumImage(albumId: number, imageName: string): Promise<DeleteParamsProps | string> {
    const path = `${config.workerbeeApi.albums.PATH}${albumId}/${imageName}`
    return await deleteWrapper({ path })
}

export async function putCoverImage(albumId: number, imageName: string): Promise<{message: string} | string> {
    const path = `${config.workerbeeApi.albums.PATH}${albumId}/${imageName}`
    return await putWrapper({ path, data: {} })
}

export async function compressAlbums(): Promise<{message: string} | string> {
    const path = `${config.workerbeeApi.albums.PATH}compress`
    return await putWrapper({ path, data: {} })
}

// --------------------------------- Alerts ------------------------------------

export async function getAlerts({ search, offset, limit, orderBy, sort }: GetParamsProps = {}): Promise<GetAlertsProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (offset)     queryParts.append('offset', String(offset))
    if (limit)      queryParts.append('limit', String(limit))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const path = `${config.workerbeeApi.alerts.PATH}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getAlert(id: number): Promise<GetAlertProps | string> {
    const path = `${config.workerbeeApi.alerts.PATH}id/${id}`
    return await getWrapper({ path })
}

export async function postAlert(body: PostAlertProps): Promise<PostAlertProps | string> {
    return await postWrapper({ path: config.workerbeeApi.alerts.PATH, data: body })
}

export async function putAlert(id: number, body: PutAlertProps): Promise<PutAlertProps | string> {
    const path = `${config.workerbeeApi.alerts.PATH}${id}`
    return await putWrapper({ path, data: body })
}

export async function deleteAlert(id: number) {
    const path = `${config.workerbeeApi.alerts.PATH}${id}`
    return await deleteWrapper({ path })
}

// ---------------------------------- Honey ------------------------------------

export async function getHoneyServices(): Promise<string[] | string> {
    const path = `${config.workerbeeApi.honey.SERVICES}`
    return await getWrapper({ path })
}

export async function getHoneys({ service, search, offset, limit, orderBy, sort }: GetParamsProps & { service: string }):
Promise<GetHoneysProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (offset)     queryParts.append('offset', String(offset))
    if (limit)      queryParts.append('limit', String(limit))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const path = `${config.workerbeeApi.honey.SERVICES}${service}?${queryParts.toString()}`
    return await getWrapper({ path })
}

export async function getHoney(id: number): Promise<GetHoneyProps | string> {
    const path = `${config.workerbeeApi.honey.PATH}${id}`
    return await getWrapper({ path })
}

export async function postHoney(body: PostHoneyProps): Promise<PostHoneyProps | string> {
    return await postWrapper({ path: config.workerbeeApi.honey.PATH, data: body })
}

export async function putHoney(id: number, body: PutHoneyProps): Promise<PutHoneyProps | string> {
    const path = `${config.workerbeeApi.honey.PATH}${id}`
    return await putWrapper({ path, data: body })
}

export async function deleteHoney(id: number) {
    const path = `${config.workerbeeApi.honey.PATH}${id}`
    return await deleteWrapper({ path })
}

// ---------------------------------- Images -----------------------------------

export async function getImages(type: 'events' | 'jobs' | 'organizations'): Promise<string[] | string> {
    const path = `${config.workerbeeApi.images.PATH}${type}`
    return await getWrapper({ path })
}

export async function uploadImage(type: ImagePaths, file: File): Promise<{ status: number, data: string }> {
    const path = `${config.workerbeeApi.images.PATH}${type}/`
    const formData = new FormData()
    formData.append('image', file)

    const response = await postWrapper({ path, data: formData, status: true })
    const status = response.status
    const data = response.data
    return { status, data }
}

export async function deleteImage(type: ImagePaths, imageName: string): Promise<string> {
    const path = `${config.workerbeeApi.images.PATH}${type}/${imageName}`
    return await deleteWrapper({ path })
}

// -------------------------------- Statistics ---------------------------------

export async function getStatisticsCategories(): Promise<GetStatisticsCategoriesProps | string> {
    const path = `${config.workerbeeApi.statistics.PATH}categories`
    return await getWrapper({ path })
}

export async function getStatisticsNewAdditions(): Promise<GetStatisticsNewAdditionsProps | string> {
    const path = `${config.workerbeeApi.statistics.PATH}new-additions`
    return await getWrapper({ path })
}

export async function getStatisticsYearlyActivity(): Promise<GetStatisticsYearlyActivityProps | string> {
    const path = `${config.workerbeeApi.statistics.PATH}yearly`
    return await getWrapper({ path })
}

// ---------------------------------- System -----------------------------------

export async function getStats(): Promise<Stats> {
    const path = `${config.workerbeeApi.system.stats}`
    return await getWrapper({ path, custom: 'system' })
}

export async function getDocker(): Promise<Docker> {
    const path = `${config.workerbeeApi.system.docker.path}`
    return await getWrapper({ path, custom: 'system' })
}

export async function getIngress(port: number): Promise<GetIngressProps> {
    const path = `${config.workerbeeApi.system.ingress}${port}`
    return await getWrapper({ path, custom: 'system' })
}

export async function deleteContainer(id: number) {
    const path = `${config.workerbeeApi.system.docker.path}${id}`
    return await deleteWrapper({ path, custom: 'system' })
}

// --------------------------------- Metrics -----------------------------------

export async function getApplicationMetrics() {
    return await authentikApiWrapper({
        path: '/core/applications/queenbee/metrics/',
        token: config.authentik.TOKEN
    })
}
