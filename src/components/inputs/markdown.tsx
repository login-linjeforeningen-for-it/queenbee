'use client'

import { useRef, useState } from 'react'
import Label from './label'
import ToolTip from './tooltip'
import MarkdownRender from '../markdown/markdownRender'
import { Edit, View } from 'lucide-react'
import { Button } from 'uibee/components'

type MarkdownProps = {
    name: string
    label: string
    value: string
    setValue: (_: string | number) => void
    className?: string
    tooltip?: string
    required?: boolean
    rows?: number
    color?: string
    buttonColor?: string
    buttonColorHighlighted?: string
}

export default function Markdown({
    name,
    label,
    value,
    className,
    tooltip,
    required,
    rows = 6,
    setValue,
    color,
    buttonColor,
    buttonColorHighlighted
}: MarkdownProps) {
    const [mode, setMode] = useState<'edit' | 'preview'>('edit')
    const [hasBlured, setHasBlured] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const smallButtonStyle = `px-2 py-1 rounded select-none
        ${buttonColorHighlighted ? `hover:${buttonColorHighlighted}` : 'hover:bg-login-500'}
        ${' '}${buttonColor ? buttonColor : 'bg-login-50/5'}`

    function wrapSelection(before: string, after = before, placeHolder = '') {
        const textarea = textareaRef.current
        if (!textarea) return
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = value.slice(start, end) || placeHolder
        const newValue =
            value.slice(0, start) + before + selected + after + value.slice(end)
        setValue(newValue)
        requestAnimationFrame(() => {
            const pos = start + before.length
            textarea.focus()
            textarea.setSelectionRange(pos, pos + selected.length)
        })
    }

    return (
        <div className={`w-full ${className ?? ''}`}>
            <div className='relative'>
                {mode === 'edit' ? (
                    <textarea
                        name={name}
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={() => setHasBlured(true)}
                        rows={rows}
                        required={required}
                        className={`
                            block px-2.5 pb-2.5 pt-4 w-full text-sm
                            rounded-lg border-[0.10rem] appearance-none
                            border-login-200 focus:outline-none focus:ring-0
                            focus:border-login-50 peer resize-vertical
                            ${color ? color : 'bg-login-800'}
                        `}
                    />
                ) : (
                    <div
                        className={`
                            block px-2.5 pb-2.5 pt-4 w-full text-sm
                            rounded-lg border-[0.10rem] border-login-200
                            ${color ? color : 'bg-login-800'}
                            resize-vertical overflow-auto
                        `}
                        style={{ minHeight: `${rows * 1.5}rem` }}
                    >
                        <MarkdownRender MDstr={value || ''} />
                    </div>
                )}

                <Label
                    label={label}
                    value={value}
                    color={color}
                    required={required}
                    showRequired={required && !value && hasBlured}
                />
                {tooltip && <ToolTip info={tooltip} />}
            </div>

            <div className='grid md:flex! items-center justify-between gap-2 mt-2'>
                <div className='flex gap-2'>
                    <button
                        type='button'
                        className={smallButtonStyle}
                        onClick={() => wrapSelection('**', '**', 'bold')}
                    >
                        B
                    </button>
                    <button
                        type='button'
                        className={smallButtonStyle}
                        onClick={() => wrapSelection('*', '*', 'italic')}
                    >
                        I
                    </button>
                    <button
                        type='button'
                        className={smallButtonStyle}
                        onClick={() =>
                            wrapSelection('\n```\n', '\n```\n', 'code block')
                        }
                    >
                        CB
                    </button>
                    <button
                        type='button'
                        className={smallButtonStyle}
                        onClick={() => wrapSelection('[', '](url)', 'text')}
                    >
                        Link
                    </button>
                    <button
                        type='button'
                        className={smallButtonStyle}
                        onClick={() => wrapSelection('\n- ', '', 'list item')}
                    >
                        UL
                    </button>
                </div>

                <div className='flex items-center gap-2'>
                    <Button
                        icon={<Edit className='w-5' />}
                        text='Edit'
                        className={mode === 'edit'
                            ? buttonColor ? buttonColor : 'bg-login-50/5'
                            : buttonColorHighlighted ? `hover:${buttonColorHighlighted}` : 'hover:bg-login-50/5'}
                        onClick={() => setMode('preview')}
                    />
                    <Button
                        icon={<View className='w-5' />}
                        text='Preview'
                        className={mode === 'preview'
                            ? buttonColor ? buttonColor : 'bg-login-50/5'
                            : buttonColorHighlighted ? `hover:${buttonColorHighlighted}` : 'hover:bg-login-50/5'}
                        onClick={() => setMode('preview')}
                    />
                </div>
            </div>
        </div>
    )
}
