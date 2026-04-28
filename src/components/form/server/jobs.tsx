import getAllOrganizations from '@utils/api/workerbee/organizations/getAllOrganizations'
import JobFields from '../client/jobFields'
import getTypes from '@utils/api/workerbee/jobs/getTypes'
import getImages from '@utils/api/workerbee/images/getImages'
import getRoles from '@utils/api/bot/announcements/getRoles'
import getChannels from '@utils/api/bot/announcements/getChannels'
import config from '@config'

export default async function JobForm({ defaultValues }: { defaultValues?: GetJobProps }) {
    const organizationsResponse = await getAllOrganizations()
    const organizations = typeof organizationsResponse !== 'string' ? organizationsResponse : []
    const organizationsOptions = Array.isArray(organizations)
        ? organizations.map((organization) => ({
            label: organization.name_en,
            value: organization.id,
            nameNo: organization.name_no,
        }))
        : []

    const jobTypesResponse = await getTypes()
    const jobTypes = typeof jobTypesResponse !== 'string' ? jobTypesResponse.job_types : []
    const jobTypesOptions = Array.isArray(jobTypes)
        ? jobTypes.map((type) => ({
            label: type.name_en,
            value: type.id,
            nameNo: type.name_no,
        }))
        : []

    const imagesResponse = await getImages('jobs')
    const images = Array.isArray(imagesResponse)
        ? imagesResponse.map((image) => ({
            label: image,
            value: image,
            image: `${config.url.cdn}/img/jobs/${image}`,
        }))
        : []

    const rolesResponse = await getRoles()
    const roles = Array.isArray(rolesResponse)
        ? rolesResponse.map((role) => ({ label: role.name, value: role.id, color: role.color }))
        : []

    const channelsResponse = await getChannels()
    const channels = Array.isArray(channelsResponse)
        ? channelsResponse.map((channel) => ({ label: channel.name, value: channel.id }))
        : []

    return (
        <JobFields
            defaultValues={defaultValues}
            organizations={organizationsOptions}
            applicationTypes={jobTypesOptions}
            defaultImages={images}
            channels={channels}
            roles={roles}
        />
    )
}
