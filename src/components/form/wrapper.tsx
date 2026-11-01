'use client'

import CustomForm from './form'
import type { ReactNode } from 'react'
import BackButton from '@components/navigation/back'

type FormWrapperProps = {
    name: FormName
    path?: string
    type: 'create' | 'update'
    id?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formAction: (prevState: any, formData: FormData) => any | Promise<any>
    children: ReactNode
    customRedirect?: string
}

export default function FormWrapper({
    name,
    path,
    type,
    id,
    formAction,
    children,
    customRedirect,
}: FormWrapperProps) {

    return (
        <div className='w-full flex flex-col gap-4 pb-8'>
            <BackButton pushURL={path ? `/${path}` : undefined} />
            <div className='relative flex flex-col gap-4'>
                <h1 className='flex h-9 items-center pr-32 font-semibold text-lg capitalize'>
                    {type} {name}
                </h1>
                <CustomForm
                    name={name}
                    type={type}
                    id={id}
                    formAction={formAction}
                    customRedirect={customRedirect}
                >
                    {children}
                </CustomForm>
            </div>
        </div>
    )
}
