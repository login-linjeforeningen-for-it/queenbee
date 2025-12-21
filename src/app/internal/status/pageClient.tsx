'use client'

import MultiSelect from '@components/status/multiSelect'
import NewService from '@components/status/newService'
import NewTag from '@components/status/newTag'
import ServiceRow from '@components/status/serviceRow'
import ServiceStatus from '@components/status/serviceStatus'
import Statistics from '@components/status/statistics'
import { Search } from 'lucide-react'
import { useState } from 'react'

export default function PageClient({ items, notifications }: { items: ServiceRow[], notifications: ServiceNotification[] }) {
    const [input, setInput] = useState('')
    const [stateFilter, setStateFilter] = useState<Bar[] | null>(null)
    const [enabledFilter, setEnabledFilter] = useState<boolean | null>(null)
    const [tags, setTags] = useState<{ id: string, name: string }[]>(items.flatMap((item) => item.tags))
    const [addingTag, setAddingTag] = useState(false)
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selected, setSelected] = useState<ServiceRow | null>(null)
    const [adding, setAdding] = useState(false)

    function addTag(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        setAddingTag(true)
        console.log('setTags unimplemented', setTags)
    }

    return (
        <div className='grid md:grid-cols-7 gap-2'>
            <NewTag display={addingTag} setAddingTag={setAddingTag} />
            <div className='col-span-3 flex gap-2'>
                <h1 onClick={() => setAdding(true)} className={`
                    bg-login/80 outline outline-login/80 px-8 py-0.5
                    hover:bg-login hover:outline-login hover:brightness-110 rounded-lg
                    w-fit cursor-pointer
                `}>Add new service</h1>
                <h1 onClick={() => { setAdding(false); setSelected(null) }} className={`
                    bg-white/20 outline outline-white/40 px-8 py-0.5
                    hover:bg-white/40 hover:outline-white/60 hover:brightness-110 rounded-lg
                    w-fit cursor-pointer
                `}>Dashboard</h1>
            </div>
            <div className='col-span-4'>
                <h1 className='text-xl font-semibold'>Statistics</h1>
            </div>
            <div className='col-span-3 bg-white/10 p-2 rounded-lg grid gap-2 max-w-full h-fit'>
                {/* left side */}
                <div className='flex gap-2 h-fit'>
                    <MultiSelect
                        options={[
                            { label: 'Up', value: 'up' },
                            { label: 'Down', value: 'down' },
                            { label: 'Pending', value: 'pending' }
                        ]}
                        value={stateFilter ?? []}
                        onChange={(values: string[]) => setStateFilter(values.length ? (values as Bar[]) : null)}
                        placeholder='Status'
                    />
                    <select
                        className='px-2 py-0.5 rounded-lg '
                        value={enabledFilter === null ? '' : String(enabledFilter)}
                        onChange={(e) =>
                            setEnabledFilter(
                                e.target.value === '' ? null : e.target.value === 'true'
                            )
                        }
                    >
                        <option value=''>Active</option>
                        <option value='true'>Enabled</option>
                        <option value='false'>Disabled</option>
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

                <div className='grid gap-2 h-fit'>
                    {items.filter(item =>
                        item.name.includes(input)
                            && stateFilter === null ? true : stateFilter?.includes(item.bars[item.bars.length - 1].status)
                                && enabledFilter === null ? true : enabledFilter === item.enabled
                                    && !selectedTags.length ? true : selectedTags!.some(tf => item.tags.some(it => it.id === tf))
                    ).map((item, index) =>
                        <ServiceRow
                            onClick={() => { setSelected(item); setAdding(false) }}
                            key={index}
                            name={item.name}
                            uptime={item.uptime}
                            bars={item.bars}
                        />
                    )}
                </div>
            </div>
            <div className='col-span-4 rounded-lg grid gap-2 h-fit'>
                <Statistics items={items} />
                {adding
                    ? <NewService notifications={notifications} />
                    : <ServiceStatus item={items.find((i) => i.name === selected?.name)} />
                }
            </div>
        </div>
    )
}
