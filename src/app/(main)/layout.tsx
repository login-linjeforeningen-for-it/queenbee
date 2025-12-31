import type { Metadata } from 'next'
import '../globals.css'
import Sidebar from '@components/sidebar/sidebar'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'Queenbee - Admintool',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className='flex flex-1 h-full'>
            <div className='hidden lg:grid!'>
                <Sidebar />
            </div>
            <div className='relative p-4 w-full h-full bg-login-800 overflow-scroll'>
                {children}
            </div>
        </main>
    )
}
