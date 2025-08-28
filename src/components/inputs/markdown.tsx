
'use client'

import { useRef, useState } from 'react'
import Label from './label'
import ToolTip from './tooltip'
import MarkdownRender from '../userInput/markdownRender'

type MarkdownProps = {
    name: string
    label: string
    value: string
    setValue: (_: string | number) => void
    className?: string
    tooltip?: string
    required?: boolean
    rows?: number
}

export default function Markdown({ name, label, value, className, tooltip, required, rows = 6, setValue }: MarkdownProps) {
    const [mode, setMode] = useState<'edit' | 'preview'>('edit')
    const [hasBlured, setHasBlured] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    function wrapSelection(before: string, after = before, placeHolder = '') {
        const textarea = textareaRef.current
        if (!textarea) return
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = value.slice(start, end) || placeHolder
        const newValue = value.slice(0, start) + before + selected + after + value.slice(end)
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
                        className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border-[0.10rem] appearance-none border-login-200 focus:outline-none focus:ring-0 focus:border-login-50 peer resize-vertical bg-login-800'
                    />
                ) : (
                    <div
                        className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border-[0.10rem] border-login-200 bg-login-800 resize-vertical overflow-auto'
                        style={{ minHeight: `${rows * 1.5}rem` }}
                    >
                        <MarkdownRender MDstr={value || ''} />
                    </div>
                )}

                <Label label={label} value={value} required={required} showRequired={required && !value && hasBlured} />
                {tooltip && <ToolTip info={tooltip} />}
            </div>

            <div className='flex items-center justify-between gap-2 mt-2'>
                <div className='flex gap-1'>
                    <button type='button' className='px-2 py-1 rounded hover:bg-login-600' onClick={() => wrapSelection('**', '**', 'bold')}>B</button>
                    <button type='button' className='px-2 py-1 rounded hover:bg-login-600' onClick={() => wrapSelection('*', '*', 'italic')}>I</button>
                    <button type='button' className='px-2 py-1 rounded hover:bg-login-600' onClick={() => wrapSelection('\n```\n', '\n```\n', 'code block')}>CB</button>
                    <button type='button' className='px-2 py-1 rounded hover:bg-login-600' onClick={() => wrapSelection('[', '](url)', 'text')}>Link</button>
                    <button type='button' className='px-2 py-1 rounded hover:bg-login-600' onClick={() => wrapSelection('\n- ', '', 'list item')}>UL</button>
                </div>

                <div className='flex items-center gap-2'>
                    <button type='button' onClick={() => setMode('edit')} className={`px-2 py-1 rounded ${mode === 'edit' ? 'bg-login-600' : 'hover:bg-login-600'}`}>Edit</button>
                    <button type='button' onClick={() => setMode('preview')} className={`px-2 py-1 rounded ${mode === 'preview' ? 'bg-login-600' : 'hover:bg-login-600'}`}>Preview</button>
                </div>
            </div>
        </div>
    )
}
