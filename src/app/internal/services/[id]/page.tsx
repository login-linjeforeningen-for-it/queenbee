import getContainer from '@utils/api/internal/system/getContainer'
import { ServerCrash } from 'lucide-react'
import PageClient from './pageClient'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function page({ params }: PageProps) {
    const id = (await params).id
    const container = await getContainer(id)

    if (typeof container === 'string') {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <div
                    className='w-full max-w-2xl rounded-2xl border border-login-100/10 bg-login-900/50
                        px-6 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]'
                >
                    <div
                        className='mx-auto flex h-14 w-14 items-center justify-center rounded-full
                            border border-red-500/20 bg-red-500/10 text-red-300'
                    >
                        <ServerCrash className='h-7 w-7' />
                    </div>
                    <h1 className='mt-4 font-semibold text-lg text-login-50'>Failed to load container</h1>
                    <p className='mt-2 text-sm text-login-100'>
                        We couldn&apos;t fetch the details for <span className='font-mono text-login-50'>{id}</span>.
                    </p>
                    <div
                        className='mt-5 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3
                            text-left text-sm text-red-200'
                    >
                        {container}
                    </div>
                </div>
            </div>
        )
    }

    return <PageClient data={container} />
}
