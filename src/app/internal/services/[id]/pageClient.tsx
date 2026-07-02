import RelatedContainer from '@components/container/relatedContainer'
import BackButton from '@components/navigation/back'
import smartDate from '@utils/date/smartDate'
import {
    Activity,
    AlignLeft,
    Box,
    Command,
    Logs,
    Network,
    ScrollText,
    Server,
} from 'lucide-react'

function formatBool(value: boolean) {
    return value ? 'Yes' : 'No'
}

function formatValue(value: unknown, fallback = 'Not set') {
    if (value === null || value === undefined || value === '') {
        return fallback
    }

    if (Array.isArray(value)) {
        return value.length ? value.join(', ') : fallback
    }

    return String(value)
}

function Section({
    title,
    subtitle,
    icon: Icon,
    children,
    className = '',
}: {
    title: string
    subtitle?: string
    icon: typeof Server
    children: React.ReactNode
    className?: string
}) {
    return (
        <section className={`w-full rounded-2xl border border-white/5 bg-login-50/5 p-5 ${className}`}>
            <div className='mb-4 flex items-center gap-2'>
                <Icon className='h-4 w-4 shrink-0 text-login' />
                <div>
                    <h2 className='font-semibold text-sm text-login-50'>{title}</h2>
                    {subtitle && <p className='mt-0.5 text-xs text-login-300'>{subtitle}</p>}
                </div>
            </div>
            {children}
        </section>
    )
}

function Stat({
    label,
    value,
    mono = false,
    tone = 'default',
}: {
    label: string
    value: React.ReactNode
    mono?: boolean
    tone?: 'default' | 'good' | 'warn'
}) {
    const toneClasses =
        tone === 'good' ? 'text-emerald-300' : tone === 'warn' ? 'text-amber-300' : 'text-login-50'

    return (
        <div>
            <div className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-login-300'>{label}</div>
            <div className={`wrap-break-word text-sm font-semibold ${toneClasses} ${mono ? 'font-mono' : ''}`}>
                {value}
            </div>
        </div>
    )
}

function CodePanel({
    title,
    content,
    className = '',
    numbered = false,
}: {
    title: string
    content: string
    className?: string
    numbered?: boolean
}) {
    const lines = numbered ? content.split('\n') : null

    return (
        <div className={`rounded-xl border border-white/5 bg-black/20 ${className}`}>
            <div className='border-b border-white/5 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-login-300'>
                {title}
            </div>
            {numbered && lines ? (
                <div className='max-h-96 overflow-auto px-4 py-4 font-mono text-xs leading-6'>
                    {lines.map((line, index) => (
                        <div key={`${title}-${index}`} className='grid grid-cols-[3rem_1fr] gap-3'>
                            <span className='select-none text-right text-login-300/60'>{index + 1}</span>
                            <span className='whitespace-pre-wrap wrap-break-word text-login-50'>{line || ' '}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <pre className='max-h-96 overflow-auto whitespace-pre-wrap break-all px-4 py-4 font-mono text-xs leading-6 text-login-50'>
                    {content}
                </pre>
            )}
        </div>
    )
}

export default function page({ data }: { data: DockerContainer }) {
    const { container, related, service } = data
    const { details } = container
    const maxCount = details.HostConfig.RestartPolicy.MaximumRetryCount
    const restartPolicyDetails = !maxCount ? 'Unlimited retries' : `Max ${maxCount} retries`
    const logs = container.logs.length ? container.logs.join('\n') : 'No recent logs.'
    const env = details.Config.Env.length ? details.Config.Env.join('\n') : 'No environment variables.'
    const networks = JSON.stringify(details.NetworkSettings.Networks, null, 2)
    const ports = JSON.stringify(details.NetworkSettings.Ports, null, 2)
    const command = [details.Path, ...details.Args].filter(Boolean).join(' ')
    const entrypoint = formatValue(details.Config.Entrypoint, 'Default entrypoint')
    const cmd = formatValue(details.Config.Cmd, 'No explicit command')

    return (
        <div className='h-full w-full overflow-y-auto'>
            <div className='flex w-full flex-col gap-4 pb-4'>
                <div>
                    <BackButton pushURL='/internal/services' />
                </div>

                <Section
                    title={`Container ${container.name}`}
                    subtitle='Detailed runtime, resource, networking, and log information for this service container.'
                    icon={Server}
                >
                    <div className='grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4'>
                        <Stat label='Service' value={service} />
                        <Stat label='Container ID' value={container.id} mono />
                        <Stat
                            label='Status'
                            value={container.status}
                            tone={container.status.toLowerCase().includes('up') ? 'good' : 'warn'}
                        />
                        <Stat label='Uptime' value={container.uptime} />
                        <Stat label='Platform' value={formatValue(details.Platform)} />
                        <Stat label='PID' value={details.State.Pid} />
                        <Stat label='Created' value={smartDate(details.Created)} />
                        <Stat label='Image' value={details.Image} mono />
                    </div>
                </Section>

                <div className='grid gap-4 xl:grid-cols-[1.2fr_0.8fr]'>
                    <Section
                        title='Runtime Overview'
                        subtitle='High-level container state and restart behavior.'
                        icon={Activity}
                    >
                        <div className='grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-4'>
                            <Stat label='State' value={details.State.Status} />
                            <Stat
                                label='Restart Policy'
                                value={`${details.HostConfig.RestartPolicy.Name} • ${restartPolicyDetails}`}
                            />
                            <Stat label='Restart Count' value={details.RestartCount} />
                            <Stat label='Running' value={formatBool(details.State.Running)} />
                            <Stat label='Started At' value={smartDate(details.State.StartedAt)} />
                            <Stat label='Finished At' value={smartDate(details.State.FinishedAt)} />
                            <Stat label='Last Error' value={formatValue(details.State.Error, 'No runtime error')} />
                        </div>
                    </Section>

                    <Section
                        title='Related Containers'
                        subtitle='Sibling containers detected from the same service prefix.'
                        icon={Box}
                    >
                        {related.length ? (
                            <div className='flex flex-col gap-3'>
                                {related.map((item) => (
                                    <RelatedContainer key={item.id} container={item} />
                                ))}
                            </div>
                        ) : (
                            <div className='rounded-lg border border-dashed border-white/8 p-3 text-xs text-login-300'>
                                This service appears to run as a standalone container.
                            </div>
                        )}
                    </Section>
                </div>

                <div className='grid gap-4 xl:grid-cols-2'>
                    <Section
                        title='Configuration'
                        subtitle='Core runtime and image configuration values.'
                        icon={ScrollText}
                    >
                        <div className='grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-4'>
                            <Stat label='Name' value={container.name} />
                            <Stat label='Driver' value={details.Driver} />
                            <Stat label='Network Mode' value={details.HostConfig.NetworkMode} />
                            <Stat label='Working Directory' value={formatValue(details.Config.WorkingDir)} mono />
                            <Stat label='TTY Enabled' value={formatBool(details.Config.Tty)} />
                            <Stat label='Arguments' value={formatValue(details.Args, 'No runtime arguments')} mono />
                            <Stat label='User' value={formatValue(details.Config.User, 'Container default')} />
                        </div>
                    </Section>

                    <Section
                        title='Environment'
                        subtitle='Container environment variables.'
                        icon={AlignLeft}
                    >
                        <CodePanel title='Environment Variables' content={env} />
                    </Section>
                </div>

                <div className='grid gap-4 xl:grid-cols-2'>
                    <Section
                        title='Networking'
                        subtitle='DNS configuration and attached networks.'
                        icon={Network}
                    >
                        <div className='mb-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3'>
                            <Stat label='DNS' value={formatValue(details.HostConfig.Dns)} />
                            <Stat label='DNS Options' value={formatValue(details.HostConfig.DnsOptions)} />
                            <Stat label='DNS Search' value={formatValue(details.HostConfig.DnsSearch)} />
                        </div>
                        <CodePanel title='Networks' content={networks} />
                    </Section>

                    <Section
                        title='Recent Logs'
                        subtitle='Latest container output captured from the internal API.'
                        icon={Logs}
                    >
                        <CodePanel title='docker logs --tail 500' content={logs} numbered />
                    </Section>
                </div>

                <Section
                    title='Commands'
                    subtitle='Startup command, entrypoint, and port bindings.'
                    icon={Command}
                >
                    <div className='mb-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3'>
                        <Stat label='Startup Command' value={command || 'Container default'} mono />
                        <Stat label='Entrypoint' value={entrypoint} mono />
                        <Stat label='Cmd' value={cmd} mono />
                    </div>
                    <CodePanel title='Ports' content={ports} />
                </Section>
            </div>
        </div>
    )
}
