import { getAllOrganizations, getChannels, getImages, getRoles, getTypes } from '@utils/api'
import JobFormInputsClient from '../client/jobs'

export default async function JobFormInputs({ defaultValues, parent }: { defaultValues?: GetJobProps, parent?: { preview?: boolean }}) {
    const organizationsResponse = await getAllOrganizations()
    const organizations = typeof organizationsResponse !== 'string' ? organizationsResponse : []
    const organizationsOptions = Array.isArray(organizations)
        ? organizations.map((organization) => ({
            label: organization.name_en,
            value: organization.id,
        }))
        : []

    const jobTypesResponse = await getTypes()
    const jobTypes = typeof jobTypesResponse !== 'string' ? jobTypesResponse.job_types : []
    const jobTypesOptions = Array.isArray(jobTypes)
        ? jobTypes.map((type) => ({
            label: type.name_en,
            value: type.id,
        }))
        : []

    const imagesResponse = await getImages('jobs')
    const images = Array.isArray(imagesResponse)
        ? imagesResponse.map((image) => ({
            label: image,
            value: image,
            image: `img/jobs/${image}`,
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
        <JobFormInputsClient
            defaultValues={defaultValues}
            organizations={organizationsOptions}
            applicationTypes={jobTypesOptions}
            jobImages={images}
            preview={parent?.preview}
            channels={channels}
            roles={roles}
        />
    )
}
