import getVulnerabilities from '@utils/api/internal/vulnerabilities/get'
import { refreshVulnerabilityData, runVulnerabilityScanAction } from './actions'
import PageClient from './pageClient'

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''
    const query = search.toLowerCase()
    const data = await getVulnerabilities()

    return (
        <PageClient
            initialData={data}
            initialQuery={query}
            refreshAction={refreshVulnerabilityData}
            runScanAction={runVulnerabilityScanAction}
        />
    )
}
