import getImages from '@utils/api/workerbee/images/getImages'
import OrganizationFields from '../client/organizationFields'
import config from '@config'

export default async function OrganizationForm({ defaultValues }: { defaultValues?: GetOrganizationProps }) {
    const imagesResponse = await getImages('organizations')
    const images = Array.isArray(imagesResponse)
        ? imagesResponse.map((image) => ({
            label: image,
            value: image,
            image: `${config.url.cdn}/img/organizations/${image}`,
        }))
        : []

    return (
        <OrganizationFields
            defaultValues={defaultValues}
            defaultImages={images}
        />
    )
}
