'use client'

import { usePathname } from 'next/navigation'
import CustomForm from './form'
import {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    useEffect,
    useState
} from 'react'
import DiscordPreview from '@components/preview/discord'
import BackButton from '@components/navigation/back'

type ChildProps = {
    preview: boolean
    defaultValues?: object
}

type FormWrapperProps = {
    name: FormName
    path?: string
    type: 'create' | 'update'
    id?: string
    preview?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formAction: ( prevState: any, formData: FormData ) => any | Promise<any>
    children: ReactElement<ChildProps> | ReactElement<ChildProps>[]
    customRedirect?: string
    channels?: Channel[]
    roles?: Role[]
}

export default function FormWrapper({
    name,
    path,
    type,
    id,
    preview,
    formAction,
    children,
    customRedirect,
    channels,
    roles
}: FormWrapperProps) {
    const [title, setTitle] = useState('')
    const pathname = usePathname()
    const displayPreview = !pathname.includes('events/create') && !pathname.includes('jobs/create')

    useEffect(() => {
        function handleStorageChange(e: Event) {
            const event = e as CustomEvent
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            event.detail.key === 'title' && setTitle(event.detail.value)
        }

        window.addEventListener('customStorageChange', handleStorageChange)

        return () => {
            window.removeEventListener('customStorageChange',
                handleStorageChange)
        }
    }, [])

    return (
        <div
            className={
                'h-(--h-pageInfo) w-full flex flex-col items-center'
            }
        >
            <div className={
                `w-full px-16 py-4 ${preview ? 'grid grid-cols-2 gap-4' : ''}`
            }>
                <div className='flex flex-col gap-4'>
                    <BackButton pushURL={path ? `/${path}` : undefined} />
                    <h1 className='font-semibold text-2xl capitalize'>
                        {type} {name}
                    </h1>
                </div>
                {preview && title.length ? <div>
                    <h1 className='font-semibold text-2xl mt-10'>
                        Preview
                    </h1>
                </div> : <div className='flex flex-col gap-4 mt-4'></div>}
                <CustomForm
                    name={name}
                    type={type}
                    id={id}
                    formAction={formAction}
                    customRedirect={customRedirect}
                >
                    {Children.map(children, child => {
                        if (isValidElement(child)) {
                            return cloneElement(child, { preview })
                        }
                        return child
                    })}
                </CustomForm>
                {displayPreview && <DiscordPreview
                    channels={displayPreview ? channels as Channel[] : []}
                    roles={displayPreview ? roles as Role[] : []}
                />}
            </div>
        </div>
    )
}
