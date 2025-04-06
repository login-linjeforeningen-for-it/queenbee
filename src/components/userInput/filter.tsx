import { Dispatch, SetStateAction } from "react"

type FilterProps = {
    text: string
    setText: Dispatch<SetStateAction<string>>
}

export default function Filter({text, setText}: FilterProps) {
    return (
        <div className="cursor-pointer bg-extralight rounded-md h-8 p-1 ml-1 flex justify-evenly items-center gap-2 select-none">
            <input 
                className="px-2" 
                placeholder='Filter' 
                value={text} 
                onChange={(event) => setText(event?.target.value)}
            />
        </div>
    )
}
