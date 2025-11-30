import Link from 'next/link'
import Global from './global'
import getFormattedContexts from '@utils/context/formattedContexts'
import getSegmentedPathname from '@/utils/pathname'

type HeaderProps = {
    path: string
}

type ContextProps = {
    context: string
    service: string
    activeContext: string
}

export default async function Header({ path }: HeaderProps) {
    const segmentedPathname = getSegmentedPathname(path)
    const contexts = await getFormattedContexts()
    const service = segmentedPathname[2] || ''
    const activeContext = segmentedPathname[1]
    const cols = `grid-cols-${contexts.length}`

    return (
        <div className='bg-login-600 p-2 rounded-lg'>
            <div className={`grid ${cols} gap-2 justify-items-center ${contexts.length && 'pb-2'}`}>
                {contexts.map((context) => <Context
                    key={context}
                    context={context || 'prod'}
                    service={service || 'global'}
                    activeContext={activeContext || 'prod'}
                />)}
            </div>
            <ServiceHeader />
        </div>
    )
}

function Context({ context, service, activeContext }: ContextProps) {
    const active = context.toLowerCase() === activeContext.toLowerCase()
    const cursorStyle = active && service === 'global' ? 'cursor-not-allowed' : ''
    const color = active ? 'bg-login-600' : 'bg-login-500'

    return (
        <Link
            href={`/service/${context.toLowerCase()}/${service ? service : 'global'}`}
            className={`${cursorStyle} ${color} w-full rounded-lg w-full px-2 content-center text-login-200 flex text-lg`}
        >
            <h1 className='mr-1'>≡</h1>
            <h1 className='grid text-base place-self-center'>{context}</h1>
        </Link>
    )
}

async function ServiceHeader() {
    return (
        <div className='flex flex-cols gap-2'>
            <h1 className='text-lg'>Services</h1>
            <Global />
        </div>
    )
}
