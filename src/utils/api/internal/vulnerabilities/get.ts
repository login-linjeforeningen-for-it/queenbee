'use server'

import { getWrapper } from '@utils/apiWrapper'

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'unknown'

export type SeverityCount = Record<SeverityLevel, number>

export type VulnerabilityGroup = {
    source: string
    total: number
    severity: SeverityCount
}

export type ImageVulnerabilityReport = {
    image: string
    scannedAt: string
    totalVulnerabilities: number
    severity: SeverityCount
    groups: VulnerabilityGroup[]
    scanError: string | null
}

export type VulnerabilityReportFile = {
    generatedAt: string | null
    imageCount: number
    images: ImageVulnerabilityReport[]
}

export type DockerScoutScanStatus = {
    isRunning: boolean
    startedAt: string | null
    finishedAt: string | null
    lastSuccessAt: string | null
    lastError: string | null
}

export type GetVulnerabilities = VulnerabilityReportFile & {
    scanStatus: DockerScoutScanStatus
}

export default async function getVulnerabilities(): Promise<GetVulnerabilities> {
    return await getWrapper({
        path: 'vulnerabilities',
        service: 'internal'
    })
}
