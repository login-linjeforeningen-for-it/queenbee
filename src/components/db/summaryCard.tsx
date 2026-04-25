import type { ReactNode } from 'react'

type SummaryCardProps = {
    icon: ReactNode
    label: string
    value: string
    tone: string
}

export default function SummaryCard({ icon, label, value, tone }: SummaryCardProps) {
    return (
        <div className='rounded-2xl border border-white/5 bg-login-50/5 p-4'>
            <div className='mb-3 flex items-center gap-3'>
                <div className={`rounded-full p-2.5 ${tone}`}>
                    {icon}
                </div>
                <span className='text-sm font-medium text-muted-foreground'>{label}</span>
            </div>
            <div className='text-2xl font-semibold text-white'>{value}</div>
        </div>
    )
}
