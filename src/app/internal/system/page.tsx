import getStats from '@utils/api/system/getStats'
import PageClient from './pageClient'
import deleteContainer from '@utils/api/system/deleteContainer'
import getDocker from '@utils/api/system/getDocker'

async function deleteAction(id: string) {
    'use server'
    await deleteContainer(Number(id))
}

export default async function Page() {
    const metrics = await getStats()
    const docker = await getDocker()

    return <PageClient  metrics={metrics} docker={docker} deleteAction={deleteAction} />
}
