import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import config from '@config'

export default async function Home() {
    const Cookies = await cookies()
    const token = Cookies.get('token')?.value
    if (token) {
        redirect('/dashboard')
    }

    return (
        <main className='h-full grid place-items-center p-4'>
            <div>
                <h1 className='text-2xl font-bold text-login text-center'>QueenBee</h1>
                <p className='mt-2 text-foreground'>Queenbee - Admintool</p>
                
                <Link href={`${config.url.API_URL}/oauth2/login`} className='grid place-items-center'>
                    <button className='mt-2 rounded-lg bg-login px-8 py-1 text-white hover:bg-orange-500 mb-2'>
                        Login
                    </button>
                </Link>
            </div>
        </main>
    )
}
