import {
    getAllLocations,
    getAllOrganizations,
    getAllRules,
    getAudiences,
    getCategories,
    getChannels,
    getEventBannerImages,
    getEventSmallImages,
    getRoles,
    getTimeTypes,
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
    const categories = typeof categoriesResponse !== 'string' ? categoriesResponse.categories : []

    const categoriesOptions = Array.isArray(categories)
        ? categories.map((category) => ({
            label: category.name_en,
            value: category.id,
        }))
        : []

    const organizationsResponse = await getAllOrganizations()
    const organizations = typeof organizationsResponse !== 'string' ? organizationsResponse : []

    const organizationsOptions = Array.isArray(organizations)
        ? organizations.map((organization) => ({
            label: organization.name_en,
            value: organization.id,
        }))
        : []

    const rulesResponse = await getAllRules()
    const rules = typeof rulesResponse !== 'string' ? rulesResponse : []

    const rulesOptions = Array.isArray(rules)
        ? rules.map((rule) => ({
            label: rule.name_en,
            value: rule.id,
        }))
        : []

    const locationsResponse = await getAllLocations()
    const locations = typeof locationsResponse !== 'string' ? locationsResponse : []
    const locationsOptions = Array.isArray(locations)
        ? locations.map((location) => ({
            label: location.name_en,
            value: location.id,
        }))
        : []

    const audiencesResponse = await getAudiences()
    const audiences = typeof audiencesResponse !== 'string' ? audiencesResponse.audiences : []
    const audiencesOptions = Array.isArray(audiences)
        ? audiences.map((audience) => ({
            label: audience.name_en,
            value: audience.id,
        }))
        : []

    const timeTypes = await getTimeTypes()
    const timeTypesOptions = Array.isArray(timeTypes)
        ? timeTypes.map((type) => ({
            label: type,
            value: type
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
        <EventFormInputsClient
            defaultValues={defaultValues}
            bannerImages={bannerImages}
            smallImages={smallImages}
            audiences={audiencesOptions}
            timeTypes={timeTypesOptions}
            categories={categoriesOptions}
            organizations={organizationsOptions}
            rules={rulesOptions}
            locations={locationsOptions}
            channels={channels}
            roles={roles}
            preview={parent?.preview}
        />
    )
}
