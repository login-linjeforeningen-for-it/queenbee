'use client'

import Body from './body'
import Header from './header'

type TableProps = {
    list: object[]
    headers?: string[]
    deleteAction?: (id: string) => void
    roles?: Role[]
    systemTable?: boolean
    hideMenu?: boolean
    redirectPath?: string | { path: string, key?: string }
}

export default function Table({ list, headers, deleteAction, roles, hideMenu, redirectPath }: TableProps) {
    if (list.length === 0) {
        return <div className='p-4 text-center text-login-200'>No data found</div>
    }

    const keys = Object.keys(list[0])
    headers = headers || keys

    return (
        <div className='bg-login-500/50 flex-1 flex flex-col min-h-0 rounded-lg shadow border border-login-600 overflow-x-auto h-full'>
            <table className='min-w-full w-max divide-y divide-login-600 flex flex-col flex-1 min-h-0'>
                <Header
                    keys={list.length > 0 ? Object.keys(list[0]) : []}
                    headers={headers}
                    hideMenu={hideMenu}
                />
                <Body
                    list={list}
                    headers={headers}
                    deleteAction={deleteAction}
                    roles={roles}
                    hideMenu={hideMenu}
                    redirectPath={redirectPath}
                />
            </table>
        </div>
    )
}
