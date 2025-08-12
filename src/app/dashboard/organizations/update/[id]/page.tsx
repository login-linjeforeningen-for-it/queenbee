import { getOrganization } from '@utils/api'
import Alert from '@components/alert/alert'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const organization = await getOrganization(id)

    if (typeof organization !== 'object' || Object.keys(organization).length === 0) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    Error loading organization
                </Alert>
            </div>
        )
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className='font-semibold text-lg'>Update organization: {organization.name_en}</h1>
        </div>
    )
}
