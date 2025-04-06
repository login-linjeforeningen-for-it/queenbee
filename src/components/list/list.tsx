type ListProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: any[]
    sticky: string[]
    visible: string[]
}

type HeaderProps = {
    keys: string[]
    sticky: string[]
    visible: string[]
}

type BodyProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: any[]
    sticky: string[]
    visible: string[]
}

export default function List({list, sticky, visible}: ListProps) {
    const keys = Object.keys(list[0])
    return (
        <div className='relative overflow-y-auto max-h-[calc(100vh-var(--h-navbar)-var(--h-pageInfo))] min-h-[calc(100vh-var(--h-navbar)-var(--h-pageInfo))] noscroll w-fullo max-p-100 max-w-[calc(100vw-var(--w-sidebar))]'>
            <table className='w-full border-separate border-spacing-[1px] table-auto rounded-lg overflow-hidden'>
                <Header keys={keys} sticky={sticky} visible={visible} />
                <Body list={list} sticky={sticky} visible={visible} />
            </table>
        </div>

    )
}

function Header({keys, sticky, visible}: HeaderProps) {
    return (
        <thead className='bg-extralight'>
            <tr>
                {keys.map((key) => {
                    const value = key.length < 3 ? key.toUpperCase() : `${key[0].toUpperCase()}${key.slice(1).replaceAll('_', ' ')}`
                    if (!visible.includes(key)) {
                        return null
                    }

                    return (
                        <th key={key} className={`max-w-[10rem] p-2 text-left ${sticky.includes(key) ? 'font-bold sticky left-0 z-10' : 'font-normal'}`}>
                            {value}
                        </th>
                    )
                })}
            </tr>
        </thead>
    )
}

function Body({list, sticky, visible}: BodyProps) {
    return list.map((_, index) => {
        const entries = Object.entries(list[index])
        const maxChars = 18
        const end = index >= list.length - 3
        return (
            <tbody key={index} className='bg-extralight'>
                <tr>
                    {entries.map(([key, value]) => {
                        if (!visible.includes(key)) return null
                        return (
                            <td 
                                key={key} 
                                className={`p-[0.5rem] ${sticky.includes(key) ? 'font-bold sticky left-0 z-10' : 'font-normal'}`}
                            >
                                <div className='relative group'>
                                    <h1 className='overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem]'>
                                        {String(value)}
                                    </h1>
                                    {String(value).length > maxChars && (
                                        <div className={`absolute left-0 z-[1000] hidden group-hover:block bg-normal p-2 rounded max-w-xs break-words whitespace-normal border border-foreground ${(end) ? 'bottom-full' : ""}`}>
                                            {String(value)}
                                        </div>
                                    )}
                                </div>
                            </td>
                        )
                    })}
                </tr>
            </tbody>
    )})
}
