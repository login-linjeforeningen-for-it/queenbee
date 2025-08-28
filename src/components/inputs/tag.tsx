



'use client'

import { useState, KeyboardEvent } from 'react'
import ToolTip from './tooltip'
import Label from './label'
import EraseButton from './erase'
import { X } from 'lucide-react'

type TagInputProps = {
    name: string
    label: string
    value: string[]
    setValue: (_: string[]) => void
    className?: string
    tooltip?: string
    required?: boolean
}

export default function TagInput({ name, label, value = [], className, tooltip, required, setValue }: TagInputProps) {
    const original = value
    const [input, setInput] = useState('')
    const [hasBlured, setHasBlured] = useState(false)

    function addTag(value: string) {
        const trimmed = value.trim()
        if (trimmed && !value.includes(trimmed)) {
            setValue([...value, trimmed])
        }
    }

    function removeTag(idx: number) {
        setValue(value.filter((_, i) => i !== idx))
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && input.trim()) {
            e.preventDefault()
            addTag(input)
            setInput('')
        }
        if (e.key === 'Backspace' && !input && value.length) {
            setValue(value.slice(0, -1))
        }
    }

    function handleErase() {
        setValue([])
        setInput('')
    }

    const toRemove = original.filter((tag: string) => !value.includes(tag))
    const toAdd = value.filter((tag: string) => !original.includes(tag))

    return (
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center flex-wrap gap-1 min-h-[3rem] border-[0.10rem] border-login-200 rounded-lg px-2.5 pt-4 pb-2.5 bg-login-800'>
                <div className='flex flex-wrap gap-1 items-center w-full'>
                    {value.map((tag, idx) => (
                        <span key={tag + idx} className='bg-login-600 text-sm rounded px-2 py-0.75 flex items-center gap-0.5'>
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
                        required={required && value.length === 0}
                    />
                    {toRemove.map((tag) => (
                        <input key={tag} type='hidden' name={name+'_remove'} value={tag} />
                    ))}
                    {toAdd.map((tag) => (
                        <input key={tag} type='hidden' name={name+'_add'} value={tag} />
                    ))}
                    <Label label={label} value={value.length ? value.join(', ') : ''} required={required} showRequired={required && value.length === 0 && hasBlured} className='pointer-events-none left-2'/>
                </div>
                {value.length > 0 && <EraseButton setData={handleErase} />}
                {value.length === 0 && tooltip && <ToolTip info={tooltip} />}
            </div>
        </div>
    )
}
