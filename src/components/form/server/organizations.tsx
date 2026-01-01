import getImages from '@utils/api/workerbee/images/getImages'
import OrganizationFormInputsClient from '../client/organizations'
import config from '@config'

export default async function OrganizationFormInputs({ defaultValues, parent }:
{ defaultValues?: GetOrganizationProps, parent?: { preview?: boolean }}) {
    const imagesResponse = await getImages('organizations')
    const images = Array.isArray(imagesResponse)
        ? imagesResponse.map((image) => ({
            label: image,
            value: image,
            image: `${config.url.cdn}/img/organizations/${image}`,
        }))
        : []

    return (
        <OrganizationFormInputsClient
            defaultValues={defaultValues}
            defaultImages={images}
            preview={parent?.preview}
        />
    )
}
