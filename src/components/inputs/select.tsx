'use client'

import { useState } from 'react'
import { Eraser } from 'lucide-react'
import ToolTip from './tooltip'
import Error from '@components/inputs/error'

type SelectProps = {
    name: string
    label: string
    options: { value: string; label: string }[]
    className?: string
    tooltip?: string
    required?: boolean
} 

export default function Select({name, label, options, className, tooltip, required}: SelectProps) {
    const [selectedValue, setSelectedValue] = useState('')
    const [hasBlured, setHasBlured] = useState(false)

    return (
        <div>
            <div className={`relative w-3xs flex items-center ${className}`}>
                <select
                    name={name}
                    className='peer bg-normal block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border-[0.10rem] appearance-none border-almostbright focus:outline-none focus:ring-0 focus:border-bright cursor-pointer'
                    value={selectedValue}
                    onChange={(e) => {setSelectedValue(e.target.value); (e.target as HTMLSelectElement).blur()} }
                    onBlur={() => setHasBlured(true)}
                >
                    <option value='' hidden />
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <label
                    className={`pointer-events-none absolute text-sm duration-300 transform ${selectedValue ? '-translate-y-4 scale-75 top-2' : '-translate-y-1/2 scale-100 top-1/2'} origin-[0] bg-normal px-2 peer-focus:px-2 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-2 ${required && !selectedValue && hasBlured ? 'text-red-500/50 after:content-["_*"]' : ''}`}
                >
                    {label}
                </label>
                {selectedValue && <button
                    type='button'
                    onClick={() => setSelectedValue('')}
                    className='absolute right-1 cursor-pointer px-2 py-1 hover:bg-light rounded-md'
                >
                    <Eraser className='w-5' />
                </button>}
                {!selectedValue && tooltip && <ToolTip info={tooltip} />}
            </div>
            {required && !selectedValue && hasBlured && <Error message='This field is required' />}
        </div>
    )
}
