import { getChannels, getJobImages, getOrganizations, getRoles, getTypes } from '@utils/api'
import JobFormInputsClient from '../client/jobs'

export default async function JobFormInputs({ defaultValues, parent }: { defaultValues?: GetJobProps, parent?: { preview?: boolean }}) {
    const organizationsResponse = await getOrganizations({ limit: 1000 })
    const organizations = typeof organizationsResponse !== 'string' ? organizationsResponse.organizations : []

    const organizationsOptions = Array.isArray(organizations)
        ? organizations.map((organization) => ({
            label: organization.name_en,
            value: organization.id,
        }))
        : []

    const applicationTypes = await getTypes()
    const applicationTypesOptions = Array.isArray(applicationTypes)
        ? applicationTypes.map((type) => ({
            label: type.en.replace(/_/g, '-').replace(/^([a-z])/, (m) => m.toUpperCase()),
            value: type.en,
        }))
        : []

    const jobImagesResponse = await getJobImages()
    // prettier-ignore
    const jobImages = Array.isArray(jobImagesResponse)
        ? jobImagesResponse.map((image) => ({
            label: image.name,
            value: image.name,
            image: `${image.filepath}${image.name}`,
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
            applicationTypes={applicationTypesOptions}
            jobImages={jobImages}
            preview={parent?.preview}
            channels={channels}
            roles={roles}
        />
    )
}
