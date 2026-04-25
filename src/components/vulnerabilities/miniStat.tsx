export default function MiniStat({
    label,
    value,
    compact = false,
}: {
    label: string
    value: string
    compact?: boolean
}) {
    return (
        <div className={`flex flex-col gap-0.5 items-start justify-center ${compact ? 'px-2' : ''}`}>
            <div className='text-[10px] font-semibold uppercase tracking-[0.15em] text-login-200'>{label}</div>
            <div className={`${compact ? 'text-sm' : 'text-lg'} font-medium text-login-50`}>{value}</div>
        </div>
    )
}
