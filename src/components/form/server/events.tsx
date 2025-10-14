import {
    getAudiences,
    getCategories,
    getChannels,
    getEventBannerImages,
    getEventSmallImages,
    getLocations,
    getOrganizations,
    getRoles,
    getRules,
} from '@utils/api'
import { EventFormInputsClient } from '../client/events'

export default async function EventFormInputs({ defaultValues, parent }: { defaultValues?: GetEventProps; parent?: { preview?: boolean } }){
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
            label: category.name_no,
            value: category.id,
        }))
        : []

    const organizationsResponse = await getOrganizations({ limit: 20 })
    const organizations = typeof organizationsResponse !== 'string' ? organizationsResponse.organizations : []

    const organizationsOptions = Array.isArray(organizations)
        ? organizations.map((organization) => ({
            label: organization.name_en,
            value: organization.id,
        }))
        : []

    const rulesResponse = await getRules()
    const rules = typeof rulesResponse !== 'string' ? rulesResponse.rules : []

    const rulesOptions = Array.isArray(rules)
        ? rules.map((rule) => ({
            label: rule.name_no,
            value: rule.id,
        }))
        : []

    const locationsResponse = await getLocations()
    const locations = typeof locationsResponse !== 'string' ? locationsResponse.locations : []

    const locationsOptions = Array.isArray(locations)
        ? locations.map((location) => ({
            label: location.name_no,
            value: location.id,
        }))
        : []

    const audiencesResponse = await getAudiences()
    // prettier-ignore
    const audiences = Array.isArray(audiencesResponse)
        ? audiencesResponse.map((audience) => ({
            label: audience.name_no,
            value: audience.id,
        }))
        : []

    const timeTypes: { label: string; value: time_type }[] = [
        { label: 'Default', value: 'default' },
        { label: 'No end', value: 'no_end' },
        { label: 'Whole day', value: 'whole_day' },
        { label: 'To Be Determined', value: 'tbd' },
    ]

    const rolesResponse = await getRoles()
    const roles = Array.isArray(rolesResponse)
        ? rolesResponse.map((role) => ({ label: role.name, value: role.id, color: role.color }))
        : []

    const channelsResponse = await getChannels()
    const channels = Array.isArray(channelsResponse)
        ? channelsResponse.map((channel) => ({ label: channel.name, value: channel.id }))
        : []

    return (
        <EventFormInputsClient
            defaultValues={defaultValues}
            bannerImages={bannerImages}
            smallImages={smallImages}
            audiences={audiences}
            timeTypes={timeTypes}
            categories={categories}
            organizations={organizationsOptions}
            rules={rulesOptions}
            locations={locationsOptions}
            channels={channels}
            roles={roles}
            preview={parent?.preview}
        />
    )
}
