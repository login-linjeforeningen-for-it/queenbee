import { getOrganizationImages } from '@utils/api'
import OrganizationFormInputsClient from '../client/organizations'

export default async function OrganizationFormInputs({ defaultValues, parent }:
{ defaultValues?: GetOrganizationProps, parent?: { preview?: boolean }}) {
    const imagesResponse = await getOrganizationImages()
    // prettier-ignore
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
            preview={parent?.preview}
        />
    )
}
