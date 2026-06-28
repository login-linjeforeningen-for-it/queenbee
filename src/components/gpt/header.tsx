import { Bot, Eye, Sparkles, Wifi, WifiOff } from 'lucide-react'
import { StatCard } from 'uibee/components'

export default function GPT_Header({
    isConnected,
    participants,
    clients
}: {
    isConnected: boolean
    participants: number
    clients: number
}) {
    return (
        <div className='w-full space-y-4'>
            <div>
                <h1 className='text-lg font-semibold text-login-50'>AI (Login GPT)</h1>
                <p className='text-sm text-login-200'>Live metrics from connected inference clients.</p>
            </div>
            <div className='grid w-full gap-3 grid-cols-2 md:grid-cols-4'>
                <StatCard icon={Sparkles} tone='orange' label='Clients' value={String(clients)} />
                <StatCard icon={Eye} label='Viewers' value={String(participants)} />
                <StatCard icon={Bot} label='Active clients' value={String(clients)} />
                <StatCard
                    icon={isConnected ? Wifi : WifiOff}
                    tone={isConnected ? 'emerald' : 'rose'}
                    label='Connection'
                    value={isConnected ? 'Connected' : 'Reconnecting'}
                />
            </div>
        </div>
    )
}
