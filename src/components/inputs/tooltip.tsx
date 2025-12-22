export default function ToolTip({
    info,
    className,
}: {
    info: string
    className?: string
}) {
    return (
        <div
            className={`absolute z-19 right-0 px-1 flex justify-center ${className}`}
        >
            <span className={`
                peer cursor-pointer rounded-sm px-3 py-1 bg-login-800
                hover:bg-login-600
            `}>
                ?
            </span>
            <div className={`
                absolute hidden peer-hover:block p-2
                rounded z-20 bg-login-700 border left-12 w-max max-w-3xs
            `}>
                {info}
            </div>
        </div>
    )
}
