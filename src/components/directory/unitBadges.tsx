import { Badge } from 'uibee/components'

export default function UnitBadges({ units }: { units: string[] }) {
    const shown = units.slice(0, 3)
    return (
        <div className='flex flex-nowrap gap-1' title={units.join(', ')}>
            {shown.map(unit => <Badge key={unit} text={unit} variant='default' />)}
            {units.length > shown.length && <Badge text={`+${units.length - shown.length}`} variant='default' />}
        </div>
    )
}
