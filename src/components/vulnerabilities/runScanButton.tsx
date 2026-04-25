import { LoaderCircle, Play } from 'lucide-react'
import { Button } from 'uibee/components'

export default function RunScanButton({
    disabled,
    isRunning,
    onClick,
}: {
    disabled: boolean
    isRunning: boolean
    onClick: () => void
}) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            text={isRunning ? 'Scanning…' : 'Run scan'}
            icon={disabled ? <LoaderCircle className='h-4 w-4 animate-spin' /> : <Play className='h-4 w-4' />}
        />
    )
}