import PageClient from './pageClient'
import deleteContainer from '@utils/api/internal/system/deleteContainer'
import getDocker from '@utils/api/internal/system/getDocker'

async function deleteAction(id: string) {
    'use server'
    await deleteContainer(Number(id))
}

export default async function Page() {
    const docker = await getDocker()

    if (docker.error) {
        return (
            <div className='h-full overflow-hidden flex flex-col'>
                <div className='flex-none'>
                    <h1 className='font-semibold text-lg'>Services</h1>
                </div>
                <div className='mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200'>
                    {docker.error}
                </div>
            </div>
        )
    }

    return <PageClient docker={docker} deleteAction={deleteAction} />
}
