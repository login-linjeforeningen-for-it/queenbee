import { Server, Star } from 'lucide-react'
import Link from 'next/link'

type InternalInfoProps = {
    information: InternalDashboardInformation
}

export default function InternalInfo({ information }: InternalInfoProps) {
    const primary = 'text-sm'
    const secondary = 'text-sm text-login-200 pb-2'

    return (
        <div className='flex gap-4'>
            <Link href='/sites' className='p-4 bg-login-50/5 rounded-md flex flex-col justify-center w-42.5'>
                <h1 className='flex items-center gap-2 text-sm text-muted-foreground capitalize pb-4'>
                    <Star className='w-5' /> Primary Site
                </h1>
                <div>
                    <h1 className={primary}>ID</h1>
                    <h1 className={secondary}>{information.primarySite.id}</h1>
                    <h1 className={primary}>IP</h1>
                    <h1 className={secondary}>{information.primarySite.ip}</h1>
                    <h1 className={primary}>Name</h1>
                    <h1 className={secondary}>{information.primarySite.name}</h1>
                </div>
            </Link>
            <Link href='/sites' className='p-4 bg-login-50/5 rounded-md flex flex-col justify-center w-42.5'>
                <h1 className='flex items-center gap-2 text-sm text-muted-foreground capitalize'>
                    <Server className='w-5' /> System
                </h1>
                <div className='font-bold'>
                    <h1>{information.system.disk}</h1>
                    <h1>{information.system.load}</h1>
                    <h1>{information.system.processes}</h1>
                    <h1>{information.system.ram}</h1>
                    <h1>{information.system.containers}</h1>
                </div>
            </Link>
        </div>
    )
}
