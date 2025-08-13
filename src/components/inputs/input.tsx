'use client'

import { HTMLInputTypeAttribute, useState } from 'react'
import ToolTip from './tooltip'
import Error from '@components/inputs/error'

type InputProps = {
    name: string
    type: HTMLInputTypeAttribute
    label: string
    className?: string
    tooltip?: string
    required?: boolean
}

export default function Input({name, type, label, className, tooltip, required}: InputProps) {
    const [value, setValue] = useState('')
    const [hasBlured, setHasBlured] = useState(false)

    return (
        <div>
            <div className={`relative w-3xs flex items-center ${className}`}>
                <input
                    name={name}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={() => setHasBlured(true)}
                    type={type}
                    className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border-[0.10rem] appearance-none border-almostbright focus:outline-none focus:ring-0 focus:border-bright peer' 
                    placeholder=''
                />
                <label
                    className={`pointer-events-none absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-normal px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-2 ${required && !value && hasBlured ? 'text-red-500/50 after:content-["_*"]' : ''}`}
                >
                    {label}
                </label>
                {tooltip && <ToolTip info={tooltip} />}
            </div>
            {required && !value && hasBlured && <Error message='This field is required' />}
        </div>
    )
}