import { getAnnouncements, getEvents, getJobs, getLocations, getOrganizations } from '@utils/api'

export default async function getStatics() {
    const events = await getEvents()
    const jobs = await getJobs()
    const announcements = await getAnnouncements()
    const organizations = await getOrganizations()
    const locations = await getLocations()

    return {
        events: events?.length ?? 0,
        jobs: jobs?.length ?? 0,
        announcements: announcements?.length ?? 0,
        organizations: organizations?.length ?? 0,
        locations: locations?.length ?? 0,
    }
}
