export { Card, IconBubble, StatCard } from 'uibee/components'
import type { ReactNode } from 'react'

export function MonoBlock({ children, className = '' }: { children: ReactNode, className?: string }) {
    return (
        <div className={`break-all rounded-lg bg-login-950/45 p-3 font-mono text-xs text-login-50 ${className}`}>
            {children}
        </div>
    )
}
