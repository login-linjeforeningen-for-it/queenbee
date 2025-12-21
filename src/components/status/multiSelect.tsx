import { useEffect, useRef, useState } from 'react'
import { X, ChevronDown, Plus } from 'lucide-react'

type Option = {
    label: string
    value: string
}

type MultiSelectProps = {
    options: Option[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    plusAction?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}

export default function MultiSelect({
    options,
    value,
    onChange,
    placeholder = 'Select…',
    plusAction
}: MultiSelectProps) {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    function toggleOption(optionValue: string) {
        if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue))
        } else {
            onChange([...value, optionValue])
        }
    }

    function removeOption(optionValue: string) {
        onChange(value.filter((v) => v !== optionValue))
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} className='relative w-fit'>
            {/* Control */}
            <div
                onClick={() => setOpen((o) => !o)}
                className={`
                    flex cursor-pointer items-center justify-between gap-2
                    rounded-lg bg-white/10 px-2 py-0.5
                    outline outline-white/20
                    hover:bg-white/15
                `}
            >
                <div className='flex flex-wrap gap-1'>
                    {value.length === 0 && (
                        <span className='px-1 text-sm text-white/40'>
                            {placeholder}
                        </span>
                    )}

                    {value.map((val) => {
                        const option = options.find((o) => o.value === val)
                        if (!option) return null

                        return (
                            <span
                                key={val}
                                className='flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-sm'
                            >
                                {option.label}
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeOption(val)
                                    }}
                                    className='hover:text-red-400'
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        )
                    })}
                </div>

                <div className='flex gap-2'>
                    {plusAction !== undefined && <Plus onClick={(e) => plusAction(e)} size={18} className='shrink-0' />}
                    <ChevronDown
                        size={18}
                        className={`shrink-0 transition-transform ${
                            open ? 'rotate-180' : ''
                        }`}
                    />
                </div>
            </div>

            {/* Dropdown */}
            {open && options.length > 0 && (
                <div
                    className={`
                        absolute z-50 mt-1 max-h-60 w-full overflow-auto
                        rounded-lg bg-neutral-900 shadow-lg
                        outline outline-white/10
                    `}
                >
                    {options.map((option) => {
                        const selected = value.includes(option.value)

                        return (
                            <div
                                key={option.value}
                                onClick={() => toggleOption(option.value)}
                                className={`
                                    flex cursor-pointer items-center px-3 py-2
                                    hover:bg-white/10 justify-between
                                    ${selected ? 'bg-white/10' : ''}
                                `}
                            >
                                <span>{option.label}</span>
                                {selected && (
                                    <span className='text-xs text-white/50'>
                                        Selected
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
