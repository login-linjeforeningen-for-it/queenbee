type FilterListProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: any[]
    filterText: string
}

export default function FilterList({ list, filterText }: FilterListProps) {
    const newList = list.filter(item => 
        Object.values(item).some(value => 
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    )

    return newList
}