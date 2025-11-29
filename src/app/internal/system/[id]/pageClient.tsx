import RelatedContainer from '@components/container/relatedContainer'
import smartDate from '@utils/date/smartDate'

const MB = 1048576

export default function page({ data }: { data: DockerContainer }) {
    const title = 'font-semibold text-lg'
    const section = 'bg-white/5 rounded-lg p-2 space-y-2 space-x-2'
    const box = 'bg-white/5 rounded-lg p-2 w-full overflow-auto'
    const boxTitle = 'text-sm'
    const maxCount = data.container.details.HostConfig.RestartPolicy.MaximumRetryCount
    const restartPolicyDetails = !maxCount ? '(∞ attempts)' : `(Max ${maxCount} attempts)`

    return (
        <div className='w-full h-full overflow-auto space-y-2'>
            <h1 className='font-semibold text-lg'>Container {data.container.name} ({data.container.id})</h1>
            <div className='grid gap-2 grid-cols-2'>
                <div className={section}>
                    <h1 className={title}>Overview</h1>
                    <div className='space-y-2'>
                        <div className='grid grid-cols-3 gap-2'>
                            <div className={box}>
                                <h1 className={boxTitle}>Service</h1>
                                <h1>{data.service}</h1>
                            </div>
                            <div className={box}>
                                <h1 className={boxTitle}>ID</h1>
                                <h1>{data.container.id}</h1>
                            </div>
                            <div className={box}>
                                <h1 className={boxTitle}>Name</h1>
                                <h1>{data.container.name}</h1>
                            </div>
                            <div className={box}>
                                <h1 className={boxTitle}>Status</h1>
                                <h1>{data.container.status}</h1>
                            </div>
                            <div className={box}>
                                <h1>Uptime</h1>
                                <h1>{data.container.uptime}</h1>
                            </div>
                            <div className={box}>
                                <h1>Pid</h1>
                                <h1>{data.container.details.State.Pid}</h1>
                            </div>
                            <div className={box}>
                                <h1>Created</h1>
                                <h1>{smartDate(data.container.details.Created)}</h1>
                            </div>
                            <div className={box}>
                                <h1>Platform</h1>
                                <h1>{data.container.details.Platform}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={section}>
                    <h1 className={title}>Related Containers {data.related.length && `(${data.related.length})`}</h1>
                    {!data.related.length && <h1>This is a standalone service.</h1>}
                    {data.related.map((container) => <RelatedContainer key={container.id} container={container} />)}
                </div>
                <div className={section}>
                    <h1 className={title}>Details</h1>
                    <h1>Details</h1>
                    <div className='grid grid-cols-3 gap-2'>
                        <div className={box}>
                            <h1>Full ID</h1>
                            <h1>{data.container.details.Id}</h1>
                        </div>
                        <div className={box}>
                            <h1>Args</h1>
                            <h1>{data.container.details.Args.join(' ')}</h1>
                        </div>
                        <div className={box}>
                            <h1>Status</h1>
                            <h1>{data.container.details.State.Status}</h1>
                        </div>
                        <div className={box}>
                            <h1>Working Directory</h1>
                            <h1>{data.container.details.Config.WorkingDir}</h1>
                        </div>
                        <div className={box}>
                            <h1>Restart Policy</h1>
                            <div className='flex gap-1'>
                                <span>{data.container.details.HostConfig.RestartPolicy.Name}</span>
                                <span>{restartPolicyDetails}</span>
                            </div>
                        </div>
                        <div className={box}>
                            <h1>Restart Count</h1>
                            <h1>{data.container.details.RestartCount}</h1>
                        </div>
                        <div className={box}>
                            <h1>Exit Code</h1>
                            <h1>{data.container.details.State.ExitCode}</h1>
                        </div>
                        <div className={box}>
                            <h1>Image</h1>
                            <h1>{data.container.details.Image}</h1>
                        </div>
                        <div className={box}>
                            <h1>Driver</h1>
                            <h1>{data.container.details.Driver}</h1>
                        </div>
                        <div className={box}>
                            <h1>Network Mode</h1>
                            <h1>{data.container.details.HostConfig.NetworkMode}</h1>
                        </div>
                        <div className={box}>
                            <h1>Image Size</h1>
                            <h1>{data.container.details.HostConfig.ShmSize / MB}MB</h1>
                        </div>
                        <div className={box}>
                            <h1>Running</h1>
                            <h1>{data.container.details.State.Running}</h1>
                        </div>
                        <div className={box}>
                            <h1>Paused</h1>
                            <h1>{data.container.details.State.Paused}</h1>
                        </div>
                        <div className={box}>
                            <h1>Restarting</h1>
                            <h1>{data.container.details.State.Restarting}</h1>
                        </div>
                        <div className={box}>
                            <h1>OOM Killed</h1>
                            <h1>{data.container.details.State.OOMKilled}</h1>
                        </div>
                        <div className={box}>
                            <h1>Dead</h1>
                            <h1>{data.container.details.State.Dead}</h1>
                        </div>
                        <div className={box}>
                            <h1>Error</h1>
                            <h1>{data.container.details.State.Error}</h1>
                        </div>
                        <div className={box}>
                            <h1>Pids Limit</h1>
                            <h1>{data.container.details.HostConfig.PidsLimit || 'Unlimited'}</h1>
                        </div>
                    </div>
                </div>
                <div className={section}>
                    <h1 className={title}>Metrics</h1>
                    <h1>Memory</h1>
                    <div className='grid grid-cols-3 gap-2'>
                        <div className={box}>
                            <h1>Memory</h1>
                            <h1>{data.container.details.HostConfig.Memory}</h1>
                        </div>
                        <div className={box}>
                            <h1>Memory Reservation</h1>
                            <h1>{data.container.details.HostConfig.MemoryReservation}</h1>
                        </div>
                        <div className={box}>
                            <h1>Swap</h1>
                            <h1>{data.container.details.HostConfig.MemorySwap}</h1>
                        </div>
                        <div className={box}>
                            <h1>Swappiness</h1>
                            <h1>{data.container.details.HostConfig.MemorySwappiness || 30}</h1>
                        </div>
                        <div className={box}>
                            <h1>OOM Kill Disabled</h1>
                            <h1>{data.container.details.HostConfig.OomKillDisable || false}</h1>
                        </div>
                    </div>
                    <h1>CPU</h1>
                    <div className='grid grid-cols-3 gap-2'>
                        <div className={box}>
                            <h1>Nano Cpus</h1>
                            <h1>{data.container.details.HostConfig.NanoCpus}</h1>
                        </div>
                        <div className={box}>
                            <h1>Cpu Shares</h1>
                            <h1>{data.container.details.HostConfig.CpuShares}</h1>
                        </div>
                        <div className={box}>
                            <h1>Cpu Period</h1>
                            <h1>{data.container.details.HostConfig.CpuPeriod}</h1>
                        </div>
                        <div className={box}>
                            <h1>Cpu Quota</h1>
                            <h1>{data.container.details.HostConfig.CpuQuota}</h1>
                        </div>
                        <div className={box}>
                            <h1>Cpu Realtime Period</h1>
                            <h1>{data.container.details.HostConfig.CpuRealtimePeriod}</h1>
                        </div>
                        <div className={box}>
                            <h1>Cpu Realtime Runtime</h1>
                            <h1>{data.container.details.HostConfig.CpuRealtimeRuntime}</h1>
                        </div>
                        <div className={box}>
                            <h1>Cpuset Cpus</h1>
                            <h1>{data.container.details.HostConfig.CpusetCpus}</h1>
                        </div>
                        <div className={box}>
                            <h1>Cpuset Mems</h1>
                            <h1>{data.container.details.HostConfig.CpusetMems}</h1>
                        </div>
                        <div className={box}>
                            <h1>Cpu Count</h1>
                            <h1>{data.container.details.HostConfig.CpuCount}</h1>
                        </div>
                        <div className={box}>
                            <h1>Cpu Percent</h1>
                            <h1>{data.container.details.HostConfig.CpuPercent}</h1>
                        </div>
                    </div>
                </div>
                <div className={section}>
                    <h1 className={title}>Misc</h1>
                    <div className='grid grid-cols-2 gap-2'>
                        <div className={box}>
                            <h1>Started At</h1>
                            <h1>{smartDate(data.container.details.State.StartedAt)}</h1>
                        </div>
                        <div className={box}>
                            <h1>Finished At</h1>
                            <h1>{smartDate(data.container.details.State.FinishedAt)}</h1>
                        </div>
                        <div className={box}>
                            <h1>Sandbox ID</h1>
                            <h1>{data.container.details.NetworkSettings.SandboxID}</h1>
                        </div>
                        <div className={box}>
                            <h1>Sandbox Key</h1>
                            <h1>{data.container.details.NetworkSettings.SandboxKey}</h1>
                        </div>
                        <div className={box}>
                            <h1>IO Maximum IOps</h1>
                            <h1>{data.container.details.HostConfig.IOMaximumIOps}</h1>
                        </div>
                        <div className={box}>
                            <h1>IO Maximum Bandwidth</h1>
                            <h1>{data.container.details.HostConfig.IOMaximumBandwidth}</h1>
                        </div>
                        <div className={`${box} overflow-auto`}>
                            <h1>Graph Driver</h1>
                            <h1>Name</h1>
                            <h1>{data.container.details.GraphDriver.Name}</h1>
                            <h1>Data</h1>
                            <h1 className='whitespace-pre'>
                                {JSON.stringify(data.container.details.GraphDriver.Data, null, 6)}
                            </h1>
                        </div>
                        <div className={box}>
                            <h1>Mounts</h1>
                            <h1>{data.container.details.Mounts || 'No mounts.'}</h1>
                        </div>
                        <div className={box}>
                            <h1>Tty</h1>
                            <h1>{data.container.details.Config.Tty}</h1>
                        </div>
                        <div className={box}>
                            <h1>Ulimits</h1>
                            <h1>{data.container.details.HostConfig.Ulimits || 1024}</h1>
                        </div>
                    </div>
                </div>
                <div className={section}>
                    <h1 className={title}>Environtment Variables</h1>
                    <h1 className='whitespace-pre bg-white/5 p-2 rounded-md overflow-auto w-full'>
                        {data.container.details.Config.Env.join('\n')}
                    </h1>
                </div>
                <div className={section}>
                    <h1 className={title}>Ports</h1>
                    <h1>Ports</h1>
                    <h1 className='whitespace-pre bg-white/5 p-2 rounded-md overflow-auto w-full'>
                        {JSON.stringify(data.container.details.NetworkSettings.Ports, null, 6)}
                    </h1>
                    <h1>Port Bindings</h1>
                    <h1 className='whitespace-pre bg-white/5 p-2 rounded-md overflow-auto w-full'>
                        {JSON.stringify(data.container.details.HostConfig.PortBindings, null, 6)}
                    </h1>
                </div>
                <div className={`${section}`}>
                    <h1 className={title}>Networks</h1>
                    <h1>DNS</h1>
                    <div className={box}>
                        <h1>Dns</h1>
                        <h1>{data.container.details.HostConfig.Dns}</h1>
                    </div>
                    <div className={box}>
                        <h1>Dns Options</h1>
                        <h1>{data.container.details.HostConfig.DnsOptions}</h1>
                    </div>
                    <div className={box}>
                        <h1>Dns Search</h1>
                        <h1>{data.container.details.HostConfig.DnsSearch}</h1>
                    </div>
                    <h1>Details</h1>
                    <h1 className='whitespace-pre bg-white/5 p-2 rounded-md overflow-auto w-full'>
                        {JSON.stringify(data.container.details.NetworkSettings.Networks, null, 6)}
                    </h1>
                </div>
                <div className={`${section} overflow-auto`}>
                    <h1 className={title}>Logs</h1>
                    <h1 className='whitespace-pre bg-white/5 p-2 rounded-md overflow-auto w-full'>
                        {data.container.logs.join('\n')}
                    </h1>
                </div>
                <div className={`${section} overflow-auto`}>
                    <h1 className={title}>Raw output</h1>
                    <h1 className='whitespace-pre bg-white/5 p-2 rounded-md overflow-auto w-full'>
                        {JSON.stringify(data, null, 6)}
                    </h1>
                </div>
            </div>
        </div>
    )
}
