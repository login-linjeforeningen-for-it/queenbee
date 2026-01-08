'use client'

import CustomForm from './form'
import {
    Children,
    cloneElement,
    isValidElement,
    ReactElement
} from 'react'
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formAction: (prevState: any, formData: FormData) => any | Promise<any>
    children: ReactElement<ChildProps> | ReactElement<ChildProps>[]
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
        <div className='h-(--h-pageInfo) w-full flex flex-col items-center'>
            <div className='w-full md:px-16 md:py-4'>
                <div className='flex flex-col gap-4'>
                    <BackButton pushURL={path ? `/${path}` : undefined} />
                    <h1 className='font-semibold text-lg md:text-2xl capitalize'>
                        {type} {name}
                    </h1>
                </div>
                <div className='flex flex-col gap-4 mt-4' />
                <CustomForm
                    name={name}
                    type={type}
                    id={id}
                    formAction={formAction}
                    customRedirect={customRedirect}
                >
                    {Children.map(children, child => {
                        if (isValidElement(child)) {
                            return cloneElement(child)
                        }

                        return child
                    })}
                </CustomForm>
            </div>
        </div>
    )
}
