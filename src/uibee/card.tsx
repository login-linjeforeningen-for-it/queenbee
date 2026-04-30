import type { ElementType, ReactNode } from 'react'

const tones = {
    amber: 'bg-amber-500/10 text-amber-400',
    blue: 'bg-sky-500/10 text-sky-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    rose: 'bg-rose-500/10 text-rose-400',
    slate: 'bg-login-50/8 text-login-100',
    violet: 'bg-violet-500/10 text-violet-400',
} as const

export function GlassCard({ children, className = '' }: { children: ReactNode, className?: string }) {
    return (
        <section className={`rounded-xl border border-white/5 bg-login-50/5 ${className}`}>
            {children}
        </section>
    )
}

export function IconBubble({
    icon: Icon,
    tone = 'slate',
}: {
    icon: ElementType
    tone?: keyof typeof tones
}) {
    return (
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
            <Icon className='h-4 w-4' />
        </div>
    )
}

export function StatCard({
    label,
    value,
    icon,
    tone = 'slate',
}: {
    label: string
    value: string
    icon: ElementType
    tone?: keyof typeof tones
}) {
    return (
        <GlassCard className='p-4'>
            <div className='mb-3 flex items-center gap-3'>
                <IconBubble icon={icon} tone={tone} />
                <span className='text-sm font-medium text-muted-foreground'>{label}</span>
            </div>
            <div className='truncate text-lg font-semibold' title={value}>
                {value}
            </div>
        </GlassCard>
    )
}

export function MonoBlock({ children, className = '' }: { children: ReactNode, className?: string }) {
    return (
        <div className={`break-all rounded-lg bg-login-950/45 p-3 font-mono text-xs text-login-50 ${className}`}>
            {children}
        </div>
    )
}
