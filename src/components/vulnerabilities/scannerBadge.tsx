import type { VulnerabilityScanner } from '@utils/api/internal/vulnerabilities/get'
import { scannerBadgeClass, scannerLabel } from './scannerMeta'

export default function ScannerBadge({
    scanner,
    only = false,
}: {
    scanner: VulnerabilityScanner
    only?: boolean
}) {
    return (
        <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]
                ${scannerBadgeClass[scanner]}`}
        >
            {scannerLabel[scanner]}{only ? ' Only' : ''}
        </span>
    )
}
