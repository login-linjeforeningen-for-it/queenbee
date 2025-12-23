import { Dispatch, SetStateAction } from 'react'
import ServiceRow from './serviceRow'

type ServiceListProps = {
    services: Service[]
    input: string
    activeFilter: boolean | null
    stateFilter: string[] | null
    selectedTags: string[]
    setSelected: Dispatch<SetStateAction<Service | null>>
    setAdding: Dispatch<SetStateAction<boolean>>
    setEditing: Dispatch<SetStateAction<Service | null>>
}

export default function ServiceList({
    services,
    input,
    activeFilter,
    stateFilter,
    selectedTags,
    setSelected,
    setAdding,
    setEditing
}: ServiceListProps) {
    return (
        <div className='grid gap-2 h-fit'>
            {services.filter(item => {
                if (!item.name.includes(input)) {
                    return false
                }

                if (activeFilter !== null && item.enabled !== activeFilter) {
                    return false
                }

                if (stateFilter !== null) {
                    if (!item.bars.length) {
                        return false
                    }

                    const lastBar = item.bars[item.bars.length - 1]
                    const status =
                        lastBar.status
                            ? 'up'
                            : lastBar.expectedDown
                                ? 'maintenance'
                                : item.maxConsecutiveFailures > 0
                                    ? 'pending'
                                    : 'down'

                    if (!stateFilter.includes(status)) {
                        return false
                    }
                }

                if (selectedTags.length) {
                    if (!selectedTags.some(tf =>
                        item.tags.some(it => it.id === Number(tf))
                    )) {
                        return false
                    }
                }

                return true
            }).map((item, index) =>
                <ServiceRow
                    onClick={() => { setSelected(item); setAdding(false); setEditing(null) }}
                    onEditClick={() => { setEditing(item); setSelected(null); setAdding(false) }}
                    key={index}
                    service={item}
                    uptime={item.uptime}
                    bars={item.bars}
                />
            )}
        </div>
    )
}
