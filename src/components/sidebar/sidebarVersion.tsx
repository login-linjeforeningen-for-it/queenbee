import config from '@config'
import Link from 'next/link'

export default function SidebarVersion() {
    if (!config.version) {
        return <div />
    }

    return (
        <div className='absolute w-full bottom-4 flex'>
            <Link
                className={`
                    gap-3 px-2 py-1 rounded-lg mx-4 bg-login-700
                    text-white text-center tracking-wide font-bold
                `}
                target='_blank'
                href={`${config.url.GITLAB_URL}/tekkom/web/beehive/queenbee/-/tags/${config.version}`}
                aria-label={`Queenbee version ${config.version}`}
            >
                <span>v{config.version}</span>
            </Link>
        </div>
    )
}
