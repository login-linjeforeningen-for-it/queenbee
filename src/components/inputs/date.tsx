'use client'

import { useState } from 'react'
import ToolTip from './tooltip'
import Label from './label'
import EraseButton from './erase'

type DateProps = {
    name: string
    label: string
    defaultValue?: string
    className?: string
    tooltip?: string
    required?: boolean
}

export default function DateInput({ name, label, defaultValue, className, tooltip, required }: DateProps) {
    const [selectedDate, setSelectedDate] = useState(defaultValue || '')
    const [hasBlured, setHasBlured] = useState(false)

    return (
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center'>
                <input
                    type='date'
                    name={name}
                    className='peer no-calendar bg-login-800 block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border-[0.10rem] appearance-none border-login-200 focus:outline-none focus:ring-0 focus:border-login-50 cursor-pointer'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    onFocus={(e) => e.target.showPicker()}
                    onBlur={() => setHasBlured(true)}
                    required={required}
                />
                <Label label={label} value={selectedDate} required={required} showRequired={required && !selectedDate && hasBlured} />
                {selectedDate && <EraseButton setData={setSelectedDate} />}
                {!selectedDate && tooltip && <ToolTip info={tooltip} />}
            </div>
        </div>
    )
}