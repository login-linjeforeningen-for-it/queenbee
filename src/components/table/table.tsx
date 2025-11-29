'use client'

import Body from './body'
import Header from './header'
import StatusBody from './statusBody'

type TableProps = {
    list: object[]
    headers?: string[]
    deleteAction: (id: string) => void
    roles?: Role[]
    systemTable?: boolean
}

export default function Table({ list, headers, deleteAction, roles, systemTable }: TableProps) {
    const keys = Object.keys(list[0])
    headers = headers || keys

    return (
        <div className='relative flex-1 noscroll w-full overflow-auto bg-white/5 rounded-lg'>
            <table className='w-full relative border-collapse rounded-lg pl-2'>
                <Header
                    keys={keys}
                    headers={headers}
                />
                {systemTable ? <StatusBody
                    list={list}
                    headers={headers}
                    deleteAction={deleteAction}
                    roles={roles}
                /> : <Body
                    list={list}
                    headers={headers}
                    deleteAction={deleteAction}
                    roles={roles}
                />}
            </table>
        </div>
    )
}
