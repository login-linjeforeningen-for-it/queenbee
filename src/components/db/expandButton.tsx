import { ChevronDown } from 'lucide-react'

type ExpandButtonProps = {
    expanded: boolean
    label: string
    onToggle: () => void
}

export default function ExpandButton({ expanded, label, onToggle }: ExpandButtonProps) {
    return (
        <button
            type='button'
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
            className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                border border-login-100/10 bg-login-50/5 text-login-100 transition
                hover:border-login-100/20 hover:bg-login-50/10 cursor-pointer'
        >
            <ChevronDown className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
    )
}
