import { Search } from 'lucide-react'
import MultiSelect from './multiSelect'
import { Dispatch, SetStateAction } from 'react'
import { Input, Select } from 'uibee/components'

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
        <div className='flex justify-between w-full -mb-4'>
            <div className='w-fit'>
                <Input
                    name='search'
                    placeholder='Search..'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    icon={<Search className='h-4 w-4 text-muted-foreground' />}
                />
            </div>
            <div className='flex gap-4'>
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
                <Select
                    className='min-w-30'
                    name='activeFilter'
                    value={activeFilter === null ? '' : String(activeFilter)}
                    onChange={(val) =>
                        setActiveFilter(
                            val === '' ? null : val === 'true'
                        )
                    }
                    options={[
                        { value: '', label: 'All' },
                        { value: 'true', label: 'Active' },
                        { value: 'false', label: 'Inactive' }
                    ]}
                />
            </div>
        </div>
    )
}
