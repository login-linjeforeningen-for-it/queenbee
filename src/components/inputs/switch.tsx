'use client'

import ToolTip from './tooltip'

type SwitchProps = {
    name: string
    label: string
    value?: boolean
    setValue: (_: boolean) => void
    className?: string
    tooltip?: string
}

export default function Switch({
    name,
    label,
    value,
    className,
    tooltip,
    setValue,
}: SwitchProps) {
    return (
        <div className={`
            relative w-full flex items-center p-2 border-login-200 
            rounded-lg border-[0.10rem] ${(className || '')}
        `}>
            <label className='flex items-center cursor-pointer'>
                <input
                    type='checkbox'
                    name={name}
                    className='sr-only'
                    checked={value}
                    onChange={(e) => setValue(e.target.checked)}
                />
                <div
                    className={`
                        w-10 h-6 rounded-full p-1
                        transition ${value ? 'bg-login-50' : 'bg-login-200'}
                    `}
                >
                    <div
                        className={`
                            w-4 h-4 bg-login-800 rounded-full transition
                            shadow-md transform ${value ? 'translate-x-4' : ''}
                        `}
                    />
                </div>
            </label>
            <span className='ml-3 text-sm'>{label}</span>
            {tooltip && <ToolTip info={tooltip} />}
        </div>
    )
}
