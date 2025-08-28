import { getOrganizationImages } from '@utils/api'
import OrganizationFormInputsClient from '../client/organizations'

export default async function OrganizationFormInputs({ defaultValues }: { defaultValues?: GetOrganizationProps }) {
    const imagesResponse = await getOrganizationImages()
    const images = Array.isArray(imagesResponse)
        ? imagesResponse.map((image) => ({
            label: image.name,
            value: image.name,
            image: `${image.filepath}${image.name}`,
        }))
        : []

    return (
        <OrganizationFormInputsClient
            defaultValues={defaultValues}
            images={images}
        />
    )
}
