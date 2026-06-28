import { ChevronDown } from 'lucide-react'
import { Button } from 'uibee/components'

type ExpandButtonProps = {
    expanded: boolean
    label: string
    onToggle: () => void
}

export default function ExpandButton({ expanded, label, onToggle }: ExpandButtonProps) {
    return (
        <Button
            variant='secondary'
            icon={<ChevronDown className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />}
            onClick={onToggle}
        />
    )
}
