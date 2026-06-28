import { Card } from 'uibee/components'
import formatDuration from '@utils/db/formatDuration'

export default function WindowStat({ label, value }: { label: string, value: number | null }) {
    return (
        <Card className='p-3'>
            <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-login-200'>
                {label}
            </div>
            <div className='mt-2 text-sm font-semibold text-login-100'>{formatDuration(value)}</div>
        </Card>
    )
}
