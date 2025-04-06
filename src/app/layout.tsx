import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@components/sidebar/sidebar'
import { cookies } from 'next/headers'
import { headers } from "next/headers"
import Nav from '@/components/navbar/nav'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'Queenbee - Admintool',
}

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    const Cookies = await cookies()
    const Headers = await headers()
    const theme = Cookies.get('theme')?.value || 'dark'
    const referer = Headers.get('referer')
    const url = new URL(referer || 'http://localhost:3000/')
    const path = url.pathname
    return (
        <html lang='en' className={`${theme} h-full`}>
            <body className='bg-dark h-full flex flex-col'>
                <header className='h-[var(--h-navbar)]'>
                    <Nav />
                </header>
                <main className='flex flex-1 overflow-hidden'>
                    {path !== '/' && path !== '/logout' && path !== '/login' && <Sidebar />}
                    <div className='p-4 w-full bg-normal'>
                        {children}
                    </div>
                </main>
            </body>
        </html>
    )
}
