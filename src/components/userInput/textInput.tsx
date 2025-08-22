'use client'

import { useRef, useState } from 'react'

export default function TextInput({width, onchange, placeholder, required}: {width: string | number, onchange?: (e: React.ChangeEvent<HTMLInputElement>)=>void, placeholder: string, required?: boolean}) {
    const labelRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [isEmpty, setIsempty] = useState(false)
    const [inputLen, setInputLen] = useState(0)
    const labelClassNameBase = 'absolute left-3 '
    const inputClassNameBase = 'bg-login-600 p-3 pt-6 border-b focus:outline-none focus:ring-0 w-full '

    function select(){
        if(labelRef.current && inputRef.current){
            labelRef.current.className = labelClassNameBase+'top-2 text-xs text-login'
            labelRef.current.style.color = ''
            inputRef.current.className = inputClassNameBase+'border-login'
        }
    }
    function blur(){
        if (labelRef.current && inputRef.current && document.hasFocus()) {
            if (inputRef.current?.value.length === 0){
                labelRef.current.className = labelClassNameBase+'top-0 h-full content-center text-red-500'
                labelRef.current.style.color = ''
                inputRef.current.className = inputClassNameBase+'border-red-500'
                setIsempty(true)
            }
            else{
                labelRef.current.className = labelClassNameBase+'top-2 text-xs'
                labelRef.current.style.color = 'color-mix(in oklab, currentColor 50%, transparent)'
                inputRef.current.className = inputClassNameBase+'border-login-200'
            }
        }
    }

    return (
        <div style={{width}}>
            <div className='relative rounded-t-sm overflow-hidden'>
                <input
                    ref={inputRef}
                    required={required}
                    onSelect={select}
                    onBlur={blur}
                    onChange={(e)=>{
                        setInputLen(e.target.value.length)
                        setIsempty(false)
                        if(onchange) onchange(e)
                    }}
                    onInvalid={()=>{setIsempty(true)}}
                    type='text'
                    maxLength={50}
                    className={inputClassNameBase+'border-login-200'}>
                </input>
                <div ref={labelRef} style={{color: 'color-mix(in oklab, currentColor 50%, transparent)'}} className={labelClassNameBase+'top-0 h-full content-center'}>{placeholder+(required?'*':'')}</div>
            </div>
            <div className='flex'>
                {isEmpty && <div className='text-red-500 text-xs'>This field is <b className='text-inherit'>requred</b></div>}
                <div className='text-xs ml-auto text-forground text-login-200'>{inputLen}/50</div>
            </div>
        </div>
    )

}