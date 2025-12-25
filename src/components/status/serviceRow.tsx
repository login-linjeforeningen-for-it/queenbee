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

    function handleEdit(e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        onEditClick()
    }

    return (
        <div onClick={onClick} className='flex gap-2 w-full cursor-pointer hover:bg-login-50/5 select-none group'>
            <div className='flex gap-2 w-full'>
                <h1 className={`${uptimeColor} rounded-lg outline px-2 w-14 text-center`}>{Number(service.uptime).toFixed(0)}%</h1>
                <h1 className='font-semibold overflow-auto noscroll flex-1 w-full'>{service.name}</h1>
            </div>
            <div className='flex gap-1'>
                {service.bars.toReversed().map((bar, index) => {
                    let status: 'up' | 'down' | 'maintenance' | 'pending' | null = null
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
                            w-1.5 h-full rounded-lg 
                            ${barColor(bar, service.maxConsecutiveFailures, status)} 
                            hover:scale-110 hover:brightness-110
                        `}
                    />
                })}
            </div>
            <h1
                className='hidden group-hover:grid px-4 place-items-center rounded outline outline-white/30 bg-login-50/5 text-xs'
                onClick={handleEdit}
            >Edit</h1>
        </div>
    )
}
