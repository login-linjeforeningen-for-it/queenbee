'use client'

import { useState } from 'react'
import ToolTip from './tooltip'
import Error from '@components/inputs/error'
import Label from './label'
import EraseButton from './erase'

type DateProps = {
    name: string
    label: string
    className?: string
    tooltip?: string
    required?: boolean
}

export default function DateInput({ name, label, className, tooltip, required }: DateProps) {
    const [selectedDate, setSelectedDate] = useState('')
    const [hasBlured, setHasBlured] = useState(false)

    return (
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center'>
                <input
                    type='date'
                    name={name}
                    className='peer no-calendar bg-normal block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border-[0.10rem] appearance-none border-almostbright focus:outline-none focus:ring-0 focus:border-bright cursor-pointer'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    onFocus={(e) => e.target.showPicker()}
                    onBlur={() => setHasBlured(true)}
                />
                <Label label={label} value={selectedDate} required={required} showRequired={required && !selectedDate && hasBlured} />
                {selectedDate && <EraseButton setData={setSelectedDate} />}
                {!selectedDate && tooltip && <ToolTip info={tooltip} />}
            </div>
            {required && !selectedDate && <Error message='This field is required' className={`${hasBlured ? '' : 'hidden group-[.submitted]:flex'}`} />}
        </div>
    )
}