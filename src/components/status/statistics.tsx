import { ShieldCheck, ShieldAlert, Wrench, Clock } from 'lucide-react'
import { StatCard } from 'uibee/components'

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
                if (!service.bars[i].status) pendingFailed++
            }
            if (pendingFailed < service.maxConsecutiveFailures) {
                pending++
            } else {
                down++
            }
        } else {
            down++
        }
    }

    return (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <StatCard label='Up' value={String(up)} icon={ShieldCheck} tone='emerald' />
            <StatCard label='Down' value={String(down)} icon={ShieldAlert} tone='rose' />
            <StatCard label='Maintenance' value={String(maintenance)} icon={Wrench} tone='violet' />
            <StatCard label='Pending' value={String(pending)} icon={Clock} tone='amber' />
        </div>
    )
}
