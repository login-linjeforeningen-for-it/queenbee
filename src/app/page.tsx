import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginPage } from 'uibee/components'
import config from '@config'
import LoggedOutServices from '@/components/root/loggedOutServices'
import Note from '@/components/services/note'
import getMessages from '@/utils/fetch/message/get'
import Message from '@/components/services/message'

export default async function Home() {
    const Cookies = await cookies()
    const imposter = Boolean(Cookies.get('imposter')?.value)
    const invalidToken = Boolean(Cookies.get('invalidToken')?.value)
    const messages = await getMessages('server')
    const token = Cookies.get('access_token')?.value
    if (token) {
        redirect('/dashboard')
    }

    return (
        <div className='grid grid-cols-5 gap-2 w-full h-full max-h-full p-2'>
            <div className='rounded-lg grid max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <LoggedOutServices />
            </div>
            <div className='col-span-3 overflow-auto grid gap-2 max-h-[calc((100vh-var(--h-navbar))-1rem)] w-full'>
                <div className='w-full max-h-full overflow-auto noscroll grid gap-2'>
                    <Note display={imposter} note='This service is only for TekKom.' />
                    <Note display={invalidToken} note='Reauthentication required.' />
                    <LoginPage
                        title='Queenbee'
                        description='Content Management System'
                        redirectURL={config.auth.LOGIN_URL}
                        version={config.version}
                    />
                </div>
            </div>
            <div className='rounded-lg p-4 overflow-auto grid gap-2 max-h-[calc((100vh-var(--h-navbar))-1rem)] w-full'>
                {messages.length ? <>
                    <h1 className='text-login-200 font-semibold'>Latest service messages</h1>
                    <div className='flex flex-col h-full overflow-auto noscroll gap-2'>
                        {messages.map((message) => <Message
                            key={message.id}
                            message={message}
                            shrink={true}
                        />)}
                    </div>
                </> : <h1 className='col-span-3 w-full'>No recent service messages.</h1>}
            </div>
        </div>
    )
}
