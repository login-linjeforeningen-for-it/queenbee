'use client'

import { useState } from 'react'
import ToolTip from './tooltip'
import Label from './label'
import EraseButton from './erase'

type TimeProps = {
    name: string
    label: string
    value: string
    setValue: (_: string) => void
    className?: string
    tooltip?: string
    required?: boolean
    disabled?: boolean
}

export default function TimeInput({
    name,
    label,
    value,
    className,
    tooltip,
    required,
    disabled,
    setValue,
}: TimeProps) {
    const [hasBlured, setHasBlured] = useState(false)

    return (
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center'>
                <input
                    type='time'
                    name={name}
                    className={
                        `${disabled ? 'text-login-400' : ''} peer block ` +
                        'px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg ' +
                        'border-[0.10rem] appearance-none border-login-200 ' +
                        'focus:outline-none focus:ring-0 ' +
                        'focus:border-login-50'
                    }
                    value={value}
                    onChange={(e) => !disabled && setValue(e.target.value)}
                    onBlur={() => setHasBlured(true)}
                    required={required}
                />
                <Label
                    label={label}
                    required={required}
                    value={value}
                    showRequired={required && !value && hasBlured}
                />
                {!disabled && value && <EraseButton setData={setValue} />}
                {!value && tooltip && <ToolTip info={tooltip} />}
            </div>
        </div>
    )
}
