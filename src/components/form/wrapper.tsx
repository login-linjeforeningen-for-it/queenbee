'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { FormState } from './actions'
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

type ChildProps = {
    preview: boolean
    defaultValues?: object
}

type FormWrapperProps = {
    name: FormName
    type: 'create' | 'update'
    id?: string
    preview?: boolean
    formAction: (
        prevState: FormState,
        formData: FormData
    ) => FormState | Promise<FormState>
    children: ReactElement<ChildProps> | ReactElement<ChildProps>[]
    channels?: Channel[]
}

export default function FormWrapper({
    name,
    type,
    id,
    preview,
    formAction,
    children,
    channels
}: FormWrapperProps) {
    const router = useRouter()
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
                'h-[var(--h-pageInfo)] w-full flex flex-col items-center'
            }
        >
            <div className={
                `w-full px-16 py-4 ${preview ? 'grid grid-cols-2 gap-4' : ''}`
            }>
                <div className='flex flex-col gap-4'>
                    <button
                        type='button'
                        aria-label='Go back'
                        onClick={() => router.back()}
                        className={
                            'inline-flex items-center gap-2 rounded-lg p-1 px-4 ' +
                            'cursor-pointer hover:text-login bg-login-600 w-fit'
                        }
                    >
                        <ArrowLeft className='size-4.5' />
                        <span>Back</span>
                    </button>
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
                >
                    {Children.map(children, child => {
                        if (isValidElement(child)) {
                            return cloneElement(child, { preview })
                        }
                        return child
                    })}
                </CustomForm>
                {displayPreview && <DiscordPreview channels={displayPreview ? channels as Channel[] : []} />}
            </div>
        </div>
    )
}
