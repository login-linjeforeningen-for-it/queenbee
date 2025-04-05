import { useRef } from "react"

export default function TextInput({width, placeholder, required}: {width: string | number, placeholder: string, required?: boolean}) {
    const labelRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const labelClassNameBase = `absolute left-3 `


    let placeholderStyle = labelClassNameBase+`top-0 h-full content-center text-(--color-gray-300)`

    function select(){
        if(labelRef.current?.className){
            labelRef.current.className = labelClassNameBase+`top-2 text-xs text-(--color-primary)`
        }
    }
    function blur(){
        if (labelRef.current?.className && document.hasFocus()) {
            if (inputRef.current?.value.length === 0){
                labelRef.current.className = labelClassNameBase+`top-0 h-full content-center text-(--color-gray-300)`
            }
            else{
                labelRef.current.className = labelClassNameBase+`top-2 text-xs text-(--color-gray-300)`
            }
        }
    }

    return (
        <div className="relative">
            <input ref={inputRef} required={required} onSelect={select} onBlur={blur} type="text" className={`bg-grey-800 p-3 pt-6 border-b border-(--color-gray-300) focus:border-(--color-primary) focus:outline-none focus:ring-0`} style={{width}}>
            </input>
            <div ref={labelRef} className={placeholderStyle}>{placeholder+(required?'*':'')}</div>
        </div>
    )

}