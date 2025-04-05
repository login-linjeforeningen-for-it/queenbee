type ListProps = {
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
        <div>
            <Header keys={keys} sticky={sticky} visible={visible} />
            <Body list={list} sticky={sticky} visible={visible} />
        </div>
    )
}

function Header({keys, sticky, visible}: HeaderProps) {
    return (
        <div className="flex gap-4 bg-grey-800 p-2">
            {keys.map((key) => {
                let value = key.length < 3 ? key.toUpperCase() : `${key[0].toUpperCase()}${key.slice(1).replaceAll('_', ' ')}`
                if (!visible.includes(key)) {
                    return null
                }

                return (
                    <h1 className="w-[10vw]" key={key}>{value}</h1>
                )
            })}
        </div>
    )
}

function Body({list, sticky, visible}: BodyProps) {
    return (
        <div>
            {list.map((entry, index) => <Entry key={index} list={list} sticky={[]} visible={visible} index={index} />)}
        </div>
    )
}

function Entry({list, sticky, visible, index}: EntryProps) {
    const entries = Object.entries(list[index])
    return (
        <div className="bg-grey-800">
            <div className="bg-[#141414] h-[1px] w-full" />
            <div className="flex p-2 gap-4">
                {entries.map(([key, value]) => {
                    if (!visible.includes(key)) {
                        return
                    }

                    return <h1 className="w-[10vw]" key={key}>{String(value)}</h1>
                })}
            </div>
        </div>
    )
}
