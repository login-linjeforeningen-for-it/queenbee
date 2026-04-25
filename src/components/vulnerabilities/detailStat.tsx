export default function DetailStat({
    label,
    value,
    mono = false,
}: {
    label: string
    value: string
    mono?: boolean
}) {
    return (
        <div className='flex flex-col gap-1'>
            <div className='text-[10px] font-semibold uppercase tracking-[0.15em] text-login-200'>{label}</div>
            <div className={`break-all text-sm text-login-50 ${mono ? 'font-mono' : ''}`}>{value}</div>
        </div>
    )
}
