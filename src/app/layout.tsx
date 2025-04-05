import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@components/sidebar/Sidebar'
import { cookies } from 'next/headers'
import Nav from '@/components/navbar/nav'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'Queenbee - Admintool',
}

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'

    return (
        <html lang='en' className={`${theme} h-full`}>
            <body className='bg-background h-full'>
                <header>
                    <Nav />
                </header>
                <main className='flex h-full'>
                    <Sidebar />
                    <div className='p-4'>
                        {children}
                    </div>
                </main>
            </body>
        </html>
    )
}
