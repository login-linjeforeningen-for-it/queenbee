import config from '@config'
import Link from 'next/link'

export default function SidebarVersion() {
    if (!config.version) {
        return <div />
    }

    return (
        <div className='w-full flex justify-center py-4'>
            <Link
                className='group flex items-center gap-2 text-xs font-medium text-login-200 hover:text-login-100 transition-colors'
                target='_blank'
                href={`${config.url.git}/tekkom/web/beehive/queenbee/-/tags/${config.version}`}
                aria-label={`Queenbee version ${config.version}`}
            >
                <span>v{config.version}</span>
            </Link>
        </div>
    )
}
