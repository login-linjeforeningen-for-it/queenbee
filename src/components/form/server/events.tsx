import getImages from '@utils/api/workerbee/images/getImages'
import EventFormInputsClient from '../client/events'
import getCategories from '@utils/api/workerbee/events/getCategories'
import getAllOrganizations from '@utils/api/workerbee/organizations/getAllOrganizations'
import getAllRules from '@utils/api/workerbee/rules/getAllRules'
import getAllLocations from '@utils/api/workerbee/locations/getAllLocations'
import getAudiences from '@utils/api/workerbee/events/getAudiences'
import getTimeTypes from '@utils/api/workerbee/events/getTimeTypes'
import getRoles from '@utils/api/bot/announcements/getRoles'
import getChannels from '@utils/api/bot/announcements/getChannels'
import config from '@config'

type EventFormsInputsProps = {
    defaultValues?: GetEventProps
    type: 'create' | 'update'

}

export default async function EventFormInputs({ defaultValues, type }: EventFormsInputsProps){
    const imagesResponse = await getImages('events')
    const images = Array.isArray(imagesResponse)
        ? imagesResponse.map((image) => ({
            label: image,
            value: image,
            image: `${config.url.cdn}/img/events/${image}`,
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
            label: `${location.name_en} | ${location.type}`,
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
            defaultImages={images}
            audiences={audiencesOptions}
            timeTypes={timeTypesOptions}
            categories={categoriesOptions}
            organizations={organizationsOptions}
            rules={rulesOptions}
            locations={locationsOptions}
            channels={channels}
            roles={roles}
            type={type}
        />
    )
}
