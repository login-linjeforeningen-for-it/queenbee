type PulseDotProps = {
    status: 'available' | 'unavailable'
}

export default function PulseDot({ status }: PulseDotProps) {
    const colorClass = status === 'available' ? 'bg-green-500' : 'bg-red-500'

    return (
        <div className='relative w-2 h-2 grid place-items-center'>
            {/* Outer pulses */}
            <span className={`absolute inline-flex w-full h-full rounded-full ${colorClass} opacity-50 animate-ping`} />
            <span className={`absolute inline-flex w-full h-full rounded-full ${colorClass} opacity-40 animate-ping delay-200`} />
            <span className={`absolute inline-flex w-full h-full rounded-full ${colorClass} opacity-30 animate-ping delay-400`} />

            {/* Center dot */}
            <span className={`relative inline-flex w-2 h-2 rounded-full ${colorClass}`} />
        </div>
    )
}
