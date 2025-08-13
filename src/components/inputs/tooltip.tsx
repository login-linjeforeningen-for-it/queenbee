export default function ToolTip({info, className}: {info: string, className?: string}) {
    return (
        <div className={`absolute right-0 px-1 flex justify-center ${className}`}>
            <span className='peer cursor-pointer rounded-sm px-3 py-1 bg-normal hover:bg-light'>?</span>
            <div className='absolute hidden peer-hover:block p-2 rounded z-20 bg-dark border top-12 w-max max-w-3xs'>
                {info}
            </div>
        </div>
    )
}
