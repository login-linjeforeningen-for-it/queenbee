'use client'

import { useState } from 'react'
import Label from './label'
import ToolTip from './tooltip'

type JsonInputProps = {
    name: string
    label: string
    value: string
    setValue: (_: string) => void
    className?: string
    tooltip?: string
    required?: boolean
    rows?: number
    color?: string
}

export default function JsonInput({
    name,
    label,
    value,
    className,
    tooltip,
    required,
    rows = 6,
    setValue,
    color
}: JsonInputProps) {
    const [hasBlured, setHasBlured] = useState(false)
    const [isValid, setIsValid] = useState(true)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setValue(newValue)
        try {
            if (newValue.trim()) {
                JSON.parse(newValue)
            }
            setIsValid(true)
        } catch {
            setIsValid(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault()
            const textarea = e.currentTarget
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newValue = value.substring(0, start) + '    ' + value.substring(end)
            setValue(newValue)
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 4
            }, 0)
        }
    }

    return (
        <div className={`w-full ${className ?? ''}`}>
            <div className='relative'>
                <textarea
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => setHasBlured(true)}
                    rows={rows}
                    required={required}
                    className={
                        'block px-2.5 pb-2.5 pt-4 w-full text-sm ' +
                        'rounded-lg border-[0.10rem] appearance-none ' +
                        'border-login-200 focus:outline-none focus:ring-0' +
                        ' focus:border-login-50 peer resize-vertical ' +
                        `${color ? color : 'bg-login-800'} ` +
                        (!isValid ? 'border-red-500' : '')
                    }
                />

                <Label
                    label={label}
                    value={value}
                    color={color}
                    required={required}
                    showRequired={required && !value && hasBlured}
                />
                {tooltip && <ToolTip info={tooltip} />}
            </div>
            {!isValid && <p className='text-red-500 text-sm mt-1'>Invalid JSON</p>}
        </div>
    )
}