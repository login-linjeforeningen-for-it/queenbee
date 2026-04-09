import RelatedContainer from '@components/container/relatedContainer'
import smartDate from '@utils/date/smartDate'
import {
    Activity,
    AlignLeft,
    Box,
    Cable,
    Command,
    Cpu,
    FileCode2,
    FileText,
    HardDrive,
    Logs,
    Network,
    Shield,
    ScrollText,
    Server,
} from 'lucide-react'

const MB = 1048576

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

function formatMegabytes(value: number) {
    if (!value) {
        return '0 MB'
    }

    return `${(value / MB).toFixed(value >= MB * 10 ? 0 : 1)} MB`
}

function Section({
    title,
    subtitle,
    icon: Icon,
    children,
    className = '',
    accent = 'slate',
}: {
    title: string
    subtitle?: string
    icon: typeof Server
    children: React.ReactNode
    className?: string
    accent?: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan' | 'slate'
}) {
    const accentMap = {
        blue: 'from-sky-500/20 to-blue-500/5 border-sky-400/20 text-sky-200',
        emerald: 'from-emerald-500/20 to-green-500/5 border-emerald-400/20 text-emerald-200',
        amber: 'from-amber-500/20 to-orange-500/5 border-amber-400/20 text-amber-200',
        rose: 'from-rose-500/20 to-red-500/5 border-rose-400/20 text-rose-200',
        violet: 'from-violet-500/20 to-fuchsia-500/5 border-violet-400/20 text-violet-200',
        cyan: 'from-cyan-500/20 to-sky-500/5 border-cyan-400/20 text-cyan-200',
        slate: 'from-login-50/10 to-login-50/5 border-login-100/10 text-login-100',
    } as const

    return (
        <section
            className={`
                w-full rounded-2xl border border-login-100/10 bg-login-900/55 p-5
                shadow-[0_20px_60px_rgba(0,0,0,0.2)] ${className}
            `}
        >
            <div className='mb-4 flex items-start gap-3'>
                <div
                    className={`
                        flex h-11 w-11 shrink-0 items-center justify-center rounded-full border
                        bg-linear-to-br ${accentMap[accent]}
                    `}
                >
                    <Icon className='h-5 w-5' />
                </div>
                <div>
                    <h2 className='font-semibold text-login-50 text-lg'>{title}</h2>
                    {subtitle && <p className='mt-1 text-sm text-login-100'>{subtitle}</p>}
                </div>
            </div>
            {children}
        </section>
    )
}

function StatCard({
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
    const toneClasses = tone === 'good'
        ? 'text-emerald-300'
        : tone === 'warn'
            ? 'text-amber-300'
            : 'text-login-50'

    return (
        <div className='rounded-xl border border-login-100/10 bg-login-50/5 p-4'>
            <div className='text-[11px] font-medium uppercase tracking-[0.18em] text-login-200'>
                {label}
            </div>
            <div className={`mt-3 wrap-break-word text-sm font-medium ${toneClasses} ${mono ? 'font-mono' : ''}`}>
                {value}
            </div>
        </div>
    )
}

function CodePanel({
    title,
    content,
    className = '',
    tone = 'slate',
    numbered = false,
}: {
    title: string
    content: string
    className?: string
    tone?: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan' | 'slate'
    numbered?: boolean
}) {
    const toneMap = {
        blue: 'border-sky-400/15 bg-sky-950/25',
        emerald: 'border-emerald-400/15 bg-emerald-950/25',
        amber: 'border-amber-400/15 bg-amber-950/25',
        rose: 'border-rose-400/15 bg-rose-950/25',
        violet: 'border-violet-400/15 bg-violet-950/25',
        cyan: 'border-cyan-400/15 bg-cyan-950/25',
        slate: 'border-login-100/10 bg-login-950/60',
    } as const

    const lines = numbered ? content.split('\n') : null

    return (
        <div className={`rounded-xl border ${toneMap[tone]} ${className}`}>
            <div
                className='border-b border-login-100/10 px-4 py-3 text-[11px] font-medium uppercase
                    tracking-[0.18em] text-login-200'
            >
                {title}
            </div>
            {numbered && lines ? (
                <div className='max-h-128 overflow-auto px-4 py-4 font-mono text-[12px] leading-6'>
                    {lines.map((line, index) => (
                        <div key={`${title}-${index}`} className='grid grid-cols-[3rem_1fr] gap-3'>
                            <span className='select-none text-right text-login-300/60'>{index + 1}</span>
                            <span className='whitespace-pre-wrap wrap-break-word text-login-50'>{line || ' '}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <pre
                    className='max-h-128 overflow-auto whitespace-pre-wrap wrap-break-word px-4 py-4
                        font-mono text-[12px] leading-6 text-login-50'
                >
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
    const labels = JSON.stringify(details.Config.Labels, null, 2)
    const ports = JSON.stringify(details.NetworkSettings.Ports, null, 2)
    const exposedPorts = JSON.stringify(details.Config.ExposedPorts, null, 2)
    const portBindings = JSON.stringify(details.HostConfig.PortBindings, null, 2)
    const networks = JSON.stringify(details.NetworkSettings.Networks, null, 2)
    const graphDriver = JSON.stringify(details.GraphDriver.Data, null, 2)
    const mounts = JSON.stringify(details.Mounts, null, 2)
    const command = [
        details.Path,
        ...details.Args,
    ].filter(Boolean).join(' ')
    const entrypoint = formatValue(details.Config.Entrypoint, 'Default entrypoint')
    const cmd = formatValue(details.Config.Cmd, 'No explicit command')
    const paths = [
        `ResolvConfPath: ${formatValue(details.ResolvConfPath)}`,
        `HostnamePath: ${formatValue(details.HostnamePath)}`,
        `HostsPath: ${formatValue(details.HostsPath)}`,
        `LogPath: ${formatValue(details.LogPath)}`,
    ].join('\n')
    const raw = JSON.stringify(data, null, 2)

    return (
        <div className='h-full w-full overflow-y-auto'>
            <div className='flex w-full flex-col gap-4 pb-4'>
                <Section
                    title={`Container ${container.name}`}
                    subtitle='Detailed runtime, resource, networking, and log information for this service container.'
                    icon={Server}
                    accent='blue'
                >
                    <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                        <StatCard label='Service' value={service} />
                        <StatCard label='Container ID' value={container.id} mono />
                        <StatCard
                            label='Status'
                            value={container.status}
                            tone={container.status.toLowerCase().includes('up') ? 'good' : 'warn'}
                        />
                        <StatCard label='Uptime' value={container.uptime} />
                        <StatCard label='Platform' value={formatValue(details.Platform)} />
                        <StatCard label='PID' value={details.State.Pid} />
                        <StatCard label='Created' value={smartDate(details.Created)} />
                        <StatCard label='Image' value={details.Image} mono />
                    </div>
                </Section>

                <div className='grid gap-4 xl:grid-cols-[1.2fr_0.8fr]'>
                    <Section
                        title='Runtime Overview'
                        subtitle='High-level container state and restart behavior.'
                        icon={Activity}
                        accent='emerald'
                    >
                        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
                            <StatCard label='State' value={details.State.Status} />
                            <StatCard label='Restart Policy' value={`${details.HostConfig.RestartPolicy.Name} • ${restartPolicyDetails}`} />
                            <StatCard label='Restart Count' value={details.RestartCount} />
                            <StatCard label='Running' value={formatBool(details.State.Running)} />
                            <StatCard label='Paused' value={formatBool(details.State.Paused)} />
                            <StatCard label='Restarting' value={formatBool(details.State.Restarting)} />
                            <StatCard label='OOM Killed' value={formatBool(details.State.OOMKilled)} />
                            <StatCard label='Dead' value={formatBool(details.State.Dead)} />
                            <StatCard label='Exit Code' value={details.State.ExitCode} />
                            <StatCard label='Started At' value={smartDate(details.State.StartedAt)} />
                            <StatCard label='Finished At' value={smartDate(details.State.FinishedAt)} />
                            <StatCard label='Last Error' value={formatValue(details.State.Error, 'No runtime error')} />
                        </div>
                    </Section>

                    <Section
                        title='Related Containers'
                        subtitle='Sibling containers detected from the same service prefix.'
                        icon={Box}
                        accent='violet'
                    >
                        {related.length ? (
                            <div className='flex flex-col gap-3'>
                                {related.map((item) => <RelatedContainer key={item.id} container={item} />)}
                            </div>
                        ) : (
                            <div className='rounded-xl border border-login-100/10 bg-login-50/5 px-4 py-6 text-sm text-login-100'>
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
                        accent='amber'
                    >
                        <div className='grid gap-3 md:grid-cols-2'>
                            <StatCard label='Full ID' value={details.Id} mono />
                            <StatCard label='Name' value={container.name} />
                            <StatCard label='Driver' value={details.Driver} />
                            <StatCard label='Network Mode' value={details.HostConfig.NetworkMode} />
                            <StatCard label='Working Directory' value={formatValue(details.Config.WorkingDir)} mono />
                            <StatCard label='TTY Enabled' value={formatBool(details.Config.Tty)} />
                            <StatCard label='PIDs Limit' value={formatValue(details.HostConfig.PidsLimit, 'Unlimited')} />
                            <StatCard label='Ulimits' value={formatValue(details.HostConfig.Ulimits, 'Default')} />
                            <StatCard label='Sandbox ID' value={formatValue(details.NetworkSettings.SandboxID)} mono />
                            <StatCard label='Sandbox Key' value={formatValue(details.NetworkSettings.SandboxKey)} mono />
                            <StatCard label='Mounts' value={formatValue(details.Mounts, 'No mounts')} />
                            <StatCard label='Arguments' value={formatValue(details.Args, 'No runtime arguments')} mono />
                            <StatCard label='User' value={formatValue(details.Config.User, 'Container default')} />
                            <StatCard label='Exec IDs' value={formatValue(details.ExecIDs, 'No active exec sessions')} />
                        </div>
                    </Section>

                    <Section
                        title='Resource Limits'
                        subtitle='Memory, CPU, and IO settings assigned to the container.'
                        icon={Cpu}
                        accent='rose'
                    >
                        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
                            <StatCard label='Shared Memory' value={formatMegabytes(details.HostConfig.ShmSize)} />
                            <StatCard label='Memory Limit' value={formatMegabytes(details.HostConfig.Memory)} />
                            <StatCard label='Memory Reservation' value={formatMegabytes(details.HostConfig.MemoryReservation)} />
                            <StatCard label='Memory Swap' value={formatMegabytes(details.HostConfig.MemorySwap)} />
                            <StatCard label='Swappiness' value={formatValue(details.HostConfig.MemorySwappiness, '30')} />
                            <StatCard label='OOM Kill Disabled' value={formatBool(Boolean(details.HostConfig.OomKillDisable))} />
                            <StatCard label='Nano CPUs' value={details.HostConfig.NanoCpus} />
                            <StatCard label='CPU Shares' value={details.HostConfig.CpuShares} />
                            <StatCard label='CPU Period' value={details.HostConfig.CpuPeriod} />
                            <StatCard label='CPU Quota' value={details.HostConfig.CpuQuota} />
                            <StatCard label='CPU Count' value={details.HostConfig.CpuCount} />
                            <StatCard label='CPU Percent' value={details.HostConfig.CpuPercent} />
                            <StatCard label='CPU Realtime Period' value={details.HostConfig.CpuRealtimePeriod} />
                            <StatCard label='CPU Realtime Runtime' value={details.HostConfig.CpuRealtimeRuntime} />
                            <StatCard label='Cpuset CPUs' value={formatValue(details.HostConfig.CpusetCpus)} mono />
                            <StatCard label='Cpuset Mems' value={formatValue(details.HostConfig.CpusetMems)} mono />
                            <StatCard label='IO Max IOPS' value={details.HostConfig.IOMaximumIOps} />
                            <StatCard label='IO Max Bandwidth' value={details.HostConfig.IOMaximumBandwidth} />
                        </div>
                    </Section>
                </div>

                <div className='grid gap-4 xl:grid-cols-2'>
                    <Section
                        title='Commands & Paths'
                        subtitle='Startup command, entrypoint, and low-level file paths.'
                        icon={Command}
                        accent='cyan'
                    >
                        <div className='grid gap-3 md:grid-cols-2'>
                            <StatCard label='Startup Command' value={command || 'Container default'} mono />
                            <StatCard label='Entrypoint' value={entrypoint} mono />
                            <StatCard label='Cmd' value={cmd} mono />
                            <StatCard label='Container ID File' value={formatValue(details.HostConfig.ContainerIDFile)} mono />
                        </div>
                        <div className='mt-4'>
                            <CodePanel title='Runtime Paths' content={paths} tone='cyan' />
                        </div>
                    </Section>

                    <Section
                        title='Environment'
                        subtitle='Container environment variables and raw runtime arguments.'
                        icon={AlignLeft}
                        accent='violet'
                    >
                        <CodePanel title='Environment Variables' content={env} tone='violet' />
                    </Section>

                    <Section
                        title='Networking'
                        subtitle='Port exposure, bindings, DNS, and attached networks.'
                        icon={Network}
                        accent='blue'
                    >
                        <div className='grid gap-3 md:grid-cols-3'>
                            <StatCard label='DNS' value={formatValue(details.HostConfig.Dns)} />
                            <StatCard label='DNS Options' value={formatValue(details.HostConfig.DnsOptions)} />
                            <StatCard label='DNS Search' value={formatValue(details.HostConfig.DnsSearch)} />
                        </div>
                        <div className='mt-4 grid gap-4'>
                            <CodePanel title='Ports' content={ports} tone='blue' />
                            <CodePanel title='Exposed Ports' content={exposedPorts} tone='blue' />
                            <CodePanel title='Port Bindings' content={portBindings} tone='blue' />
                            <CodePanel title='Networks' content={networks} tone='blue' />
                        </div>
                    </Section>
                </div>

                <div className='grid gap-4 xl:grid-cols-[0.9fr_1.1fr]'>
                    <Section
                        title='Graph Driver'
                        subtitle='Storage backend metadata for the current image layers.'
                        icon={HardDrive}
                        accent='amber'
                    >
                        <div className='grid gap-3 md:grid-cols-2'>
                            <StatCard label='Driver Name' value={details.GraphDriver.Name} />
                            <StatCard label='AppArmor Profile' value={formatValue(details.AppArmorProfile)} />
                        </div>
                        <div className='mt-4'>
                            <CodePanel title='Driver Data' content={graphDriver} tone='amber' />
                        </div>
                    </Section>

                    <Section
                        title='Recent Logs'
                        subtitle='Latest container output captured from the internal API.'
                        icon={Logs}
                        accent='emerald'
                    >
                        <CodePanel
                            title='docker logs --tail 500'
                            content={logs}
                            className='min-h-112'
                            tone='emerald'
                            numbered
                        />
                    </Section>
                </div>

                <div className='grid gap-4 xl:grid-cols-2'>
                    <Section
                        title='Security & Runtime Flags'
                        subtitle='Container privilege, cgroup, and isolation-related settings.'
                        icon={Shield}
                        accent='rose'
                    >
                        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
                            <StatCard label='Privileged' value={formatBool(Boolean(details.HostConfig.Privileged))} />
                            <StatCard label='Readonly Root FS' value={formatBool(Boolean(details.HostConfig.ReadonlyRootfs))} />
                            <StatCard label='Auto Remove' value={formatBool(Boolean(details.HostConfig.AutoRemove))} />
                            <StatCard label='Publish All Ports' value={formatBool(Boolean(details.HostConfig.PublishAllPorts))} />
                            <StatCard label='IPC Mode' value={formatValue(details.HostConfig.IpcMode)} />
                            <StatCard label='PID Mode' value={formatValue(details.HostConfig.PidMode)} />
                            <StatCard label='UTS Mode' value={formatValue(details.HostConfig.UTSMode)} />
                            <StatCard label='Userns Mode' value={formatValue(details.HostConfig.UsernsMode)} />
                            <StatCard label='Cgroupns Mode' value={formatValue(details.HostConfig.CgroupnsMode)} />
                            <StatCard label='Runtime' value={formatValue(details.HostConfig.Runtime)} />
                            <StatCard label='Isolation' value={formatValue(details.HostConfig.Isolation)} />
                            <StatCard label='Cgroup Parent' value={formatValue(details.HostConfig.CgroupParent)} mono />
                            <StatCard label='Cgroup' value={formatValue(details.HostConfig.Cgroup)} mono />
                            <StatCard label='Oom Score Adj' value={details.HostConfig.OomScoreAdj} />
                            <StatCard label='Volume Driver' value={formatValue(details.HostConfig.VolumeDriver)} />
                        </div>
                    </Section>

                    <Section
                        title='Low-Level Docker Metadata'
                        subtitle='Labels, mounts, and detailed host/runtime configuration snapshots.'
                        icon={Cable}
                        accent='slate'
                    >
                        <div className='grid gap-4'>
                            <CodePanel title='Container Labels' content={labels} tone='slate' />
                            <CodePanel title='Mounts' content={mounts} tone='slate' />
                        </div>
                    </Section>
                </div>

                <div className='grid gap-4 xl:grid-cols-2'>
                    <Section
                        title='Raw Payload'
                        subtitle='Full response from the internal API for debugging.'
                        icon={FileCode2}
                        accent='cyan'
                    >
                        <CodePanel title='Raw JSON' content={raw} className='min-h-112' tone='cyan' />
                    </Section>

                    <Section
                        title='File & Logging Metadata'
                        subtitle='Inspect paths and Docker logging configuration used by the container.'
                        icon={FileText}
                        accent='amber'
                    >
                        <div className='grid gap-3 md:grid-cols-2'>
                            <StatCard label='Log Driver' value={formatValue(details.HostConfig.LogConfig.Type)} />
                            <StatCard label='Hostname' value={formatValue(details.Config.Hostname)} />
                            <StatCard label='Domainname' value={formatValue(details.Config.Domainname)} />
                            <StatCard label='Working Dir' value={formatValue(details.Config.WorkingDir)} mono />
                            <StatCard label='Mount Label' value={formatValue(details.MountLabel)} mono />
                            <StatCard label='Process Label' value={formatValue(details.ProcessLabel)} mono />
                        </div>
                        <div className='mt-4'>
                            <CodePanel
                                title='Docker Log Config'
                                content={JSON.stringify(details.HostConfig.LogConfig, null, 2)}
                                tone='amber'
                            />
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    )
}
