type ConveyerStoppedProps = {
    className?: string
    wheels: string
    belt: string
    cross: string
}

export default function ConveyerStopped({ className, wheels, belt, cross }: ConveyerStoppedProps) {
    const style = `stroke stroke-5 rounded-lg ${belt}`

    return (
        <svg className={`w-16 h-8 p-[1.2px] ${className}`} id='conveyerstopped' viewBox='0 0 256.23 104.5'>
            {/* belt */}
            <rect fill='none' className={style} x='2' y='76.01' width='252.23' height='26.49' rx='10' ry='10' />
            {/* container */}
            <rect fill='none' className={`hidden group-hover:block ${style}`} x='98.12' y='3.46' width='60' height='60' rx='8' ry='8' />
            {/* wheels */}
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='142.46' cy='89.26' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='171.13' cy='89.26' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='199.81' cy='89.26' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='228.49' cy='89.26' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='27.74' cy='89.26' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='56.42' cy='89.26' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='85.1' cy='89.26' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='113.78' cy='89.26' r='5' />
            {/* cross */}
            <rect
                className='stroke stroke-2 group-hover:hidden'
                fill={cross}
                x='126.12'
                y='-13.03'
                width='6'
                height='92.99'
                rx='3'
                ry='3'
                transform='translate(13.86 100.39) rotate(-45)'
            />
            <rect
                className='stroke stroke-2 group-hover:hidden'
                fill={cross}
                x='126.12'
                y='-13.03'
                width='6'
                height='92.99'
                rx='3'
                ry='3'
                transform='translate(61.19 -80.79) rotate(45)'
            />
        </svg>
    )
}
