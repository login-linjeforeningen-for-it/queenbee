'use client'

import { useState } from 'react'
import ToolTip from './tooltip'

type SwitchProps = {
    name: string
    label: string
    defaultValue?: boolean
    className?: string
    tooltip?: string
}

export default function Switch({ name, label, defaultValue, className, tooltip }: SwitchProps) {
    const [isChecked, setIsChecked] = useState(defaultValue || false)

    return (
        <div className={`relative w-full flex items-center p-2 border-login-200 rounded-lg border-[0.10rem] ${className}`}>
            <label className='flex items-center cursor-pointer'>
                <input
                    type='checkbox'
                    name={name}
                    className='sr-only'
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                />
                <div className={`w-10 h-6 bg-login-200 rounded-full p-1 transition ${isChecked ? 'bg-login-50' : ''}`}>
                    <div className={`w-4 h-4 bg-login-800 rounded-full shadow-md transform transition ${isChecked ? 'translate-x-4' : ''}`}></div>
                </div>
            </label>
            <span className='ml-3 text-sm'>{label}</span>
            {tooltip && <ToolTip info={tooltip} />}
        </div>
    )
}