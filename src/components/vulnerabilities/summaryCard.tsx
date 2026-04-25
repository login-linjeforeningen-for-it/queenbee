import type { ElementType } from 'react'

const tones = {
    blue: { bg: 'bg-sky-500/10', icon: 'text-sky-500' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-500' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-500' },
    violet: { bg: 'bg-violet-500/10', icon: 'text-violet-500' },
    rose: { bg: 'bg-rose-500/10', icon: 'text-rose-500' },
    slate: { bg: 'bg-login-50/10', icon: 'text-muted-foreground' },
} as const

export default function SummaryCard({
    title,
    value,
    icon: Icon,
    tone = 'slate',
    children,
}: {
    title: string
    value: string
    icon: ElementType
    tone?: keyof typeof tones
    children?: React.ReactNode
}) {
    const activeTone = tones[tone]
    return (
        <div className='bg-login-50/5 p-4 rounded-xl border border-white/5'>
            <div className='flex items-center gap-3 mb-3'>
                <div className={`p-2 rounded-lg ${activeTone.bg}`}>
                    <Icon className={`w-4 h-4 ${activeTone.icon}`} />
                </div>
                <span className='text-sm font-medium text-muted-foreground capitalize'>{title}</span>
            </div>
            <div className='text-lg font-semibold truncate' title={value}>
                {value}
            </div>
            {children && <div className='mt-2'>{children}</div>}
        </div>
    )
}
