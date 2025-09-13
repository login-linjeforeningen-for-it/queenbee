'use server'

type FormProps = {
    title: string
}

type ReturnFormProps = {
    id: number
} & FormProps

export async function createForm(_: FormProps, formData: FormData): Promise<ReturnFormProps> {
    return {
        id: 0,
        title: formData.get('title') as string
    }
}

export async function updateForm(_: FormProps, formData: FormData): Promise<ReturnFormProps> {
    return {
        id: 0,
        title: formData.get('title') as string
    }
}