import { deleteContainer, getDocker, getStats } from '@utils/api'
import PageClient from './pageClient'

async function deleteAction(id: string) {
    'use server'
    await deleteContainer(Number(id))
}

export default async function Page() {
    const metrics = await getStats()
    const docker = await getDocker()

    return <PageClient  metrics={metrics} docker={docker} deleteAction={deleteAction} />
}
