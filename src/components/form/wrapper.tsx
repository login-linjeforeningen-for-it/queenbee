'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { FormState } from './actions'
import CustomForm from './form'

type FormWrapperProps = {
    name: 'event' | 'job' | 'organization' | 'location' | 'rule'
    type: 'create' | 'update'
    id?: string
    formAction: (
        prevState: FormState,
        formData: FormData
    ) => FormState | Promise<FormState>
    children: React.ReactNode
}

export default function FormWrapper({
    name,
    type,
    id,
    formAction,
    children,
}: FormWrapperProps) {
    const router = useRouter()

    return (
        <div
            className={
                'h-[var(--h-pageInfo)] w-full flex flex-col items-center'
            }
        >
            <div className='w-full px-16 py-4'>
                <div className='flex flex-col gap-4'>
                    <button
                        type='button'
                        aria-label='Go back'
                        onClick={() => router.back()}
                        className={
                            'inline-flex items-center gap-2 ' +
                            'cursor-pointer hover:text-login'
                        }
                    >
                        <ArrowLeft className='size-4.5' />
                        <span>Back</span>
                    </button>
                    <h1 className='font-semibold text-2xl capitalize'>
                        {type} {name}
                    </h1>
                </div>
                <div className='flex flex-col gap-4 mt-4'></div>
                <CustomForm
                    name={name}
                    type={type}
                    id={id}
                    formAction={formAction}
                >
                    {children}
                </CustomForm>
            </div>
        </div>
    )
}
