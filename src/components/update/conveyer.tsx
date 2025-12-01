type ConveyerProps = {
    className?: string
    wheels: string
    belt: string
    containers: string
    middleContainer: string
}

export default function Conveyer({ className, wheels, belt, containers, middleContainer }: ConveyerProps) {
    const style = `stroke stroke-5 rounded-lg ${belt}`
    const containerStyle = `stroke stroke-5 rounded-lg ${containers}`
    const middleContainerStyle = `stroke stroke-5 rounded-lg ${middleContainer ? middleContainer : containers}`

    return (
        <svg className={`w-16 h-8 p-[1.2px] ${className}`} id='conveyer' viewBox='0 0 256.23 103.04'>
            {/* belt */}
            <rect fill='none' className={style} x='2' y='74.55' width='252.23' height='26.49' rx='10' ry='10' />
            {/* containers */}
            <rect fill='none' className={containerStyle} x='17.42' y='2' width='60' height='60' rx='8' ry='8' />
            <rect fill='none' className={middleContainerStyle} x='98.12' y='2' width='60' height='60' rx='8' ry='8' />
            <rect fill='none' className={containerStyle} x='178.81' y='2' width='60' height='60' rx='8' ry='8' />
            {/* belt */}
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='142.46' cy='87.8' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='171.13' cy='87.8' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='199.81' cy='87.8' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='228.49' cy='87.8' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='27.74' cy='87.8' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='56.42' cy='87.8' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='85.1' cy='87.8' r='5' />
            <circle fill='none' className={`stroke stroke-[3px] ${wheels}`} cx='113.78' cy='87.8' r='5' />
            {/* cross */}
            <rect
                className='stroke stroke-2 hidden group-hover:block'
                fill={'red'}
                x='126.12'
                y='-13.03'
                width='6'
                height='92.99'
                rx='3'
                ry='3'
                transform='translate(13.86 100.39) rotate(-45)'
            />
            <rect
                className='stroke stroke-2 hidden group-hover:block'
                fill={'red'}
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
