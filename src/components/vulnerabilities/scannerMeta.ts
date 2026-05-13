import type { VulnerabilityScanner } from '@utils/api/internal/vulnerabilities/get'

export const scannerLabel: Record<VulnerabilityScanner, string> = {
    docker_scout: 'docker scout',
}

export const scannerBadgeClass: Record<VulnerabilityScanner, string> = {
    docker_scout: 'border-sky-400/25 bg-sky-400/10 text-sky-200',
}
