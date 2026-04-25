'use client'

import Alert from '@components/alert/alert'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Pagination from '@components/table/pagination'
import getDocker from '@utils/api/internal/system/getDocker'
import Conveyer from '@components/update/conveyer'
import ConveyerStopped from '@components/update/conveyerStopped'
import { ArrowUpCircle, LoaderCircle, RefreshCcw } from 'lucide-react'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type PageClientProps = {
    docker: Docker
    deleteAction: (id: string) => Promise<void>
}
const headers = [
    'id',
    'name',
    'status',
    'actions'
]

const refreshOptions = [
    { label: 'Off', value: 0 },
    { label: '1s', value: 1000 },
    { label: '3s', value: 3000 },
    { label: '5s', value: 5000 },
    { label: '10s', value: 10000 },
    { label: '30s', value: 30000 },
    { label: '1m', value: 60000 },
    { label: '5m', value: 300000 },
]

type DeploymentRunState = {
    status: 'idle' | 'deploying' | 'success' | 'error'
    message?: string
    updatedAt?: number
}

function formatRelativeDate(value: string | null) {
    if (!value) {
        return null
    }

    const timestamp = new Date(value)
    if (Number.isNaN(timestamp.getTime())) {
        return null
    }

    const diffMs = timestamp.getTime() - Date.now()
    const absSeconds = Math.abs(diffMs) / 1000
    const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

    if (absSeconds < 60) {
        return formatter.format(Math.round(diffMs / 1000), 'second')
    }

    if (absSeconds < 3600) {
        return formatter.format(Math.round(diffMs / 60000), 'minute')
    }

    if (absSeconds < 86400) {
        return formatter.format(Math.round(diffMs / 3600000), 'hour')
    }

    return formatter.format(Math.round(diffMs / 86400000), 'day')
}

function getDeploymentSummary(deployment: DeploymentStatus, runState?: DeploymentRunState) {
    if (runState?.status === 'deploying' || deployment.activeState === 'activating') {
        return {
            title: 'Deploying now',
            detail: 'Redeploy in progress',
            tone: 'text-amber-300'
        }
    }

    if (runState?.status === 'error') {
        return {
            title: runState.message || 'Deploy failed',
            detail: deployment.error || 'Check deployment logs',
            tone: 'text-red-300'
        }
    }

    if (deployment.autoDeployEnabled) {
        return {
            title: 'Autodeploy active',
            detail: deployment.lastAutoDeployAt
                ? `Last auto deploy ${formatRelativeDate(deployment.lastAutoDeployAt)}`
                : 'Awaiting first auto deploy',
            tone: 'text-emerald-300'
        }
    }

    if (deployment.updateAvailable) {
        return {
            title: `${deployment.behindCount} update${deployment.behindCount === 1 ? '' : 's'} available`,
            detail: deployment.lastDeploymentAt
                ? `Last deploy ${formatRelativeDate(deployment.lastDeploymentAt)}`
                : 'Ready to redeploy',
            tone: 'text-amber-300'
        }
    }

    return {
        title: 'No update available',
        detail: deployment.lastDeploymentAt
            ? `Last deploy ${formatRelativeDate(deployment.lastDeploymentAt)}`
            : 'No recent deploy recorded',
        tone: 'text-white/70'
    }
}

function DeploymentMeta({
    deployment,
    runState
}: {
    deployment: DeploymentStatus | null
    runState?: DeploymentRunState
}) {
    if (!deployment) {
        return <span className='text-xs text-white/40'>No deployment hooks</span>
    }

    const summary = getDeploymentSummary(deployment, runState)
    const deploymentStamp = !deployment.autoDeployEnabled && deployment.lastAutoDeployAt
        ? `Autodeploy last ran ${formatRelativeDate(deployment.lastAutoDeployAt)}`
        : null

    return (
        <div className='flex max-w-64 flex-col items-end text-right'>
            <span className={`text-xs font-semibold ${summary.tone}`}>{summary.title}</span>
            <span className='text-[11px] text-white/55'>{summary.detail}</span>
            {deploymentStamp && <span className='text-[11px] text-white/40'>{deploymentStamp}</span>}
            {runState?.status === 'success' && runState.message && (
                <span className='text-[11px] text-emerald-300'>{runState.message}</span>
            )}
            {deployment.error && (
                <span className='text-[11px] text-red-300'>{deployment.error}</span>
            )}
        </div>
    )
}

function ActionButtons({
    deployment,
    runState,
    onRefresh,
    onToggleAutoDeploy,
    onRunDeployment,
}: {
    deployment: DeploymentStatus | null
    runState?: DeploymentRunState
    onRefresh: () => Promise<void>
    onToggleAutoDeploy: (deployment: DeploymentStatus) => Promise<void>
    onRunDeployment: (deployment: DeploymentStatus) => Promise<void>
}) {
    async function handleRefresh() {
        await onRefresh()
    }

    async function handleUpdate() {
        if (!deployment) {
            return
        }

        await onRunDeployment(deployment)
    }

    async function handleAutoUpdate() {
        if (!deployment) {
            return
        }

        await onToggleAutoDeploy(deployment)
    }

    return (
        <div onClick={(e) => e.stopPropagation()} className='flex items-center gap-2 justify-end select-none'>
            {!deployment?.autoDeployEnabled && <button
                type='button'
                className={`
                    px-3 py-1.5 rounded flex items-center gap-2
                    justify-center cursor-pointer bg-login-500 group text-xs font-semibold
                    disabled:cursor-not-allowed disabled:opacity-60
                `}
                onClick={handleUpdate}
                disabled={!deployment || runState?.status === 'deploying'}
            >
                {runState?.status === 'deploying'
                    ? <LoaderCircle className='h-4 w-4 animate-spin stroke-amber-300' />
                    : <ArrowUpCircle
                        className={`h-4 w-4 ${deployment?.updateAvailable
                            ? 'stroke-amber-400'
                            : 'group-hover:stroke-green-500'}`}
                    />}
                <span>
                    {runState?.status === 'deploying'
                        ? 'Deploying...'
                        : runState?.status === 'success'
                            ? 'Redeployed'
                            : runState?.status === 'error'
                                ? 'Retry deploy'
                                : deployment?.updateAvailable
                                    ? 'Deploy update'
                                    : 'Redeploy'}
                </span>
            </button>}
            <button
                type='button'
                className={`
                    px-3 py-1.5 rounded bg-login-500 flex items-center
                    justify-center cursor-pointer group select-none
                `}
                onClick={handleRefresh}
            >
                <RefreshCcw className='w-4 h-4 group-hover:stroke-green-500' />
            </button>
            <button
                type='button'
                className={`
                    px-2 rounded group flex select-none
                    items-center justify-center cursor-pointer
                `}
                onClick={handleAutoUpdate}
                disabled={!deployment}
                title={deployment?.autoDeployEnabled ? 'Disable autodeploy' : 'Enable autodeploy'}
            >
                <div className='group cursor-pointer'>
                    {deployment?.autoDeployEnabled ? <Conveyer
                        className='cursor-pointer w-8 h-8'
                        wheels='rounded-lg stroke stroke-login-200 stroke-3'
                        belt='stroke-login-200'
                        containers='stroke-login-200 group-hover:hidden'
                        middleContainer='stroke-green-500 group-hover:stroke-login-200'
                    /> : <ConveyerStopped
                        className='cursor-pointer w-8 h-8'
                        wheels='rounded-lg stroke stroke-login-200 stroke-3'
                        belt='stroke-login-200'
                        cross='#ff0000aa'
                    />}
                </div>
            </button>
        </div>
    )
}

export default function PageClient({ docker: dockerServer, deleteAction }: PageClientProps) {
    const [docker, setDocker] = useState(dockerServer)
    const [autoRefresh, setAutoRefresh] = useState(10000)
    const [autoDeployOverrides, setAutoDeployOverrides] = useState<Record<string, boolean>>({})
    const [deploymentRuns, setDeploymentRuns] = useState<Record<string, DeploymentRunState>>({})
    const searchParams = useSearchParams()
    const query = searchParams?.get('q')?.toLowerCase() ?? ''
    const limit = 25

    const containers = useMemo(() => (
        docker?.containers?.map(container => {
            const deployment = container.deployment && autoDeployOverrides[container.deployment.id] !== undefined
                ? {
                    ...container.deployment,
                    autoDeployEnabled: autoDeployOverrides[container.deployment.id]
                }
                : container.deployment

            return {
                ...container,
                deployment,
            }
        }) || []
    ), [autoDeployOverrides, docker?.containers])

    const filteredContainers = containers.filter(container =>
        container.name.toLowerCase().includes(query) ||
        container.id.toLowerCase().includes(query) ||
        container.status.toLowerCase().includes(query) ||
        container.project.toLowerCase().includes(query) ||
        container.deployment?.name.toLowerCase().includes(query)
    )

    async function refreshDocker() {
        const updatedDocker = await getDocker()
        setDocker(updatedDocker)
    }

    async function handleToggleAutoDeploy(deployment: DeploymentStatus) {
        const nextValue = !deployment.autoDeployEnabled
        setAutoDeployOverrides(current => ({
            ...current,
            [deployment.id]: nextValue,
        }))

        const response = await fetch(`/api/system/autoRestart/${deployment.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled: nextValue })
        })

        if (!response.ok) {
            setAutoDeployOverrides(current => ({
                ...current,
                [deployment.id]: deployment.autoDeployEnabled,
            }))
        }

        await refreshDocker()
    }

    async function handleRunDeployment(deployment: DeploymentStatus) {
        setDeploymentRuns(current => ({
            ...current,
            [deployment.id]: {
                status: 'deploying',
                message: 'Starting redeploy',
                updatedAt: Date.now()
            }
        }))

        try {
            const response = await fetch(`/api/system/update/${deployment.id}`, {
                method: 'POST'
            })
            const payload = await response.json().catch(() => null)

            if (!response.ok) {
                throw new Error(payload?.error || 'Failed to trigger deployment')
            }

            await refreshDocker()

            setDeploymentRuns(current => ({
                ...current,
                [deployment.id]: {
                    status: 'success',
                    message: payload?.mode === 'systemctl' ? 'Redeploy finished' : 'Redeploy completed',
                    updatedAt: Date.now()
                }
            }))
        } catch (error) {
            setDeploymentRuns(current => ({
                ...current,
                [deployment.id]: {
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Failed to trigger deployment',
                    updatedAt: Date.now()
                }
            }))
        }
    }

    const tableList = filteredContainers.map(container => ({
        system_table_id: container.id,
        id: <span className='font-mono text-xs text-login-200'>{container.id.substring(0, 12)}</span>,
        name: <span className='font-medium text-white'>{container.name}</span>,
        status: (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                container.status.toLowerCase().includes('up')
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
                {container.status}
            </span>
        ),
        actions: (
            <div className='flex flex-col items-end gap-2'>
                <DeploymentMeta
                    deployment={container.deployment}
                    runState={container.deployment ? deploymentRuns[container.deployment.id] : undefined}
                />
                <ActionButtons
                    deployment={container.deployment}
                    runState={container.deployment ? deploymentRuns[container.deployment.id] : undefined}
                    onRefresh={refreshDocker}
                    onToggleAutoDeploy={handleToggleAutoDeploy}
                    onRunDeployment={handleRunDeployment}
                />
            </div>
        )
    }))

    useEffect(() => {
        if (autoRefresh === 0) {
            return
        }

        const intervalId = setInterval(async () => {
            await refreshDocker()
        }, autoRefresh)

        return () => clearInterval(intervalId)
    }, [autoRefresh])

    useEffect(() => {
        const deploymentIds = new Set(
            (docker.containers || [])
                .map(container => container.deployment?.id)
                .filter((id): id is string => Boolean(id))
        )

        setAutoDeployOverrides(current => {
            const next = Object.fromEntries(
                Object.entries(current).filter(([id]) => deploymentIds.has(id))
            )

            return Object.keys(next).length === Object.keys(current).length ? current : next
        })
        setDeploymentRuns(current => {
            const next = Object.fromEntries(
                Object.entries(current).filter(([id]) =>
                    deploymentIds.has(id)
                )
            )

            return Object.keys(next).length === Object.keys(current).length ? current : next
        })
    }, [docker.containers])

    useEffect(() => {
        if (!Object.values(deploymentRuns).some(state => state.status === 'success' && state.updatedAt)) {
            return
        }

        const timeoutId = setTimeout(() => {
            setDeploymentRuns(current => {
                const nextEntries = Object.entries(current).filter(([, state]) =>
                    state.status !== 'success' || !state.updatedAt || Date.now() - state.updatedAt < 8000
                )

                return nextEntries.length === Object.keys(current).length
                    ? current
                    : Object.fromEntries(nextEntries)
            })
        }, 1000)

        return () => clearTimeout(timeoutId)
    }, [deploymentRuns])

    function handleAutoRefresh(e: ChangeEvent<HTMLSelectElement>) {
        const selectedOption = refreshOptions.find(opt => opt.label === e.target.value)
        if (selectedOption) {
            setAutoRefresh(selectedOption.value)
        }
    }

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <div className='flex w-full justify-between'>
                    <div className='flex gap-2 items-center'>
                        <h1 className='font-semibold text-lg'>Services</h1>
                    </div>
                    <div className='flex items-center gap-2'>
                        <h1 className='font-semibold text-sm'>Autorefresh</h1>
                        <select
                            className='text-white/80 rounded-md py-1 px-2 outline-none'
                            value={refreshOptions.find(opt => opt.value === autoRefresh)?.label || '3s'}
                            onChange={handleAutoRefresh}
                        >
                            {refreshOptions.map(option => (
                                <option key={option.label} value={option.label}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='flex w-full justify-between items-center py-2'>
                    <Search />
                </div>
            </div>
            {docker.error ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <Alert>{docker.error}</Alert>
                </div>
            ) : !filteredContainers.length && query.length ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <Alert>No containers matches query '{query}'</Alert>
                </div>
            ) : !filteredContainers.length ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <Alert>Containers unavailable</Alert>
                </div>
            ) : (
                <div className='flex-1 flex flex-col overflow-hidden pt-2 gap-2'>
                    <Table
                        list={tableList}
                        headers={headers}
                        deleteAction={deleteAction}
                        hideMenu={true}
                        redirectPath='/internal/services'
                    />
                    <Pagination pageSize={limit} totalRows={docker.count} />
                </div>
            )}
        </div>
    )
}
