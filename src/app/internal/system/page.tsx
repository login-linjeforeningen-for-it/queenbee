import getStats from '@utils/api/internal/system/getStats'
import PageClient from './pageClient'
import deleteContainer from '@utils/api/internal/system/deleteContainer'
import getDocker from '@utils/api/internal/system/getDocker'

async function deleteAction(id: string) {
    'use server'
    await deleteContainer(Number(id))
}

export default async function Page() {
    const metrics = await getStats()
    const docker = await getDocker()

    return <PageClient  metrics={metrics} docker={docker} deleteAction={deleteAction} />
}
