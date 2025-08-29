'use client'

import { HTMLInputTypeAttribute, useState } from 'react'
import ToolTip from './tooltip'
import Label from './label'

type InputProps = {
    name: string
    type: HTMLInputTypeAttribute
    label: string
    value?: string | number
    setValue: (value: string | number) => void
    className?: string
    tooltip?: string
    required?: boolean
}

export default function Input({
    name,
    type,
    label,
    className,
    tooltip,
    required,
    value,
    setValue,
}: InputProps) {
    const [hasBlured, setHasBlured] = useState(false)

    return (
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center'>
                <input
                    name={name}
                    value={value || ''}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={() => setHasBlured(true)}
                    type={type}
                    className={
                        'block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg ' +
                        'border-[0.10rem] appearance-none border-login-200 ' +
                        'focus:outline-none focus:ring-0 ' +
                        'focus:border-login-50 peer'
                    }
                    placeholder=''
                    required={required}
                />
                <Label
                    label={label}
                    value={value}
                    required={required}
                    showRequired={required && !value && hasBlured}
                />
                {tooltip && <ToolTip info={tooltip} />}
            </div>
        </div>
    )
}
