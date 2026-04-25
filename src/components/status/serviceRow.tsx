import barColor from '@utils/status/barColor'

type ServiceRowProps = {
    onClick: () => void
    onEditClick: () => void
    uptime: number
    service: Service
    bars: Bar[]
}

export default function ServiceRow({ onClick, service, onEditClick }: ServiceRowProps) {
    const uptimeColor = service.uptime > 80
        ? 'bg-green-500/50 outline-green-500'
        : service.uptime > 50
            ? 'bg-[#fd8738]/50 outline-[#fd8738]/70'
            : 'bg-red-500/50 outline-red-500/80'

    function handleEdit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        onEditClick()
    }

    return (
        <div
            onClick={onClick}
            className={`
                flex items-center gap-4 w-full cursor-pointer hover:bg-red-50/10
                select-none group p-3 rounded-lg border border-transparent
                hover:border-white/5 transition-all
            `}
        >
            <div className='flex items-center gap-3 w-full'>
                <h1 className={`
                    ${uptimeColor} rounded-md outline px-2 py-0.5 w-14 text-center
                    text-xs font-semibold
                `}>
                    {Number(service.uptime).toFixed(0)}%
                </h1>
                <h1 className='font-medium truncate flex-1 w-full text-base'>{service.name}</h1>
            </div>
            <div className='flex gap-1 h-6 items-center'>
                {service.bars.toReversed().map((bar, index) => {
                    let status: 'up' | 'down' | 'maintenance' | 'pending' | null
                    if (service.enabled && bar.status) {
                        status = 'up'
                    } else if (service.enabled && !bar.status && bar.expectedDown) {
                        status = 'maintenance'
                    } else if (service.enabled && !bar.status && service.maxConsecutiveFailures > 0) {
                        let pendingFailed = 0
                        for (let i = 0; i < Math.min(service.maxConsecutiveFailures, service.bars.length); i++) {
                            if (!service.bars[i].status) {
                                pendingFailed++
                            }
                        }

                        if (pendingFailed < service.maxConsecutiveFailures) {
                            status = 'pending'
                        } else {
                            status = 'down'
                        }
                    } else {
                        status = 'down'
                    }

                    return <div
                        key={index}
                        className={`
                            w-1 md:w-1.5 h-full rounded-full
                            ${barColor(bar, service.maxConsecutiveFailures, status)}
                            hover:scale-110 hover:brightness-125 transition-transform cursor-crosshair
                        `}
                    />
                })}
            </div>
            <button
                className='hidden group-hover:flex px-3 py-1 items-center justify-center rounded-lg border border-white/10 bg-black/20
                    text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-white transition-colors'
                onClick={handleEdit}
            >
                Edit
            </button>
        </div>
    )
}
