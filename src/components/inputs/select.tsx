'use client'

import { useState } from 'react'
import ToolTip from './tooltip'
import Error from '@components/inputs/error'
import Label from './label'
import EraseButton from './erase'

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
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center'>
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
                <Label label={label} value={selectedValue} required={required} showRequired={required && !selectedValue && hasBlured} />
                {selectedValue && <EraseButton setData={setSelectedValue} />}
                {!selectedValue && tooltip && <ToolTip info={tooltip} />}
            </div>
            {required && !selectedValue && <Error message='This field is required' className={`${hasBlured ? '' : 'hidden group-[.submitted]:flex'}`} />}
        </div>
    )
}
