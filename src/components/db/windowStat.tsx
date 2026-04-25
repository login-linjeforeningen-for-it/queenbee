import formatDuration from '@utils/db/formatDuration'

export default function WindowStat({ label, value }: { label: string, value: number | null }) {
    return (
        <div className='rounded-xl border border-white/6 bg-login-950/45 p-3'>
            <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                {label}
            </div>
            <div className='mt-2 text-sm font-semibold text-login-100'>{formatDuration(value)}</div>
        </div>
    )
}
