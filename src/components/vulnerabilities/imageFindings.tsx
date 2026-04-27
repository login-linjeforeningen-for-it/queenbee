'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ImageVulnerabilityReport } from '@utils/api/internal/vulnerabilities/get'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from 'uibee/components'
import VulnerabilityCard from './vulnerabilityCard'

const PAGE_SIZE = 3

export default function ImageFindings({ image }: { image: ImageVulnerabilityReport }) {
    const [page, setPage] = useState(1)
    const detailNotes = image.scannerResults.filter((result) => result.summaryOnly && result.note)
    const totalPages = Math.max(1, Math.ceil(image.vulnerabilities.length / PAGE_SIZE))
    const visibleFindings = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE
        return image.vulnerabilities.slice(startIndex, startIndex + PAGE_SIZE)
    }, [image.vulnerabilities, page])

    useEffect(() => {
        setPage(1)
    }, [image.image])

    return (
        <div className='flex flex-col h-80'>
            <div className='flex items-center justify-between gap-3 mb-2'>
                <h3 className='text-xs font-semibold uppercase tracking-[0.15em] text-login-200'>
                    Vulnerability Details
                </h3>
                <span className='text-xs font-medium text-login-100'>
                    {image.vulnerabilities.length} findings
                </span>
            </div>

            <div className='flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1 custom-scrollbar'>
                {detailNotes.length ? (
                    <div className='rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-xs text-login-100/60'>
                        {detailNotes.map((result) => result.note).join(' ')}
                    </div>
                ) : null}
                {visibleFindings.length ? visibleFindings.map((vulnerability) => (
                    <VulnerabilityCard
                        key={`${image.image}-${vulnerability.id}-${vulnerability.packageName || 'pkg'}`}
                        vulnerability={vulnerability}
                    />
                )) : (
                    <div className='text-sm text-login-100 py-2'>
                        No per-vulnerability details are stored for this image yet. Run a new scan to populate them.
                    </div>
                )}
            </div>

            {image.vulnerabilities.length > PAGE_SIZE && (
                <div className='mt-4 pt-4 border-t border-login-100/10'>
                    <FindingPagination
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                        totalResults={image.vulnerabilities.length}
                    />
                </div>
            )}
        </div>
    )
}

function FindingPagination({
    page,
    setPage,
    totalPages,
    totalResults,
}: {
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    totalPages: number
    totalResults: number
}) {
    return (
        <div className='flex items-center justify-between gap-6 pt-2'>
            <div className='text-sm text-login-200'>
                Page{' '}
                <span className='font-semibold text-login-50 h-5 inline-flex items-center px-1.5 bg-login-50/5 rounded mx-0.5'>
                    {page}
                </span>
                <span className='mx-1 opacity-50'>of</span>
                <span className='font-semibold text-login-50'>{totalPages}</span>
                <span className='mx-3 opacity-30'>•</span>
                <span className='font-medium'>{totalResults} total findings</span>
            </div>
            <div className='flex items-center gap-2'>
                <Button
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    variant='secondary'
                    text='Previous'
                    icon={<ChevronLeft className='h-4 w-4' />}
                />
                <Button
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page === totalPages}
                    variant='secondary'
                    text='Next'
                    icon={<ChevronRight className='h-4 w-4' />}
                />
            </div>
        </div>
    )
}
