import barColor from '@utils/status/barColor'

type ServiceRowProps = {
    onClick: () => void
    uptime: number
    name: string
    bars: { status: Bar, date: string, message: string }[]
}

export default function ServiceRow({ onClick, uptime, name, bars }: ServiceRowProps) {
    const uptimeColor = uptime > 80
        ? 'bg-green-500/50 outline-green-500'
        : uptime > 50
            ? 'bg-[#fd8738]/50 outline-[#fd8738]/70'
            :  'bg-red-500/50 outline-red-500/80'

    return (
        <div onClick={onClick} className='flex gap-2 w-full cursor-pointer hover:bg-white/5 select-none'>
            <div className='flex gap-2 w-full'>
                <h1 className={`${uptimeColor} rounded-lg outline px-2 w-14 text-center`}>{uptime}%</h1>
                <h1 className='font-semibold overflow-auto noscroll flex-1 w-full'>{name}</h1>
            </div>
            <div className='flex gap-1'>
                {bars.map((bar, index) => {
                    return <div
                        key={index}
                        className={`w-1.5 h-full rounded-lg ${barColor(bar.status)} hover:scale-110 hover:brightness-110`}
                    />
                })}
            </div>
        </div>
    )
}
