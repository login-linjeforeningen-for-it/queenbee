import { getImages } from '@utils/api'
import OrganizationFormInputsClient from '../client/organizations'

export default async function OrganizationFormInputs({ defaultValues, parent }:
{ defaultValues?: GetOrganizationProps, parent?: { preview?: boolean }}) {
    const imagesResponse = await getImages('organizations')
    const images = Array.isArray(imagesResponse)
        ? imagesResponse.map((image) => ({
            label: image,
            value: image,
            image: `img/organizations/${image}`,
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
