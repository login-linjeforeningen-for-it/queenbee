import { getChannels, getJobImages, getOrganizations, getRoles } from '@utils/api'
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

    const applicationTypes: { label: string; value: job_type }[] = [
        { label: 'Full-time', value: 'full' },
        { label: 'Part-time', value: 'part' },
        { label: 'Summer', value: 'summer' },
        { label: 'Verv', value: 'verv' },
    ]

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
            applicationTypes={applicationTypes}
            jobImages={jobImages}
            preview={parent?.preview}
            channels={channels}
            roles={roles}
        />
    )
}
