import getAlbums from '@utils/api/workerbee/albums/getAlbums'
import getAnnouncements from '@utils/api/workerbee/announcements/getAnnouncements'
import getEvents from '@utils/api/workerbee/events/getEvents'
import getJobs from '@utils/api/workerbee/jobs/getJobs'
import getLocations from '@utils/api/workerbee/locations/getLocations'
import getOrganizations from '@utils/api/workerbee/organizations/getOrganizations'

export default async function getStatics() {
    const [events, jobs, announcements, organizations, locations, albums] = await Promise.all([
        getEvents({limit: 1}),
        getJobs({limit: 1}),
        getAnnouncements(),
        getOrganizations({limit: 1}),
        getLocations({limit: 1}),
        getAlbums({limit: 1}),
    ])

    return {
        events:         typeof events           === 'string' ? 0 : events.total_count,
        jobs:           typeof jobs             === 'string' ? 0 : jobs.total_count,
        announcements:  typeof announcements    === 'string' ? 0 : announcements.total_count,
        organizations:  typeof organizations    === 'string' ? 0 : organizations.total_count,
        locations:      typeof locations        === 'string' ? 0 : locations.total_count,
        albums:         typeof albums           === 'string' ? 0 : albums.total_count,
    }
}
