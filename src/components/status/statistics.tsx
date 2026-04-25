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
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='rounded-xl border border-white/5 bg-transparent p-4 flex flex-col items-center justify-center gap-1'>
                <h1 className='text-sm font-medium text-muted-foreground uppercase tracking-wider'>Up</h1>
                <h1 className='text-2xl font-bold text-emerald-500'>{up}</h1>
            </div>
            <div className='rounded-xl border border-white/5 bg-transparent p-4 flex flex-col items-center justify-center gap-1'>
                <h1 className='text-sm font-medium text-muted-foreground uppercase tracking-wider'>Down</h1>
                <h1 className='text-2xl font-bold text-red-500'>{down}</h1>
            </div>
            <div className='rounded-xl border border-white/5 bg-transparent p-4 flex flex-col items-center justify-center gap-1'>
                <h1 className='text-sm font-medium text-muted-foreground uppercase tracking-wider'>Maintenance</h1>
                <h1 className='text-2xl font-bold text-purple-500'>{maintenance}</h1>
            </div>
            <div className='rounded-xl border border-white/5 bg-transparent p-4 flex flex-col items-center justify-center gap-1'>
                <h1 className='text-sm font-medium text-muted-foreground uppercase tracking-wider'>Pending</h1>
                <h1 className='text-2xl font-bold text-login-500'>{pending}</h1>
            </div>
        </div>
    )
}
