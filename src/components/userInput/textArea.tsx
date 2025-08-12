import React, { useRef, useState } from 'react'
import MarkdownRender from './markdownRender'

export default function TextArea({width, height, onchange, placeholder, required}: {width: string | number, height: string | number, onchange?: (e: React.ChangeEvent<HTMLTextAreaElement>)=>void, placeholder: string, required?: boolean}) {
    const [markdown, setMarkdown] = useState('')
    const [isEmpty, setIsempty] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    function blur(){
        if (inputRef.current && document.hasFocus()) {
            if (inputRef.current?.value.length === 0){
                setIsempty(true)
            }
            else{
                setIsempty(false)
            }
        }
    }


    return (
        <div style={{width, height}} className='flex flex-col gap-1'>
            <div className='grid grid-cols-2 gap-x-3 gap-y-1'>
                <button className='bg-light border border-login rounded-sm aspect-square size-[1.5rem]'><b>B</b></button>
                <div>Preview:</div>
                <textarea   className='focus:outline-none w-full focus:ring-0 bg-light resize-none p-2 rounded-sm'
                    placeholder={placeholder+(required?'*':'')}
                    required={required}
                    onChange={(e)=>{
                        if(e.target.value.length != 0) setIsempty(false)
                        setMarkdown(e.target.value)
                        if(onchange) onchange(e)
                    }}
                    onBlur={blur}
                    ref={inputRef}
                />
                <div className='bg-light p-2 rounded-sm'>
                    <MarkdownRender MDstr={markdown} />
                </div>
            </div>
            {isEmpty && <div className='text-red-500 text-xs'>This field is <b className='text-inherit'>requred</b></div>}
        </div>
    )
}