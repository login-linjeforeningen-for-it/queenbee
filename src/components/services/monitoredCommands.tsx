'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Trash from '../svg/trash'
import { getCookie } from '@/utils/cookies'
import { useRouter } from 'next/navigation'
import putLocalCommand from '@/utils/fetch/command/local/put'
import putGlobalCommand from '@/utils/fetch/command/global/put'
import deleteLocalCommand from '@/utils/fetch/command/local/delete'
import deleteGlobalCommand from '@/utils/fetch/command/global/delete'

type MonitoredCommandsProps = {
    globalCommands: GlobalCommandWithUser[]
    localCommands: LocalCommandWithUser[]
}

type GlobalCommandProps = {
    command: GlobalCommandWithUser
}

type LocalCommandProps = {
    command: LocalCommandWithUser
}

type FieldProps = {
    className?: string
    placeholder: string
    editing: boolean
    value: string
    setValue: Dispatch<SetStateAction<string>>
}

type EditAndDeleteProps = {
    editing: boolean
    handleEdit: () => void
    handleDelete: () => void
    handleCancel: () => void
    allowDelete: boolean
}

export default function MonitoredCommands({ globalCommands, localCommands }: MonitoredCommandsProps) {
    const [active, setActive] = useState(false)

    if (active) {
        return (
            <div className='w-full h-[50vh] max-h-[50vh] bg-login-50/5 rounded-lg p-2'>
                <div className='w-full h-full overflow-auto mb-2 noscroll text-foreground'>
                    <h1
                        onClick={() => setActive(false)}
                        className={`
                            w-full overflow-auto mb-2 noscroll grid 
                            place-items-center text-login-200 cursor-pointer 
                            bg-login-50/5 rounded-lg py-1
                        `}
                    >
                        ↓ Monitored commands ↓
                    </h1>
                    <h1 className='text-login-200'>Global commands</h1>
                    {globalCommands.length > 0 ? <div className='grid gap-2 mb-2'>
                        {globalCommands.map((command) => <GlobalCommand
                            key={command.id}
                            command={command}
                        />)}
                    </div> : <h1 className='text-login-400'>No global commands are monitored.</h1>}
                    <h1 className='text-login-200'>Local commands</h1>
                    {localCommands.length > 0 ? <div className='grid gap-2 mb-2'>
                        {localCommands.map((command) => <LocalCommand
                            key={command.id}
                            command={command}
                        />)}
                    </div> : <h1 className='text-login-400'>There are no local commands monitored specifically for this service.</h1>}
                </div>
            </div>
        )
    }

    return (
        <div className='w-full h-[4.7vh] max-h-[4.7vh] bg-login-50/5 rounded-lg pt-1 px-2 pb-2'>
            <h1
                onClick={() => setActive(true)}
                className='w-full h-full overflow-auto mb-2 noscroll grid place-items-center text-login-200 cursor-pointer'
            >
                ↑ Monitored commands ↑
            </h1>
        </div>
    )
}

function GlobalCommand({ command }: GlobalCommandProps) {
    const [allowDelete, setAllowDelete] = useState(false)
    const [reason, setReason] = useState(command.reason)
    const [name, setName] = useState(command.name)
    const [value, setValue] = useState(command.command)
    const [response, setResponse] = useState<number | null>(null)
    const [editing, setEditing] = useState(false)
    const router = useRouter()

    async function handleEdit() {
        const token = getCookie('access_token')
        if (!token) {
            return router.push('/logout')
        }
        const response = await putGlobalCommand({
            router,
            token,
            id: command.id,
            name,
            command: value,
            author: String(command.author.user_id),
            reason
        })
        setResponse(response)
        setEditing(false)
    }

    function handleDelete() {
        const token = getCookie('access_token')
        if (!token) {
            return router.push('/logout')
        }

        if (allowDelete) {
            deleteGlobalCommand({ token, id: command.id })
        } else {
            setAllowDelete(true)
        }
    }

    function handleCancel() {
        setReason(command.reason)
        setName(command.name)
        setValue(command.command)
        setEditing(false)
    }

    useEffect(() => {
        console.log(response)
    }, [response])

    return (
        <div onMouseLeave={() => setAllowDelete(false)} className={`p-2 bg-login-500 rounded-lg ${editing ? 'grid gap-2' : ''}`}>
            <div className='flex justify-between gap-2'>
                <div className='flex gap-2'>
                    <h1 className='min-w-4 text-login-400 text-sm'>{command.id}</h1>
                    <Field placeholder='Name' value={name} setValue={setName} editing={editing} />
                </div>
                <div className='flex flex-col place-items-end flex-1'>
                    <div className='flex items-center gap-2 w-full justify-end'>
                        <Field className='text-login-400' placeholder='Reason' value={reason} setValue={setReason} editing={editing} />
                        <h1 className='text-login-400 text-sm min-w-32'>{new Date(command.timestamp).toLocaleString('no-NO')}</h1>
                        {!editing && <h1 onClick={() => setEditing(true)} className='mr-1 text-login-200 cursor-pointer'>✎</h1>}
                    </div>
                </div>
            </div>
            <div className='ml-4 pl-2 flex justify-between gap-2'>
                <div className='flex flex-1'>
                    <Field className='text-login-200' placeholder='Command' value={value} setValue={setValue} editing={editing} />
                </div>
                <div className={`${editing ? 'max-w-[30%] pt-1' : 'max-w-[16%] pr-0.75'} flex gap-2`}>
                    <h1 className='text-login-400 text-sm'>{command.author.user_name}</h1>
                    <CancelSaveAndDelete
                        editing={editing}
                        allowDelete={allowDelete}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleCancel={handleCancel}
                    />
                </div>
            </div >
        </div>
    )
}

function LocalCommand({ command }: LocalCommandProps) {
    const [allowDelete, setAllowDelete] = useState(false)
    const [editing, setEditing] = useState(false)
    const [context, setContext] = useState(command.context)
    const [namespace, setNamespace] = useState(command.namespace)
    const [reason, setReason] = useState(command.reason)
    const [response, setResponse] = useState<Result | null>(null)
    const [name, setName] = useState(command.name)
    const [value, setValue] = useState(command.command)
    const router = useRouter()
    const color = response?.status === 200 ? 'bg-green-500/20' : 'bg-red-500/20'

    async function handleEdit() {
        const token = getCookie('access_token')
        if (!token) {
            return router.push('/logout')
        }
        const response = await putLocalCommand({
            router,
            token,
            id: command.id,
            context,
            namespace,
            name,
            command: value,
            author: String(command.author.user_id),
            reason
        })
        if (response === 200) {
            setTimeout(() => {
                setResponse(null)
            }, 3000)
        }
        setResponse({
            status: response,
            message: response === 200
                ? 'Edit recorded successfully.'
                : 'Something went wrong. Please try again.'
        })
        setEditing(false)
    }

    async function handleDelete() {
        const token = getCookie('access_token')
        if (!token) {
            return router.push('/logout')
        }

        if (allowDelete) {
            const response = await deleteLocalCommand({ token, id: command.id })
            if (response === 200) {
                setResponse({ status: response, message: 'Command deleted successfully. It will disappear shortly.' })
            } else {
                setResponse({ status: response, message: 'Something went wrong. Please try again.' })
            }
        } else {
            setAllowDelete(true)
        }
    }

    function handleCancel() {
        setContext(command.context)
        setNamespace(command.namespace)
        setReason(command.reason)
        setName(command.name)
        setValue(command.command)
        setEditing(false)
    }

    return (
        <div>
            {response !== null && <h1 className={`${color} py-1 text-center w-full text-bright rounded-lg mt-1 mb-2`}>
                {response.message}
            </h1>}
            <div className='p-2 bg-login-500 rounded-lg'>
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <h1 className='min-w-4 text-login-400 text-sm'>{command.id}</h1>
                        <div className='grid gap-2'>
                            <Field placeholder='Name' value={name} setValue={setName} editing={editing} />
                            <div className='flex justify-between'>
                                <Field
                                    className='text-login-200'
                                    placeholder='Command'
                                    value={value}
                                    setValue={setValue}
                                    editing={editing}
                                />
                            </div >
                        </div>
                    </div>
                    <div className={`flex flex-col place-items-end ${editing ? 'gap-2' : ''}`}>
                        <div className='flex items-center gap-2 text-login-200'>
                            {editing ?
                                <Field placeholder='Namespace' value={namespace} setValue={setNamespace} editing={editing} />
                                : <h1 className='text-sm text-login-400'>{command.reason}</h1>}
                            <h1 className='text-login-400 text-sm min-w-fit'>{new Date(command.timestamp).toLocaleString('no-NO')}</h1>
                            {!editing && <h1 onClick={() => setEditing(true)} className='mr-1 text-login-200 cursor-pointer'>✎</h1>}
                        </div>
                        <div className='text-login-400 text-sm flex gap-2 pr-0.75'>
                            <Field placeholder='Namespace' value={namespace} setValue={setNamespace} editing={editing} />
                            <h1>-</h1>
                            <Field placeholder='Context' value={context} setValue={setContext} editing={editing} />
                            <h1 className='min-w-fit'>| {command.author.user_name}</h1>
                            <CancelSaveAndDelete
                                editing={editing}
                                allowDelete={allowDelete}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                handleCancel={handleCancel}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Field({ className, placeholder, editing, value, setValue }: FieldProps) {
    if (editing) {
        return (
            <input
                placeholder={placeholder}
                className='bg-login-300 text-login-200 rounded-lg px-2 text-sm w-full'
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
        )
    }

    return <h1 className={`text-sm ${className}`}>{value}</h1>
}

function CancelSaveAndDelete({
    editing,
    allowDelete,
    handleEdit,
    handleDelete,
    handleCancel
}: EditAndDeleteProps) {
    if (editing) {
        return (
            <>
                <h1
                    onClick={handleCancel}
                    className='h-fit w-fit bg-login-400 hover:bg-login-200 px-4 cursor-pointer rounded-lg text-sm text-white'
                >
                    Cancel
                </h1>
                <div onClick={handleEdit}>
                    <h1 className='bg-login px-4 cursor-pointer rounded-lg text-sm text-white'>Save</h1>
                </div>
            </>
        )
    }

    return (
        <div onClick={handleDelete}>
            <Trash fill={`${allowDelete ? 'fill-red-500' : 'fill-login-200'} hover:fill-red-500 h-4 w-4 cursor-pointer`} />
        </div>
    )
}
