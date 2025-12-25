export default function Statistics({ services }: { services: Service[] }) {
    let up = 0
    let down = 0
    let pending = 0
    let maintenance = 0

    for (const service of services) {
        const bars = service.bars
        const hasBars = Array.isArray(bars) && bars.length
        if (service.enabled && hasBars && bars[0].status) {
            up++
        } else if (service.enabled && hasBars && !bars[0].status && bars[0].expectedDown) {
            maintenance++
        } else if (service.enabled && hasBars && !bars[0].status && service.maxConsecutiveFailures > 0) {
            let pendingFailed = 0
            for (let i = 0; i < Math.min(service.maxConsecutiveFailures, service.bars.length); i++) {
                if (!service.bars[i].status) {
                    pendingFailed++
                }
            }

            if (pendingFailed < service.maxConsecutiveFailures) {
                pending++
            } else {
                down ++
            }
        } else {
            down++
        }
    }

    return (
        <div className='bg-login-50/5 p-2 rounded-lg flex gap-2 h-fit justify-evenly'>
            <div className='text-center text-lg font-semibold'>
                <h1>Up</h1>
                <h1 className='text-2xl text-green-500'>{up}</h1>
            </div>
            <div className='text-center text-lg font-semibold'>
                <h1>Down</h1>
                <h1 className='text-2xl text-red-500'>{down}</h1>
            </div>
            <div className='text-center text-lg font-semibold'>
                <h1>Maintenance</h1>
                <h1 className='text-2xl text-purple-500'>{maintenance}</h1>
            </div>
            <div className='text-center text-lg font-semibold'>
                <h1>Pending</h1>
                <h1 className='text-2xl text-login'>{pending}</h1>
            </div>
        </div>
    )
}
