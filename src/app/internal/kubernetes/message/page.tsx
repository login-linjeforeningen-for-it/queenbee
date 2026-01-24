import Domains from '@/components/domains/domains'
import Incidents from '@components/image/incidents/incidents'
import Services from '@/components/root/services'
import EditableMessage from '@/components/services/editableMessage'
import PostMessage from '@/components/services/postMessage'
import getMessages from '@/utils/fetch/message/get'
import getAuthor from '@/utils/fetch/user/getUser'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Page() {
    const Cookies = await cookies()
    const messages = await getMessages('server')
    const title = Cookies.get('messageTitle')?.value || ''
    const content = Cookies.get('messageContent')?.value || ''
    const status = Cookies.get('messageStatus')?.value || ''
    return (
        <div className='grid grid-cols-12 gap-2 w-full h-full max-h-full'>
            <div className='rounded-lg grid col-span-3 sm:col-span-2 max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <Services />
            </div>
            <div className='col-span-10 w-full rounded-lg grid grid-cols-12 gap-2 h-full max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <div className='w-full col-span-9 max-h-full overflow-hidden grid grid-cols-2 gap-2'>
                    <PostMessage title={title} content={content} status={status} />
                    <div className='w-full h-full bg-login-50/5 rounded-lg p-2 flex flex-col overflow-hidden'>
                        <h1>Recent service messages</h1>
                        <div className='flex flex-col h-full overflow-auto noscroll gap-2'>
                            {messages.map(async(message) => {
                                const author = await getAuthor('server', message.author)
                                const name = author && 'user_name' in author ? author.user_name : 'Unknown User'
                                return <EditableMessage key={message.id} message={message} author={name} />
                            })}
                        </div>
                    </div>
                </div>
                <div className='inline-flex flex-col w-full h-full rounded-lg col-span-3 overflow-auto noscroll gap-2'>
                    <div className='w-full h-full rounded-lg bg-login-50/5 p-2'>
                        <div className='flex flex-col gap-2 h-full'>
                            <Domains />
                            <Incidents />
                        </div>
                    </div>
                    <Link href='/internal/kubernetes/prod/global' className='flex w-full p-2 bg-login-50/5 rounded-lg'>
                        <h1 className='px-2 bg-login-400 rounded-lg grid place-items-center mr-2'>B</h1>
                        <h1 className='grid place-items-center'>Back</h1>
                    </Link>
                </div>
            </div>
        </div>
    )
}
