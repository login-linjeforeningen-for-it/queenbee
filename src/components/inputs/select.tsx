'use client'

import { useRef, useState, createContext, useContext } from 'react'
import Image from 'next/image'
import ToolTip from './tooltip'
import Label from './label'
import EraseButton from './erase'
import config from '../../../constants'

type Option = { value: string | number, label: string, image?: string }

export type SelectContextType = {
    selectedValue: string | number
    options: Option[]
}

export const SelectContext = createContext<SelectContextType | undefined>(undefined)

type SelectProps = {
    name: string
    label: string
    defaultValue?: string | number
    options: Option[]
    className?: string
    tooltip?: string
    required?: boolean
    children?: React.ReactNode
}

export default function Select({ name, label, defaultValue, options, className, tooltip, required, children }: SelectProps) {
    const [selectedValue, setSelectedValue] = useState<string | number>(defaultValue || '')
    const [hasBlured, setHasBlured] = useState(false)
    const selectRef = useRef<HTMLSelectElement | null>(null)
    const selectedOption = options.find(o => o.value === selectedValue)

    const handleChoose = (value: string | number) => {
        setSelectedValue(value)
        setHasBlured(true)
        if (selectRef.current) {
            selectRef.current.value = String(value)
            selectRef.current.blur()
        }
    }

    return (
        <SelectContext.Provider value={{ selectedValue, options }}>
            <div className={`w-full ${className}`}>
                <div className='relative flex items-center'>
                    <select
                        ref={selectRef}
                        name={name}
                        className='peer bg-normal block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border-[0.10rem] appearance-none border-almostbright focus:outline-none focus:ring-0 focus:border-bright cursor-pointer'
                        value={selectedValue}
                        onChange={(e) => { setSelectedValue(e.target.value); setHasBlured(true) }}
                        onBlur={() => setHasBlured(true)}
                        onMouseDown={(e) => { e.preventDefault(); selectRef.current?.focus() }}
                        required={required}
                    >
                        <option value='' hidden />
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <Label label={label} value={selectedValue} required={required} showRequired={required && !selectedValue && hasBlured} />

                    {selectedValue && <EraseButton setData={(v: string) => { setSelectedValue(v); setHasBlured(true) }} />}
                    {!selectedValue && tooltip && <ToolTip info={tooltip} />}

                    <div className='hidden peer-focus:block absolute left-0 right-0 top-full mt-1 z-50'>
                        <div className='bg-normal border-[0.10rem] border-almostbright rounded-lg shadow-lg p-0 max-h-72 overflow-hidden'>
                            <div className='max-h-72 overflow-auto'>
                                {selectedValue && (
                                    <div className='sticky top-0 bg-surface px-2 py-2 z-10 border-b border-almostbright bg-light'>
                                        <div className='flex items-center gap-3'>
                                            {selectedOption?.image && (
                                                <div className='overflow-hidden rounded w-24 h-10'>
                                                    <Image
                                                        src={`${config.url.CDN_URL}/${selectedOption.image}`}
                                                        alt={selectedOption.label || 'selected'}
                                                        width={100}
                                                        height={40}
                                                        className='object-cover block'
                                                        loading='lazy'
                                                    />
                                                </div>
                                            )}
                                            <span className='font-medium text-left'>{selectedOption?.label}</span>
                                        </div>
                                    </div>
                                )}

                                <div className='p-2'>
                                    {options.filter(o => o.value !== selectedValue).map((opt) => (
                                        <button
                                            key={opt.value}
                                            type='button'
                                            className='cursor-pointer w-full flex items-center gap-3 px-2 py-2 text-sm hover:bg-surface rounded hover:bg-light'
                                            onMouseDown={(e) => { e.preventDefault(); handleChoose(opt.value) }}
                                        >
                                            {opt.image && (
                                                <div className='overflow-hidden rounded w-24 h-10'>
                                                    <Image
                                                        src={`${config.url.CDN_URL}/${opt.image}`}
                                                        alt={opt.label}
                                                        width={100}
                                                        height={40}
                                                        className='object-cover block'
                                                        loading='lazy'
                                                    />
                                                </div>
                                            )}
                                            <span className='text-left'>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </SelectContext.Provider>
    )
}


type SelectOptionProps = {
    value: string | number
    className?: string
    children?: React.ReactNode
}

export function SelectOption({ value, className, children }: SelectOptionProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx = useContext(SelectContext as any)
    if (!ctx) return null

    const { selectedValue } = ctx as { selectedValue: string | number }

    if (String(selectedValue) === String(value)) {
        return (
            <div className={className}>
                {children}
            </div>
        )
    }

    return null
}