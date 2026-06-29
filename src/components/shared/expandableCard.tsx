import { type ElementType, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button, Card, IconBubble, PulseDot } from 'uibee/components'

type Tone = 'amber' | 'blue' | 'emerald' | 'rose' | 'slate' | 'violet' | 'orange'
type PulseVariant = 'online' | 'offline' | 'warning' | 'unknown'

type Props = {
    icon: ElementType
    iconTone?: Tone
    title: string
    subtitle?: ReactNode
    pulse?: { variant: PulseVariant; label: string }
    trailing?: ReactNode
    isExpanded: boolean
    onToggle: () => void
    children?: ReactNode
}

export default function ExpandableCard({
    icon,
    iconTone = 'orange',
    title,
    subtitle,
    pulse,
    trailing,
    isExpanded,
    onToggle,
    children,
}: Props) {
    return (
        <Card>
            <div
                role='button'
                tabIndex={0}
                onClick={onToggle}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() }
                }}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
                className='group flex cursor-pointer select-none items-center gap-4 px-5 py-4'
            >
                <IconBubble icon={icon} tone={iconTone} size='sm' />
                <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap items-center gap-3'>
                        <span className='font-semibold text-login-50 transition group-hover:text-login'>{title}</span>
                        {pulse && (
                            <span className='flex items-center gap-2 text-xs text-login-300'>
                                <span className='flex h-3 w-3 shrink-0 items-center justify-center'>
                                    <PulseDot variant={pulse.variant} size='sm' />
                                </span>
                                {pulse.label}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <div className='mt-0.5 text-xs text-login-300'>{subtitle}</div>
                    )}
                </div>
                {trailing && (
                    <div className='flex shrink-0 items-center gap-3' onClick={(e) => e.stopPropagation()}>
                        {trailing}
                    </div>
                )}
                <Button
                    variant='secondary'
                    icon={<ChevronDown className={`h-4.5 w-4.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            {isExpanded && children && (
                <div className='border-t border-white/5 px-5 pb-5 pt-4'>
                    {children}
                </div>
            )}
        </Card>
    )
}
