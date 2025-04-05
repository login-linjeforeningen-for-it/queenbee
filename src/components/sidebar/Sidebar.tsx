import Link from 'next/link'

export default function Sidebar() {

    const paths = {
        'Events': '/events', 
        'Jobs': '/jobs',
        'Organizations': '/organizations',
        'Locations': '/locations',
        'Rules': '/rules',
    }

    return (
        <div className='h-full w-[var(--sidebar-width)] flex flex-col overflow-hidden'>
            {Object.entries(paths).map(([name, path], index) => (
                <Link 
                    key={index}
                    href={path}
                >
                    {name}
                </Link>
            ))}
        </div>
    )
}
