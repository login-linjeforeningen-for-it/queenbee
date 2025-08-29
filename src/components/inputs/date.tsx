'use client'

import { useState } from 'react'
import ToolTip from './tooltip'
import Label from './label'
import EraseButton from './erase'

type DateProps = {
    name: string
    label: string
    value: string
    setValue: (_: string) => void
    className?: string
    tooltip?: string
    required?: boolean
}

export default function DateInput({
    name,
    label,
    value,
    className,
    tooltip,
    required,
    setValue,
}: DateProps) {
    const [hasBlured, setHasBlured] = useState(false)

    return (
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center'>
                <input
                    type='date'
                    name={name}
                    className={
                        'peer no-calendar bg-login-800 block ' +
                        'px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg ' +
                        'border-[0.10rem] appearance-none ' +
                        'border-login-200 focus:outline-none focus:ring-0 ' +
                        'focus:border-login-50 cursor-pointer'
                    }
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={(e) => e.target.showPicker()}
                    onBlur={() => setHasBlured(true)}
                    required={required}
                />
                <Label
                    label={label}
                    value={value}
                    required={required}
                    showRequired={required && !value && hasBlured}
                />
                {value && <EraseButton setData={setValue} />}
                {!value && tooltip && <ToolTip info={tooltip} />}
            </div>
        </div>
    )
}
