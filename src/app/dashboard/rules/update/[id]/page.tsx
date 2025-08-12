import { getRule } from '@utils/api'
import Alert from '@components/alert/alert'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const rule = await getRule(Number(id))

    if (typeof rule !== 'object' || Object.keys(rule).length === 0) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    Error loading rule
                </Alert>
            </div>
        )
    }

    return (
        <div className='h-[var(--h-pageInfo)]'>
            <h1 className='font-semibold text-lg'>Update rule: {rule.name_en}</h1>
        </div>
    )
}
