import { getRule } from '@utils/api'

export default async function Page({ params }: { params: Promise<{ id?: string[] }> }) {
    const { id } = await params
    if (id) {
        const rule = await getRule(Number(id[0]))
        if (typeof rule === 'object' && Object.keys(rule).length > 0) {
            return (
                <div className='h-[var(--h-pageInfo)]'>
                    <h1 className='font-semibold text-lg'>Copy from: {rule.name_en}</h1>
                </div>
            )
        }
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className='font-semibold text-lg'>New rule</h1>
        </div>
    )
}
