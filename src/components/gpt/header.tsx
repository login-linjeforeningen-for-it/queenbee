import { Eye, Sparkles, Wifi, WifiOff } from 'lucide-react'

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
        <div className='w-full'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                <div>
                    <h1 className='text-lg font-semibold text-login-50'>AI (Login GPT)</h1>
                    <p className='max-w-2xl text-sm text-muted-foreground'>Live metrics from connected inference clients.</p>
                </div>
                <div className='grid gap-3 sm:grid-cols-3 min-w-200'>
                    <GPT_HeaderCard label='Clients' value={String(clients)} icon={<Sparkles className='h-4 w-4 stroke-login' />} />
                    <GPT_HeaderCard label='Viewers' value={String(participants)} icon={<Eye className='h-4 w-4' />} />
                    <GPT_ConnectionCard isConnected={isConnected} />
                </div>
            </div>
        </div>
    )
}

function GPT_HeaderCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className='rounded-xl border border-white/5 bg-login-50/5 p-4'>
            <div className='flex items-center justify-between text-login-200/80'>
                <span className='text-xs font-medium uppercase tracking-[0.18em]'>{label}</span>
                {icon}
            </div>
            <div className='mt-3 text-3xl font-semibold text-login-50'>{value}</div>
        </div>
    )
}

function GPT_ConnectionCard({ isConnected }: { isConnected: boolean }) {
    return (
        <div className='rounded-xl border border-white/5 bg-login-50/5 p-4'>
            <div className='flex items-center justify-between text-login-200/80'>
                <span className='text-xs font-medium uppercase tracking-[0.18em]'>Connection</span>
                {isConnected ? <Wifi className='h-4 w-4 text-emerald-400' /> : <WifiOff className='h-4 w-4 text-red-400' />}
            </div>
            <div
                className={`mt-3 text-sm font-semibold uppercase tracking-[0.18em]
                    ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}
            >
                {isConnected ? 'Connected' : 'Reconnecting'}
            </div>
        </div>
    )
}
