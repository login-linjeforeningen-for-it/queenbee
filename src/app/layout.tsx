import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@components/sidebar/Sidebar'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'Queenbee - Admintool',
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang='en'>
            <body className='h-[100vh] w-[100vw] bg-[var(--color-bg-body)]'>
                <Sidebar />
                <main className='absolute top-0 left-[var(--sidebar-width)] w-full mx-auto'>
                    {children}
                </main>
                
            </body>
        </html>
    )
}
