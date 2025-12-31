'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import ToolTip from './tooltip'
import Label from './label'
import config from '@config'
import { Button } from 'uibee/components'
import { Eraser } from 'lucide-react'

type SelectProps = {
    name: string
    label: string
    value: string | number
    setValue: (_: string | number) => void
    options: Option[]
    className?: string
    tooltip?: string
    required?: boolean
    children?: React.ReactNode
    color?: string
}

type SelectedOptionProps = {
    value: string | number
    selectedOption: Option | undefined
}

export default function Select({
    name,
    label,
    value,
    options,
    className,
    tooltip,
    required,
    children,
    setValue,
    color
}: SelectProps) {
    const [hasBlured, setHasBlured] = useState(false)
    const selectRef = useRef<HTMLSelectElement | null>(null)
    const selectedOption = options.find((o) => o.value === value)

    function handleChoose(value: string | number) {
        setValue(value)
        setHasBlured(true)
        if (selectRef.current) {
            selectRef.current.value = String(value)
            selectRef.current.blur()
        }
    }

    return (
        <div className={`w-full ${className}`}>
            <div className='relative flex items-center gap-2'>
                <select
                    ref={selectRef}
                    name={name}
                    className={`
                        peer cursor-pointer block px-2.5 py-2 md:pb-2.5 md:pt-4
                        w-full text-sm rounded-lg border-[0.10rem] h-9
                        appearance-none border-login-200 focus:ring-0
                        focus:outline-none focus:border-login-50
                        ${color ? color : 'bg-login-800'}
                    `}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                        setHasBlured(true)
                    }}
                    onBlur={() => setHasBlured(true)}
                    onMouseDown={(e) => {
                        e.preventDefault()
                        selectRef.current?.focus()
                    }}
                    required={required}
                >
                    <option value='' hidden />
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <Label
                    label={label}
                    value={value}
                    required={required}
                    color={color}
                    showRequired={required && !value && hasBlured}
                />

                {value && (
                    <Button
                        icon={<Eraser className='w-5' />}
                        text='Erase'
                        onClick={(v: string | object) => {
                            setValue(v as string)
                            setHasBlured(true)
                        }}
                    />
                )}
                {!value && tooltip && <ToolTip info={tooltip} />}

                <SelectContent
                    options={options}
                    value={value}
                    selectedOption={selectedOption}
                    handleChoose={handleChoose}
                    color={color}
                />
            </div>
            {children}
        </div>
    )
}

function SelectContent({
    options,
    value,
    selectedOption,
    handleChoose,
    color
}: {
    options: Option[]
    value: string | number
    selectedOption: Option | undefined
    handleChoose: (value: string | number) => void
    color?: string
}) {
    return (
        <div className='hidden peer-focus:block absolute left-0 right-0 top-full mt-1 z-50'>
            <div
                className={`
                    ${color ? color : 'bg-login-800'} border-[0.10rem] border-login-200
                    rounded-lg shadow-lg p-0 max-h-72 overflow-hidden
                `}
            >
                <div className='max-h-72 overflow-auto'>
                    <SelectedOption
                        value={value}
                        selectedOption={selectedOption}
                    />
                    <div className='p-2'>
                        {options
                            .filter((o) => o.value !== value)
                            .map((opt) => (
                                <button
                                    key={opt.value}
                                    type='button'
                                    className={`
                                        cursor-pointer w-full flex items-center
                                        gap-3 px-2 py-2 text-sm hover:bg-surface
                                        rounded hover:bg-login-50/5
                                    `}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        handleChoose(opt.value)
                                    }}
                                >
                                    <OptionImage
                                        image={opt.image}
                                        label={opt.label}
                                    />
                                    <span className='text-left'>
                                        {opt.label}
                                    </span>
                                </button>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function SelectedOption({ value, selectedOption }: SelectedOptionProps) {
    const url = `${config.url.cdn}/${selectedOption?.image}`

    if (!value) {
        ;<></>
    }

    return (
        <div
            className={`
                sticky top-0 bg-surface px-2 py-2 z-10 border-b
                border-login-200 bg-login-50/5
            `}
        >
            <div className='flex items-center gap-3'>
                {selectedOption?.image && (
                    <div className='overflow-hidden rounded w-24 h-10'>
                        <Image
                            src={url}
                            alt={selectedOption.label || 'selected'}
                            width={100}
                            height={40}
                            className='object-cover block'
                            loading='lazy'
                        />
                    </div>
                )}
                <span className='font-medium text-left'>
                    {selectedOption?.label}
                </span>
            </div>
        </div>
    )
}

function OptionImage({ image, label }: { image?: string; label: string }) {
    if (!image) {
        return <></>
    }

    return (
        <div className='overflow-hidden rounded w-24 h-10'>
            <Image
                src={`${config.url.cdn}/${image}`}
                alt={label}
                width={100}
                height={40}
                className='object-cover block'
                loading='lazy'
            />
        </div>
    )
}
