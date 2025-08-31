import {
    getAudiences,
    getCategories,
    getEventBannerImages,
    getEventSmallImages,
    getLocations,
    getOrganizations,
    getRules,
} from '@utils/api'
import { EventFormInputsClient } from '../client/events'

export default async function EventFormInputs({
    defaultValues,
    parent,
}: {
    defaultValues?: GetEventProps
    parent?: { preview?: boolean }
}) {
    const bannerImagesResponse = await getEventBannerImages()
    // prettier-ignore
    const bannerImages = Array.isArray(bannerImagesResponse)
        ? bannerImagesResponse.map((image) => ({
            label: image.name,
            value: image.name,
            image: `${image.filepath}${image.name}`,
        }))
        : []

    const smallImagesResponse = await getEventSmallImages()
    // prettier-ignore
    const smallImages = Array.isArray(smallImagesResponse)
        ? smallImagesResponse.map((image) => ({
            label: image.name,
            value: image.name,
            image: `${image.filepath}${image.name}`,
        }))
        : []

    const categoriesResponse = await getCategories()
    // prettier-ignore
    const categories = Array.isArray(categoriesResponse)
        ? categoriesResponse.map((category) => ({
            label: category.name_en,
            value: category.id,
        }))
        : []

    const organizationsResponse = await getOrganizations()
    // prettier-ignore
    const organizations = Array.isArray(organizationsResponse)
        ? organizationsResponse.map((organization) => ({
            label: organization.name_en,
            value: organization.shortname,
        }))
        : []

    const rulesResponse = await getRules()
    // prettier-ignore
    const rules = Array.isArray(rulesResponse)
        ? rulesResponse.map((rule) => ({
            label: rule.name_en,
            value: rule.id,
        }))
        : []

    const locationsResponse = await getLocations()
    // prettier-ignore
    const locations = Array.isArray(locationsResponse)
        ? locationsResponse.map((location) => ({
            label: location.name_no,
            value: location.id,
        }))
        : []

    const audiencesResponse = await getAudiences()
    // prettier-ignore
    const audiences = Array.isArray(audiencesResponse)
        ? audiencesResponse.map((audience) => ({
            label: audience.name_en,
            value: audience.id,
        }))
        : []

    const timeTypes: { label: string; value: time_type }[] = [
        { label: 'Default', value: 'default' },
        { label: 'No end', value: 'no_end' },
        { label: 'Whole day', value: 'whole_day' },
        { label: 'To Be Determined', value: 'tbd' },
    ]

    return (
        <EventFormInputsClient
            defaultValues={defaultValues}
            bannerImages={bannerImages}
            smallImages={smallImages}
            audiences={audiences}
            timeTypes={timeTypes}
            categories={categories}
            organizations={organizations}
            rules={rules}
            locations={locations}
            preview={parent?.preview}
        />
    )
}
