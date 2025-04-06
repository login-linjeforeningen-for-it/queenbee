import type { Metadata } from 'next'
import '../globals.css'
import Sidebar from '@components/sidebar/sidebar'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'Queenbee - Admintool',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className='flex flex-1 h-full overflow-hidden'>
            <Sidebar />
            <div className='p-4 w-full h-full bg-normal'>
                {children}
            </div>
        </main>
    )
}
