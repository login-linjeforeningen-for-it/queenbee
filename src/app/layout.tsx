import type { Metadata } from 'next'
import './globals.css'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
    title: 'QueenBee',
    description: 'CMS for BeeHive.',
}

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'

    return (
        <html lang='en' className={theme}>
            <body className='bg-background'>
                {children}
            </body>
        </html>
    )
}
