import type { Metadata } from 'next'
import '../globals.css'
import Sidebar from '@components/sidebar/sidebar'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'Queenbee - Admintool',
}

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className='flex flex-1 h-full'>
            <Sidebar />
            <div
                className={
                    'relative p-4 w-full h-full bg-login-800 ' +
                    'overflow-scroll'
                }
            >
                {children}
            </div>
            <Toaster
                position='bottom-right'
                style={
                    {
                        '--normal-bg': '#121212',
                        '--normal-text': 'white',
                        '--normal-border': '#6b6b6b',
                    } as React.CSSProperties
                }
            />
        </main>
    )
}
