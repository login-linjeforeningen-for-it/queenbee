'use server'

import getVulnerabilities from '@utils/api/internal/vulnerabilities/get'
import triggerVulnerabilityScan from '@utils/api/internal/vulnerabilities/post'

export async function refreshVulnerabilityData() {
    return await getVulnerabilities()
}

export async function runVulnerabilityScanAction() {
    return await triggerVulnerabilityScan()
}
