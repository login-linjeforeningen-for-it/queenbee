'use client'

import { useMemo } from 'react'
import {
    Activity,
    Database,
    HardDrive,
    Layers3,
    Server,
    TimerReset,
} from 'lucide-react'
import formatBytes from '@utils/db/formatBytes'
import formatTimestamp from '@utils/db/formatTimestamp'
import SummaryCard from '@components/db/summaryCard'
import QueryWindowGrid from '@components/db/queryWindowGrid'
import QueryCard from '@components/db/queryCard'
import ClusterCard from '@components/db/clusterCard'

type PageClientProps = {
    overview: GetDatabaseOverview | string
}

export default function PageClient({ overview }: PageClientProps) {
    const sortedOverview = useMemo(() => {
        if (typeof overview === 'string') {
            return overview
        }

        const visibleClusters = overview.clusters
            .map((cluster) => {
                const databases = cluster.databases.filter((database) =>
                    !(
                        database.name === 'postgres'
                        && database.sizeBytes < 10 * 1024 * 1024
                        && database.tableCount === 0
                    )
                )

                return {
                    ...cluster,
                    databases,
                    databaseCount: databases.length,
                    totalSizeBytes: databases.reduce((sum, database) => sum + database.sizeBytes, 0),
                }
            })
            .filter((cluster) => cluster.error || cluster.databases.length > 0)
            .sort((a, b) => b.totalSizeBytes - a.totalSizeBytes)

        return {
            ...overview,
            clusters: visibleClusters,
            databaseCount: visibleClusters.reduce((sum, cluster) => sum + cluster.databaseCount, 0),
            totalSizeBytes: visibleClusters.reduce((sum, cluster) => sum + cluster.totalSizeBytes, 0),
            activeQueries: visibleClusters.reduce((sum, cluster) => sum + cluster.activeQueries, 0),
        }
    }, [overview])

    if (typeof sortedOverview === 'string') {
        return (
            <div className='flex h-full items-center justify-center'>
                <div className='max-w-xl rounded-3xl border border-red-500/18 bg-red-500/9 p-5 text-sm text-red-200'>
                    {sortedOverview}
                </div>
            </div>
        )
    }

    return (
        <div className='h-full overflow-y-auto'>
            <div className='flex w-full flex-col gap-6 pb-4'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-xl font-semibold'>Database Overview</h1>
                    <div className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>
                        Snapshot taken {formatTimestamp(sortedOverview.generatedAt)}
                    </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                    <SummaryCard
                        icon={<Server className='h-4 w-4 text-cyan-400' />}
                        label='Database clusters'
                        value={String(sortedOverview.clusterCount)}
                        tone='bg-cyan-500/10'
                    />
                    <SummaryCard
                        icon={<Database className='h-4 w-4 text-emerald-400' />}
                        label='Databases discovered'
                        value={String(sortedOverview.databaseCount)}
                        tone='bg-emerald-500/10'
                    />
                    <SummaryCard
                        icon={<HardDrive className='h-4 w-4 text-orange-400' />}
                        label='Total storage footprint'
                        value={formatBytes(sortedOverview.totalSizeBytes)}
                        tone='bg-orange-500/10'
                    />
                    <SummaryCard
                        icon={<Activity className='h-4 w-4 text-violet-400' />}
                        label='Active queries'
                        value={String(sortedOverview.activeQueries)}
                        tone='bg-violet-500/10'
                    />
                </div>

                <div className='grid gap-4 xl:grid-cols-[1.2fr_0.8fr]'>
                    <div className='rounded-3xl border border-white/5 bg-login-50/5 p-5'>
                        <div className='mb-4 flex items-center gap-2'>
                            <TimerReset className='h-4 w-4 text-cyan-400' />
                            <h2 className='text-sm font-semibold text-white'>Average active query runtime</h2>
                        </div>
                        <QueryWindowGrid averageQuerySeconds={sortedOverview.averageQuerySeconds} />
                    </div>
                    <div className='rounded-3xl border border-white/5 bg-login-50/5 p-5'>
                        <div className='mb-4 flex items-center gap-2'>
                            <Layers3 className='h-4 w-4 text-orange-400' />
                            <h2 className='text-sm font-semibold text-white'>Longest running query overall</h2>
                        </div>
                        <QueryCard query={sortedOverview.longestQuery} />
                    </div>
                </div>

                <div className='flex flex-col gap-4'>
                    {sortedOverview.clusters.map((cluster) => (
                        <ClusterCard key={cluster.id} cluster={cluster} />
                    ))}
                </div>
            </div>
        </div>
    )
}
