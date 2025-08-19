



'use client'

import { useState, KeyboardEvent } from 'react'
import ToolTip from './tooltip'
import Label from './label'
import EraseButton from './erase'
import { X } from 'lucide-react'

type TagInputProps = {
    name: string
    label: string
    defaultValue?: string[]
    className?: string
    tooltip?: string
    required?: boolean
}

export default function TagInput({ name, label, defaultValue = [], className, tooltip, required }: TagInputProps) {
    const [tags, setTags] = useState<string[]>(defaultValue)
    const [input, setInput] = useState('')
    const [hasBlured, setHasBlured] = useState(false)

    const addTag = (value: string) => {
        const trimmed = value.trim()
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed])
        }
    }

    const removeTag = (idx: number) => {
        setTags(tags.filter((_, i) => i !== idx))
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && input.trim()) {
            e.preventDefault()
            addTag(input)
            setInput('')
        }
        if (e.key === 'Backspace' && !input && tags.length) {
            setTags(tags.slice(0, -1))
        }
    }

    const handleErase = () => {
        setTags([])
        setInput('')
    }

    const toRemove = defaultValue.filter((tag: string) => !tags.includes(tag))
    const toAdd = tags.filter((tag: string) => !defaultValue.includes(tag))

    return (
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center flex-wrap gap-1 min-h-[3rem] border-[0.10rem] border-almostbright rounded-lg px-2.5 pt-4 pb-2.5 bg-normal'>
                <div className='flex flex-wrap gap-1 items-center w-full'>
                    {tags.map((tag, idx) => (
                        <span key={tag + idx} className='bg-light text-sm rounded px-2 py-0.75 flex items-center gap-0.5'>
                            {tag}
                            <button type='button' className='ml-1 text-red-700 hover:text-red-800' onClick={() => removeTag(idx)}><X className='h-4 stroke-3' /></button>
                        </span>
                    ))}
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => setHasBlured(true)}
                        className='peer flex-1 min-w-[6ch] bg-transparent outline-none text-sm py-1'
                        autoComplete='off'
                        required={required && tags.length === 0}
                    />
                    {toRemove.map((tag) => (
                        <input key={tag} type='hidden' name={name+'_remove'} value={tag} />
                    ))}
                    {toAdd.map((tag) => (
                        <input key={tag} type='hidden' name={name+'_add'} value={tag} />
                    ))}
                    <Label label={label} value={tags.length ? tags.join(', ') : ''} required={required} showRequired={required && tags.length === 0 && hasBlured} className='pointer-events-none left-2'/>
                </div>
                {tags.length > 0 && <EraseButton setData={handleErase} />}
                {tags.length === 0 && tooltip && <ToolTip info={tooltip} />}
            </div>
        </div>
    )
}
