import React, { useRef, useState } from "react";
import MarkdownRender from "./markdownRender";

export default function TextArea({width, height, onchange, placeholder, required}: {width: string | number, height: string | number, onchange?: (e: React.ChangeEvent<HTMLTextAreaElement>)=>void, placeholder: string, required?: boolean}) {
    const [markdown, setMarkdown] = useState("")
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
        <div style={{width, height}} className="flex flex-col gap-1">
            <div className="flex justify-between">
                <textarea   className="focus:outline-none focus:ring-0 bg-grey-800 resize-none p-2 rounded-sm"
                            placeholder={placeholder+(required?'*':'')}
                            required={required}
                            onChange={(e)=>{
                                if(e.target.value.length != 0) setIsempty(false);
                                setMarkdown(e.target.value)
                                if(onchange) onchange(e)
                            }}
                            onBlur={blur}
                            style={{width: "48%"}}
                            ref={inputRef}
                            />
                <div className="bg-grey-800 p-2 rounded-sm" style={{width: "48%"}}>
                    <MarkdownRender MDstr={markdown} />
                </div>
            </div>
            {isEmpty && <div className="text-red-500 text-xs">This field is <b className="text-inherit">requred</b></div>}
        </div>
    )
}