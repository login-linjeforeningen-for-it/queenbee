
import { getJobImages, getOrganizations } from '@utils/api'
import JobFormInputsClient from '../client/jobs';

export default async function JobFormInputs({ defaultValues }: { defaultValues?: GetJobProps }) {
    const organizationsResponse = await getOrganizations()
    const organizations = Array.isArray(organizationsResponse)
        ? organizationsResponse.map((organization) => ({
            label: organization.name_en,
            value: organization.shortname,
        }))
        : []

    const applicationTypes: { label: string; value: job_type }[] = [
        { label: 'Full-time', value: 'full' },
        { label: 'Part-time', value: 'part' },
        { label: 'Summer', value: 'summer' },
        { label: 'Verv', value: 'verv' },
    ]

    const jobImagesResponse = await getJobImages()
    const jobImages = Array.isArray(jobImagesResponse)
        ? jobImagesResponse.map((image) => ({
            label: image.name,
            value: image.name,
            image: `${image.filepath}${image.name}`,
        }))
        : []

    return (
            <JobFormInputsClient
                defaultValues={defaultValues}
                organizations={organizations}
                applicationTypes={applicationTypes}
                jobImages={jobImages}
            />
        )
}
