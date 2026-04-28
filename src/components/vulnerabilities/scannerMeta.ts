import type { VulnerabilityScanner } from '@utils/api/internal/vulnerabilities/get'

export const scannerLabel: Record<VulnerabilityScanner, string> = {
    docker_scout: 'docker scout',
    trivy: 'trivy',
    npm_audit: 'npm audit',
}

export const scannerBadgeClass: Record<VulnerabilityScanner, string> = {
    docker_scout: 'border-sky-400/25 bg-sky-400/10 text-sky-200',
    trivy: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
    npm_audit: 'border-amber-400/25 bg-amber-400/10 text-amber-200',
}
