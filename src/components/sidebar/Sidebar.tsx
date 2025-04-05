import Link from 'next/link'

export default function Sidebar() {

    const paths = {
        'BeeHive': '/beehive', 
        'Events': '/events', 
        'Jobs': '/jobs',
        'Organizations': '/organizations',
        'Locations': '/locations',
        'Rules': '/rules',
    }

    return (
        <div className='h-full w-[var(--sidebar-width)] flex flex-col overflow-hidden bg-[#141414] p-4'>
            {Object.entries(paths).map(([name, path], index) => (
                <Link 
                    key={index}
                    href={path}
                    className='text-white'
                >
                    {name}
                </Link>
            ))}
        </div>
    )
}
