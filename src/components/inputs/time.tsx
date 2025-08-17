'use client'

import { useState } from 'react'
import ToolTip from './tooltip'
import Error from '@components/inputs/error'
import Label from './label'
import EraseButton from './erase'

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
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center'>
                <input
                    type='time'
                    name={name}
                    className='peer block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border-[0.10rem] appearance-none border-almostbright focus:outline-none focus:ring-0 focus:border-bright peer'
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    onBlur={() => setHasBlured(true)}
                    required={required}
                />
                <Label label={label} required={required} value={timeValue} showRequired={required && !timeValue && hasBlured} />
                {timeValue && <EraseButton setData={setTimeValue} />}
                {!timeValue && tooltip && <ToolTip info={tooltip} />}
            </div>
            {required && !timeValue && <Error message='This field is required' className={`${hasBlured ? '' : 'hidden group-[.submitted]:flex'}`} />}
        </div>
    )
}