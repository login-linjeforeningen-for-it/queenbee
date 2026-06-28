import { Cpu, Gauge, HardDrive, MemoryStick } from 'lucide-react'
import { Card, StatCard } from 'uibee/components'
import DisplayClient from './displayClient'

export default function GPT_Content({
    clients,
    onTestClient,
}: {
    clients: GPT_Client[]
    onTestClient: (client: GPT_Client) => void
}) {
    function averageLoad(values: number[]) {
        return values.length
            ? Math.ceil(values.reduce((sum, value) => sum + value, 0) / values.length)
            : 0
    }
    function averageValue(values: number[]) {
        return values.length
            ? values.reduce((sum, value) => sum + value, 0) / values.length
            : 0
    }

    const totalLoad = {
        ram: averageLoad(clients.map(client => averageLoad(client.ram.map(ram => ram.load * 100)))),
        cpu: averageLoad(clients.map(client => averageLoad(client.cpu.map(cpu => cpu.load * 100)))),
        gpu: averageLoad(clients.map(client => averageLoad(client.gpu.map(gpu => gpu.load * 100)))),
        tps: averageValue(clients.map(client => client.model.tps || 0)),
    }

    return (
        <div className='w-full space-y-4'>
            <div className='grid w-full gap-4 grid-cols-2 md:grid-cols-4'>
                <StatCard icon={MemoryStick} label='RAM load' value={`${totalLoad.ram}%`} />
                <StatCard icon={Cpu} label='CPU load' value={`${totalLoad.cpu}%`} />
                <StatCard icon={HardDrive} label='GPU load' value={`${totalLoad.gpu}%`} />
                <StatCard icon={Gauge} label='Throughput' value={`${totalLoad.tps.toFixed(1)} TPS`} />
            </div>

            <Card className='p-4 space-y-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold text-login-50'>Clients</h2>
                    <span
                        className='rounded-full border border-login-500/30 bg-login-600 px-3 py-1
                            text-xs font-medium uppercase tracking-[0.16em] text-login-200'
                    >
                        Live telemetry
                    </span>
                </div>
                <div className='grid w-full gap-4'>
                    {clients.map((client) => (
                        <DisplayClient
                            key={client.name}
                            client={client}
                            onTestClient={onTestClient}
                        />
                    ))}
                </div>
            </Card>
        </div>
    )
}

