'use server'

import { getWrapper } from '@utils/apiWrapper'

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'unknown'

export type SeverityCount = Record<SeverityLevel, number>

export type VulnerabilityGroup = {
    source: string
    total: number
    severity: SeverityCount
}

export type VulnerabilityDetail = {
    id: string
    title: string
    severity: SeverityLevel
    source: string
    packageName: string | null
    packageType: string | null
    installedVersion: string | null
    fixedVersion: string | null
    description: string | null
    references: string[]
}

export type ImageVulnerabilityReport = {
    image: string
    scannedAt: string
    totalVulnerabilities: number
    severity: SeverityCount
    groups: VulnerabilityGroup[]
    vulnerabilities: VulnerabilityDetail[]
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
    totalImages: number | null
    completedImages: number
    currentImage: string | null
    estimatedCompletionAt: string | null
}

export type GetVulnerabilities = VulnerabilityReportFile & {
    scanStatus: DockerScoutScanStatus
}

export default async function getVulnerabilities(): Promise<GetVulnerabilities | string> {
    return await getWrapper({
        path: 'vulnerabilities',
        service: 'beekeeper',
        options: {
            cache: 'no-store',
        }
    })
}
