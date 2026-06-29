'use client'

import { useMemo } from 'react'
import { Activity, Database, HardDrive, Server } from 'lucide-react'
import { StatCard } from 'uibee/components'
import formatBytes from '@utils/db/formatBytes'
import formatTimestamp from '@utils/db/formatTimestamp'
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
                <div className='max-w-xl rounded-2xl border border-red-500/20 bg-red-500/8 p-5 text-sm text-red-300'>
                    {sortedOverview}
                </div>
            </div>
        )
    }

    return (
        <div className='h-full overflow-y-auto'>
            <div className='flex flex-col gap-5 pb-4'>
                <div className='flex items-center justify-between gap-4'>
                    <h1 className='font-semibold text-lg'>Databases</h1>
                    <span className='text-xs text-login-300'>{formatTimestamp(sortedOverview.generatedAt)}</span>
                </div>

                <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
                    <StatCard icon={Server} label='Clusters' value={String(sortedOverview.clusterCount)} tone='blue' />
                    <StatCard icon={Database} label='Databases' value={String(sortedOverview.databaseCount)} tone='emerald' />
                    <StatCard icon={HardDrive} label='Storage' value={formatBytes(sortedOverview.totalSizeBytes)} tone='orange' />
                    <StatCard icon={Activity} label='Active queries' value={String(sortedOverview.activeQueries)} tone='violet' />
                </div>

                <div className='flex flex-col gap-2'>
                    {sortedOverview.clusters.map((cluster) => (
                        <ClusterCard key={cluster.id} cluster={cluster} />
                    ))}
                </div>
            </div>
        </div>
    )
}
