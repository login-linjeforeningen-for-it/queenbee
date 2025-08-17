type labelProps = {
    label: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
    required?: boolean
    showRequired?: boolean
    className?: string
}

export default function Label({label, value, required, showRequired, className}: labelProps){
    return (
        <label
            className={`w-[calc(100%-10px)] pointer-events-none absolute text-sm duration-300 transform z-10 origin-[0] bg-normal px-2 py-1 peer-focus:px-2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-5 start-2
                        ${value ? '-translate-y-5 scale-75 top-3 w-fit' : '-translate-y-1/2 scale-100 top-1/2 peer-focus:w-fit'}
                        ${showRequired ? 'text-red-500/50' : ''} 
                        ${!value && required ? 'group-[.submitted]:text-red-500/50' : ''}
                        ${required ? 'after:content-["_*"]' : ''}
                        ${className}`}
        >
            {label}
        </label>
    )
}