import type { VulnerabilityScanner } from '@utils/api/internal/vulnerabilities/get'

export const scannerLabel: Record<VulnerabilityScanner, string> = {
    docker_scout: 'Docker Scout',
    trivy: 'Trivy',
}

export const scannerBadgeClass: Record<VulnerabilityScanner, string> = {
    docker_scout: 'border-sky-400/25 bg-sky-400/10 text-sky-200',
    trivy: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
}
