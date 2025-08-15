'use client'

import { useState } from 'react'
import ToolTip from './tooltip'

type SwitchProps = {
    name: string
    label: string
    className?: string
    tooltip?: string
}

export default function Switch({ name, label, className, tooltip }: SwitchProps) {
    const [isChecked, setIsChecked] = useState(false)

    return (
        <div className={`relative w-full flex items-center p-2 border-almostbright rounded-lg border-[0.10rem] ${className}`}>
            <label className='flex items-center cursor-pointer'>
                <input
                    type='checkbox'
                    name={name}
                    className='sr-only'
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                />
                <div className={`w-10 h-6 bg-almostbright rounded-full p-1 transition ${isChecked ? 'bg-bright' : ''}`}>
                    <div className={`w-4 h-4 bg-normal rounded-full shadow-md transform transition ${isChecked ? 'translate-x-4' : ''}`}></div>
                </div>
            </label>
            <span className='ml-3 text-sm'>{label}</span>
            {tooltip && <ToolTip info={tooltip} />}
        </div>
    )
}