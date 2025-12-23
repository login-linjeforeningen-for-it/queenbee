import { Search } from 'lucide-react'
import MultiSelect from './multiSelect'
import { Dispatch, SetStateAction } from 'react'

type ServiceListHeaderProps = {
    stateFilter: string[] | null
    setStateFilter: Dispatch<SetStateAction<string[] | null>>
    activeFilter: boolean | null
    setActiveFilter: Dispatch<SetStateAction<boolean | null>>
    tags: { id: string, name: string }[]
    selectedTags: string[]
    setSelectedTags: Dispatch<SetStateAction<string[]>>
    setAddingTag: Dispatch<SetStateAction<boolean>>
    input: string
    setInput: Dispatch<SetStateAction<string>>
}

export default function ServiceListHeader({
    stateFilter,
    setStateFilter,
    activeFilter,
    setActiveFilter,
    tags,
    selectedTags,
    setAddingTag,
    setSelectedTags,
    input,
    setInput
}: ServiceListHeaderProps) {
    function addTag(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        setAddingTag(true)
    }

    return (
        <div className='flex gap-2 h-fit'>
            <MultiSelect
                options={[
                    { label: 'Up', value: 'up' },
                    { label: 'Down', value: 'down' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Maintenance', value: 'maintenance' }
                ]}
                value={stateFilter ?? []}
                onChange={(values: string[]) => setStateFilter(values.length ? values : null)}
                placeholder='Status'
            />
            <select
                className='px-2 py-0.5 rounded-lg '
                value={activeFilter === null ? '' : String(activeFilter)}
                onChange={(e) =>
                    setActiveFilter(
                        e.target.value === '' ? null : e.target.value === 'true'
                    )
                }
            >
                <option value=''>All</option>
                <option value='true'>Active</option>
                <option value='false'>Inactive</option>
            </select>
            <MultiSelect
                options={tags.map((tag) => ({
                    label: tag.name,
                    value: tag.name,
                }))}
                value={selectedTags}
                onChange={setSelectedTags}
                placeholder='Tags'
                plusAction={addTag}
            />
            <div className='flex rounded-lg bg-white/10 outline outline-white/20 items-center px-2 w-fit'>
                <Search className='h-4 w-4' />
                <input
                    placeholder='Search..'
                    className='w-full rounded-lg px-2'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>
        </div>
    )
}
