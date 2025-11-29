import type { Metadata } from 'next'
import '../globals.css'
import { getDocker } from '@utils/api'
import SidebarInternal from '@components/sidebar/sidebarInternal'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'Queenbee - Admintool',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const docker = await getDocker()

    return (
        <main className='flex flex-1 h-full'>
            <SidebarInternal docker={docker} />
            <div
                className='relative p-4 w-full h-full bg-login-800 overflow-scroll'>
                {children}
            </div>
        </main>
    )
}
