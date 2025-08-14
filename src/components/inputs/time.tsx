'use client'

import { useState } from 'react'
import ToolTip from './tooltip'
import { Eraser } from 'lucide-react'
import Error from '@components/inputs/error'

type TimeProps = {
    name: string
    label: string
    className?: string
    tooltip?: string
    required?: boolean
}

export default function TimeInput({ name, label, className, tooltip, required }: TimeProps) {
    const [timeValue, setTimeValue] = useState('')
    const [hasBlured, setHasBlured] = useState(false)

    return (
        <div>
            <div className={`relative w-3xs flex items-center ${className}`}>
                <input
                    type='time'
                    name={name}
                    className='peer block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border-[0.10rem] appearance-none border-almostbright focus:outline-none focus:ring-0 focus:border-bright peer'
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    onBlur={() => setHasBlured(true)}
                />
                <label
                    className={`pointer-events-none absolute text-sm duration-300 transform peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:top-2 ${timeValue ? '-translate-y-4 scale-75 top-2' : '-translate-y-1/2 scale-100 top-1/2'} origin-[0] bg-normal px-2 peer-focus:px-2 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-2 ${required && !timeValue && hasBlured ? 'text-red-500/50 after:content-["_*"]' : ''} group-[.submitted]:text-red-500/50 group-[.submitted]:after:content-["_*"]`}
                >
                    {label}
                </label>
                {timeValue && <button
                    type='button'
                    onClick={() => setTimeValue('')}
                    className='absolute right-1 cursor-pointer px-2 py-1 hover:bg-light rounded-md'
                >
                    <Eraser className='w-5' />
                </button>}
                {!timeValue && tooltip && <ToolTip info={tooltip} />}
            </div>
            {required && !timeValue && <Error message='This field is required' className={`${hasBlured ? '' : 'hidden group-[.submitted]:flex'}`} />}
        </div>
    )
}