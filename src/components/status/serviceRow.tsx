import barColor from '@utils/status/barColor'

type ServiceRowProps = {
    onClick: () => void
    onEditClick: () => void
    uptime: number
    name: string
    bars: { status: Bar, date: string, message: string }[]
}

export default function ServiceRow({ onClick, uptime, name, bars, onEditClick }: ServiceRowProps) {
    const uptimeColor = uptime > 80
        ? 'bg-green-500/50 outline-green-500'
        : uptime > 50
            ? 'bg-[#fd8738]/50 outline-[#fd8738]/70'
            : 'bg-red-500/50 outline-red-500/80'

    function handleEdit(e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        onEditClick()
    }

    return (
        <div onClick={onClick} className='flex gap-2 w-full cursor-pointer hover:bg-white/5 select-none group'>
            <div className='flex gap-2 w-full'>
                <h1 className={`${uptimeColor} rounded-lg outline px-2 w-14 text-center`}>{Number(uptime).toFixed(0)}%</h1>
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
            <h1
                className='hidden group-hover:grid px-4 place-items-center rounded outline outline-white/30 bg-white/10 text-xs'
                onClick={handleEdit}
            >Edit</h1>
        </div>
    )
}
