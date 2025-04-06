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

type EntryProps = {
    list: string[]
    sticky: string[]
    visible: string[]
    index: number
}

export default function List({list, sticky, visible}: ListProps) {
    const keys = Object.keys(list[0])

    return (
        <div className='max-w-[calc(100vw-var(--w-sidebar))] pb-[10rem] overflow-x-auto'>
            <table className='w-full border-collapse table-auto'>
                <Header keys={keys} sticky={sticky} visible={visible} />
                <Body list={list} sticky={sticky} visible={visible} />
            </table>
        </div>
    )
}

function Header({keys, sticky, visible}: HeaderProps) {
    return (
        <thead className='bg-grey-800'>
            <tr>
                {keys.map((key) => {
                    const value = key.length < 3 ? key.toUpperCase() : `${key[0].toUpperCase()}${key.slice(1).replaceAll('_', ' ')}`
                    if (!visible.includes(key)) {
                        return null
                    }

                    return (
                        <th key={key} className={`max-w-[10rem] bg-grey-800 p-2 text-left ${sticky.includes(key) ? 'font-bold sticky left-0 z-10' : 'font-normal'}`}>
                            {value}
                        </th>
                    )
                })}
            </tr>
        </thead>
    )
}

function Body({list, sticky, visible}: BodyProps) {
    return (
        <>
            {list.map((entry, index) => <Entry key={index} list={list} sticky={sticky} visible={visible} index={index} />)}
        </>
    )
}

function Entry({list, sticky, visible, index}: EntryProps) {
    const entries = Object.entries(list[index])
    const maxChars = 18
    return (
        <tbody className='bg-grey-800'>
            {entries.map(([key, value]) => {
                if (!visible.includes(key)) return null

                return (
                    <td key={key} className={`p-[0.5rem] bg-grey-800 ${sticky.includes(key) ? 'font-bold sticky left-0 z-10' : 'font-normal'}`}>
                        <div className='relative group'>
                            <h1 className='overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem]'>{String(value)}</h1>
                            {String(value).length > maxChars && (
                                <div className='absolute left-0 z-[1000] hidden group-hover:block bg-[var(--color-bg-surface)] p-2 rounded max-w-xs break-words whitespace-normal border border-white'>
                                    {String(value)}
                                </div>
                            )}
                        </div>
                    </td>
                )
            })}
        </tbody>
    )
}
