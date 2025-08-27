'use client'

import { useState } from 'react'
import ToolTip from './tooltip'
import Label from './label'
import EraseButton from './erase'

type TimeProps = {
    name: string
    label: string
    defaultValue?: string
    className?: string
    tooltip?: string
    required?: boolean
    disabled?: boolean
}

export default function TimeInput({ name, label, defaultValue, className, tooltip, required, disabled }: TimeProps) {
    const [timeValue, setTimeValue] = useState(defaultValue || '')
    const [hasBlured, setHasBlured] = useState(false)

    return (
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center'>
                <input
                    type='time'
                    name={name}
                    className={`${disabled ? 'text-login-400' : ''} peer block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border-[0.10rem] appearance-none border-login-200 focus:outline-none focus:ring-0 focus:border-login-50 peer`}
                    value={timeValue}
                    onChange={(e) => !disabled && setTimeValue(e.target.value)}
                    onBlur={() => setHasBlured(true)}
                    required={required}
                />
                <Label label={label} required={required} value={timeValue} showRequired={required && !timeValue && hasBlured} />
                {!disabled && timeValue && <EraseButton setData={setTimeValue} />}
                {!timeValue && tooltip && <ToolTip info={tooltip} />}
            </div>
        </div>
    )
}