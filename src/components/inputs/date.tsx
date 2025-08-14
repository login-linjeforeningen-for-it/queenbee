'use client'

import { Eraser } from 'lucide-react'
import { useState } from 'react'
import ToolTip from './tooltip'
import Error from '@components/inputs/error'

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
        <div>
            <div className={`relative w-3xs flex items-center ${className}`}>
                <input
                    type='date'
                    name={name}
                    className='peer bg-normal block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border-[0.10rem] appearance-none border-almostbright focus:outline-none focus:ring-0 focus:border-bright cursor-pointer'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    onFocus={(e) => e.target.showPicker()}
                    onBlur={() => setHasBlured(true)}
                />
                <label
                    className={`pointer-events-none absolute text-sm duration-300 peer-focus:w-fit peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:top-2 ${selectedDate ? '-translate-y-4 scale-75 top-2' : '-translate-y-1/2 scale-100 top-1/2 transform w-[calc(100%-4rem)]'} origin-[0] bg-normal px-2 py-1 peer-focus:px-2 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-2 ${required && !selectedDate && hasBlured ? 'text-red-500/50 after:content-["_*"]' : ''} group-[.submitted]:text-red-500/50 group-[.submitted]:after:content-["_*"]`}
                >
                    {label}
                </label>
                {selectedDate && <button
                    type='button'
                    onClick={() => setSelectedDate('')}
                    className='absolute right-1 cursor-pointer px-2 py-1 bg-normal hover:bg-light rounded-md'
                >
                    <Eraser className='w-5' />
                </button>}
                {!selectedDate && tooltip && <ToolTip info={tooltip} />}
            </div>
            {required && !selectedDate && <Error message='This field is required' className={`${hasBlured ? '' : 'hidden group-[.submitted]:flex'}`} />}
        </div>
    )
}