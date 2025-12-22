'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import postIncident from '@/utils/fetch/namespace/incident/post'
import { removeCookie, setCookie } from '@/utils/cookies'
import ArrowOutward from '../svg/arrowOutward'
import FancyField from '../root/fancyField'
import { usePathname } from 'next/navigation'
import { Button } from 'uibee/components'
import { X } from 'lucide-react'

type IncidentsClientProps = {
    context: string
    namespace: string
    incidents: Incident[]
    incident: string
    incidentURL: string
    incidentTimestamp: string
}

export default function IncidentsClient({
    context,
    namespace,
    incidents,
    incident,
    incidentURL,
    incidentTimestamp
}: IncidentsClientProps) {
    const buttonStyle = 'bg-login-500 w-full rounded-lg py-1 text-start flex justify-between items-center px-2 cursor-pointer'
    const [name, setName] = useState(incident)
    const [url, setURL] = useState(incidentURL)
    const [time, setTime] = useState(incidentTimestamp)
    const [response, setResponse] = useState<{ status: number, message: string } | null>(null)
    const [open, setOpen] = useState(false)
    const path = usePathname()
    const allowEdit = namespace !== 'global' && !path.includes('/internal/kubernetes/message')

    async function handleSubmit() {
        const response = await postIncident({
            name,
            url: url.includes('http') ? url : `https://${url}`,
            timestamp: time,
            context,
            namespace
        })

        if (response.status === 200) {
            setName('')
            setURL('')
            removeCookie('incident')
            removeCookie('incidentURL')
            removeCookie('incidentTimestamp')
            setOpen(false)
        }

        setResponse(response)
    }

    function handleCancel() {
        setCookie('incident', name)
        setCookie('incidentURL', url)
        setCookie('incidentTimestamp', time)
        setOpen(false)
    }

    useEffect(() => {
        if (name.length) {
            window.addEventListener('beforeunload', () => setCookie('incident', name))
        } else {
            window.addEventListener('beforeunload', () => removeCookie('incident'))
        }
        return () => {
            if (name.length) {
                window.removeEventListener('beforeunload', () => setCookie('incident', name))
            } else {
                window.removeEventListener('beforeunload', () => removeCookie('incident'))
            }
        }
    }, [name])

    useEffect(() => {
        if (url.length) {
            window.addEventListener('beforeunload', () => setCookie('incidentURL', url))
        } else {
            window.addEventListener('beforeunload', () => removeCookie('incidentURL'))
        }
        return () => {
            if (url.length) {
                window.removeEventListener('beforeunload', () => setCookie('incidentURL', url))
            } else {
                window.removeEventListener('beforeunload', () => removeCookie('incidentURL'))
            }
        }
    }, [url])

    useEffect(() => {
        if (time.length) {
            window.addEventListener('beforeunload', () => setCookie('incidentTimestamp', time))
        } else {
            window.addEventListener('beforeunload', () => removeCookie('incidentTimestamp'))
        }
        return () => {
            if (time.length) {
                window.removeEventListener('beforeunload', () => setCookie('incidentTimestamp', time))
            } else {
                window.removeEventListener('beforeunload', () => removeCookie('incidentTimestamp'))
            }
        }
    }, [time])

    return (
        <div>
            <Link
                target='_blank'
                href='https://wiki.login.no/tekkom/projects/infrastructure/incident'
                className={buttonStyle}>All incidents<ArrowOutward className=' w-4 h-4 fill-login' />
            </Link>
            {(incidents.length > 0 || allowEdit) && <div className='h-px bg-login-400 w-full' />}
            {incidents.map((incident) => <div key={incident.name} className={buttonStyle}>
                <Link target='_blank' href={incident.url} className='text-login-200'>{incident.name}</Link>
                <ArrowOutward className=' w-4 h-4 fill-login' />
            </div>)}
            {allowEdit && <div className={`pb-2 ${!incidents.length && 'pt-2'}`}>
                {open ? <div className='grid space-between items-center text-login-200 bg-login-600 rounded-lg gap-2 p-2'>
                    {response && <h1
                        className={`w-full ${response.status === 200 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg py-1 text-center`}
                    >
                        {response.message}
                    </h1>}
                    <Button
                        icon={<X className='w-5' />}
                        text='Cancel'
                        color='secondary'
                        onClick={handleCancel}
                    />
                    <div className='relative grid gap-2'>
                        <FancyField placeholder='Incident' value={name} setValue={setName} />
                        <FancyField placeholder='URL' value={url} setValue={setURL} />
                        <FancyField type='date' placeholder='Date' value={time} setValue={setTime} />
                        <h1
                            onClick={() => setTime(new Date().toISOString())}
                            className='absolute bg-login-300 px-2 rounded-lg bottom-1 right-1 select-none'
                        >
                            now
                        </h1>
                    </div>
                    <Button
                        icon='+'
                        text='Add'
                        onClick={handleSubmit}
                    />
                </div> : <div
                    onClick={() => setOpen(true)}
                    className={`
                        select-none flex justify-between items-center px-2
                        text-login-200 bg-login-600 rounded-md py-1
                    `}
                >
                    <h1 className='select-none'>Add incident</h1>
                    <h1 className='select-none text-lg pr-0.75 text-login'>+</h1>
                </div>}
            </div>}
        </div>
    )
}
