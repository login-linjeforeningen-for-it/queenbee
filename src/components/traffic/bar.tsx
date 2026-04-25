export default function Bar({ label, value, total }: { label: string, value: number, total: number }) {
    const percentage = total ? (value / total) * 100 : 0
    return (
        <div className='flex items-center gap-4 min-w-0 group'>
            <div className='w-24 md:w-48 text-xs font-medium truncate text-login-100 group-hover:text-login-50 transition-colors' title={label}>
                {label}
            </div>
            <div className='flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative'>
                <div
                    className='h-full bg-linear-to-r from-login to-amber-500 rounded-full relative z-10'
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className='w-16 text-xs text-right text-login-200 tabular-nums font-mono'>{value}</div>
        </div>
    )
}
