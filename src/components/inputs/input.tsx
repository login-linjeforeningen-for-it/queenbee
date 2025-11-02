'use client'

import { HTMLInputTypeAttribute, useState } from 'react'
import ToolTip from './tooltip'
import Label from './label'

type InputProps = {
    name: string
    type: HTMLInputTypeAttribute
    multiple?: boolean
    label: string
    value?: string | number
    setValue?: (value: string | number) => void
    files?: File[] | null
    setFiles?: (files: File[] | null) => void
    className?: string
    tooltip?: string
    required?: boolean
    color?: string
}

export default function Input({
    name,
    type,
    multiple,
    label,
    className,
    tooltip,
    required,
    value,
    setValue,
    files,
    setFiles,
    color
}: InputProps) {
    const [hasBlured, setHasBlured] = useState(false)
    return (
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center'>
                <input
                    name={name}
                    value={type === 'file' ? undefined : (value || '')}
                    onChange={(e) => {
                        if (type === 'file' && setFiles) {
                            setFiles(e.target.files ? Array.from(e.target.files) : null)
                        } else if (setValue) {
                            setValue(e.target.value)
                        }
                    }}
                    onBlur={() => setHasBlured(true)}
                    type={type}
                    multiple={multiple}
                    className={
                        'block px-2.5 w-full text-sm rounded-lg ' +
                        'border-[0.10rem] appearance-none border-login-200 ' +
                        'focus:outline-none focus:ring-0 ' +
                        'focus:border-login-50 peer ' +
                        (type === 'file' ? 'pb-2 pt-3' : 'pb-2.5 pt-4')
                    }
                    placeholder=''
                    required={required}
                />
                <Label
                    label={label}
                    value={type === 'file' ? (files ? `${files.length} file(s) selected` : '') : value}
                    required={required}
                    color={color}
                    className=''
                    showRequired={required && !value && (!files || files.length === 0) && hasBlured}
                />
                {tooltip && <ToolTip info={tooltip} />}
            </div>
        </div>
    )
}
