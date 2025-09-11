import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import config from '@config'
import { LogIn } from 'lucide-react'

export default async function Home() {
    const Cookies = await cookies()
    const token = Cookies.get('token')?.value
    if (token) {
        redirect('/dashboard')
    }

    return (
        <main className='h-full grid place-items-center p-4'>
            <div>
                <h1 className='text-2xl font-bold text-login text-center'>
                    QueenBee
                </h1>
                <p className='mt-2 text-foreground'>Queenbee - Admintool</p>

                <Link
                    href={`${config.url.NEXT_PUBLIC_BROWSER_API}/oauth2/login`}
                    className='grid place-items-center'
                >
                    <button
                        className={
                            'flex align-middle gap-2 mt-2 rounded-lg ' +
                            'bg-login px-8 py-1  hover:bg-orange-500 mb-2'
                        }
                    >
                        Login
                        <LogIn className='w-5' />
                    </button>
                </Link>
            </div>
            {typeof config.version !== 'undefined' ? (
                <Link
                    className={
                        'absolute right-4 bottom-4 bg-login-800 text-login-50 px-2 py-1 rounded-lg font-mono ' +
                        'border border-login-400 rounded-md text-white tracking-[0.05em] font-semibold text-lg '
                    }
                    target='_blank'
                    href={`${config.url.GITLAB_URL}/tekkom/web/beehive/queenbee/-/tags/${config.version}`}
                >
                    v{config.version}
                </Link>
            ) : null}
        </main>
    )
}
