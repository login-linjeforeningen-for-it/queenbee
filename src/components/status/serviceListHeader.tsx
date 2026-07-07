import { Plus, Search } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { Button, Input, MultiSelect } from 'uibee/components'

type ServiceListHeaderProps = {
    stateFilter: string[] | null
    setStateFilter: Dispatch<SetStateAction<string[] | null>>
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
    tags,
    selectedTags,
    setAddingTag,
    setSelectedTags,
    input,
    setInput
}: ServiceListHeaderProps) {
    return (
        <div className='flex justify-between w-full items-center'>
            <div className='-mb-5 w-fit'>
                <Input
                    name='search'
                    placeholder='Search..'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    icon={<Search className='h-4 w-4 text-login-300' />}
                />
            </div>
            <div className='flex items-center gap-4'>
                <div className='-mb-5'>
                    <MultiSelect
                        name='status'
                        options={[
                            { label: 'Up', value: 'up' },
                            { label: 'Down', value: 'down' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Maintenance', value: 'maintenance' },
                        ]}
                        value={stateFilter ?? []}
                        onChange={(values) => setStateFilter(values.length ? values : null)}
                        placeholder='Status'
                    />
                </div>
                <div className='flex items-center gap-2'>
                    <div className='-mb-5'>
                        <MultiSelect
                            name='tags'
                            options={tags.map((tag) => ({ label: tag.name, value: tag.name }))}
                            value={selectedTags}
                            onChange={setSelectedTags}
                            placeholder='Tags'
                        />
                    </div>
                    <Button
                        variant='secondary'
                        icon={<Plus className='h-4 w-4' />}
                        onClick={() => setAddingTag(true)}
                    />
                </div>
            </div>
        </div>
    )
}
