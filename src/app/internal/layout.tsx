import type { Metadata } from 'next'
import SidebarInternal from '@components/sidebar/sidebarInternal'
import worstAndBestServiceStatus from '@components/services/worstAndBestServiceStatus'
import getDocker from '@utils/api/internal/system/getDocker'
import '../globals.css'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'Queenbee - Admintool',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const docker = await getDocker()
    const { meta } = await worstAndBestServiceStatus('prod', true)

    return (
        <main className='flex flex-1 h-full'>
            <div className='hidden lg:grid!'>
                <SidebarInternal meta={meta} docker={docker} />
            </div>
            <div
                className='relative p-2 w-full h-full bg-login-800 overflow-scroll'>
                {children}
            </div>
        </main>
    )
}
