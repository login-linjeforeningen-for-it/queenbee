import { getOrganization } from '@utils/api'

export default async function Page({ params }: { params: Promise<{ id?: string[] }> }) {
    const { id } = await params
    if (id) {
        const organization = await getOrganization(id[0])
        if (typeof organization === 'object' && Object.keys(organization).length > 0) {
            return (
                <div className='h-[var(--h-pageInfo)]'>
                    <h1 className='font-semibold text-lg'>Copy from: {organization.name_en}</h1>
                </div>
            )
        }
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className='font-semibold text-lg'>New organization</h1>
        </div>
    )
}
