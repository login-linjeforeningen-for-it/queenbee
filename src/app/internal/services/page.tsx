import PageClient from './pageClient'
import deleteContainer from '@utils/api/internal/system/deleteContainer'
import getDocker from '@utils/api/internal/system/getDocker'

async function deleteAction(id: string) {
    'use server'
    await deleteContainer(Number(id))
}

export default async function Page() {
    const docker = await getDocker()

    return <PageClient docker={docker} deleteAction={deleteAction} />
}
