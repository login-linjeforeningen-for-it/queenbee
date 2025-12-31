import Services from '@/components/root/services'
import Logs from '@/components/services/logs'
import getLogs from '@/utils/fetch/log/get'
import Terminal from '@/components/services/terminal'
import MonitoredCommands from '@/components/services/monitoredCommands'
import getGlobalCommands from '@/utils/fetch/command/global/get'
import getLocalCommands from '@/utils/fetch/command/local/get'
import { cookies, headers } from 'next/headers'
import getAuthor from '@/utils/fetch/user/getUser'
import Incidents from '@/components/incidents/incidents'
import Domains from '@/components/domains/domains'
import Link from 'next/link'
import Pods from '@/components/services/pods'
import Ingress from '@/components/services/ingress'
import getSegmentedPathname from '@/utils/pathname'

export default async function Service({ params }: { params: Promise<{ id: string[] }> }) {
    const id = (await params).id[1]
    const isGlobal = id === 'global'
    const Headers = await headers()
    const Cookies = await cookies()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const context = segmentedPathname[1] || 'prod'
    const namespace = isGlobal ? '' : segmentedPathname[2] || ''
    const response = await getLogs({
        location: 'server',
        path: isGlobal ? 'global' : 'local',
        page: 1,
        namespace,
        context
    })
    const logs = response.results
    const pages = response.pages || 1
    const globalCommands = await Promise.all((await getGlobalCommands('server')).map(async (command) => ({
        ...command, author: await getAuthor('server', command.author) || 'Unknown User'
    }))) as GlobalCommandWithUser[]
    const localCommands = await Promise.all((await getLocalCommands('server', id)).map(async (command) => ({
        ...command, author: await getAuthor('server', command.author) || 'Unknown User'
    }))) as LocalCommandWithUser[]
    const filteredLogs = isGlobal ? logs : logs.filter((log) => log.command.includes(`-n ${id}`))
    const filteredGlobalCommands = isGlobal
        ? globalCommands.filter((command) => !command.command.includes('{namespace}'))
        : globalCommands.filter((command) => command.command.includes('{namespace}'))
    const filteredLocalCommands = localCommands.filter((command) => command.command.includes(`-n ${id}`))
    const command = Cookies.get('command')?.value || ''
    const commandName = Cookies.get('commandName')?.value || ''
    const commandReason = Cookies.get('commandReason')?.value || ''

    return (
        <div className='grid md:grid-cols-12 gap-2 w-full h-full max-h-full'>
            <div className='rounded-lg grid col-span-3 sm:col-span-2 max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <Services />
            </div>
            <div className='col-span-10 w-full rounded-lg grid md:grid-cols-12 gap-2 h-full max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <div className='w-full col-span-9 max-h-full overflow-hidden flex flex-col'>
                    <div className='w-full shrink-0'>
                        <Terminal
                            name={commandName}
                            reason={commandReason}
                            namespace={id}
                            command={command}
                        />
                    </div>
                    <Logs logs={filteredLogs} pages={pages} />
                    <div className='w-full shrink-0'>
                        <MonitoredCommands
                            globalCommands={filteredGlobalCommands}
                            localCommands={filteredLocalCommands}
                        />
                    </div>
                </div>
                <div className='flex flex-col w-full h-full rounded-lg col-span-3 gap-2'>
                    <div className='w-full h-full rounded-lg bg-login-50/5 p-2 overflow-auto noscroll max-h-[87vh]'>
                        <div className='flex flex-col gap-2'>
                            <Domains />
                            <Incidents />
                            <Pods />
                            <Ingress />
                        </div>
                    </div>
                    <Link href='/internal/kubernetes/message' className='w-full p-2 bg-login-50/5 rounded-lg flex'>
                        <h1 className='px-2 bg-login-400 rounded-lg grid place-items-center mr-2'>S</h1>
                        <h1 className='grid place-items-center'>Service Status</h1>
                    </Link>
                </div>
            </div>
        </div>
    )
}
