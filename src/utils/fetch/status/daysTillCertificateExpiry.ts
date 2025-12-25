export default function daysTillCertificateExpiry(certificate: { validTo: string }): number {
    const validTo = new Date(certificate.validTo)
    const now = new Date()
    const diffMs = validTo.getTime() - now.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    return diffDays
}
