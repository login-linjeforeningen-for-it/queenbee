'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Examples from './examples'

const text = {
    title: 'Varslinger (Push Notifications)',
    descriptionBefore: 'Varslinger er en viktig funksjon i appen, men må brukes ' +
        'med måte for å ha ønsket hensikt. Varslinger skal brukes like ' +
        'forsiktig som ',
    descriptionAfter: ' i Discord, da vi kun trenger en feil før ' +
        'funksjonen blir slår av. Tenk alltid gjennom om en varsling ' +
        'virkelig er nødvendig.',
    intervals: '10m, 30m, 1h, 2h, 3h, 6h, 1d, 2d, 1w',
}

export default function Page() {
    const router = useRouter()
    return (
        <div
            className='h-(--h-pageInfo) w-full flex flex-col items-center'>
            <div className='w-full px-16 py-4'>
                <div className='flex flex-col gap-4'>
                    <button
                        type='button'
                        aria-label='Go back'
                        onClick={() => router.back()}
                        className='inline-flex items-center gap-2 cursor-pointer hover:text-login'>
                        <ArrowLeft className='size-4.5' />
                        <span>Back</span>
                    </button>
                    <h1 className='font-semibold text-2xl capitalize pb-6'>
                        Documentation
                    </h1>
                </div>
                <article className='max-w-none bg-login-600 rounded-xl p-6 md:p-10 transition-all'>
                    <h2 className='text-primary font-extrabold mt-0'>{text.title}</h2>
                    <p className='leading-relaxed'>
                        {text.descriptionBefore}
                        <code className='bg-login-800 px-1 py-0.5 rounded text-sm'>@everyone</code>
                        {text.descriptionAfter}
                    </p>
                    <h3 className='mt-8 mb-2 text-lg font-semibold'>Topics</h3>
                    <ul className='grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 list-disc pl-5'>
                        <li>TEKKOM</li>
                        <li>SOCIAL</li>
                        <li>CTF</li>
                        <li>KARRIEREDAG</li>
                        <li>FADDERUKA</li>
                        <li>BEDPRES</li>
                        <li>LOGIN</li>
                        <li>ANNET</li>
                    </ul>
                    <h3 className='mt-8 mb-2 text-lg font-semibold'>Intervaller</h3>
                    <p className='mb-4'>
                        <span className='inline-block bg-login-800 px-2 py-1 rounded text-sm font-mono'>
                            {text.intervals}
                        </span>
                    </p>
                    <h3 className='mt-8 mb-2 text-lg font-semibold'>Språk (prefix)</h3>
                    <p className='mb-4'>
                        <code className='bg-login-800 px-1 py-0.5 rounded text-sm'>
                            n
                        </code> (norsk),
                        <code className='bg-login-800 px-1 py-0.5 rounded text-sm'>
                            e
                        </code>
                        (engelsk)
                    </p>
                    <h3 className='mt-8 mb-2 text-lg font-semibold'>Ads (prefix etter språk)</h3>
                    <p className='mb-4'><code className='bg-login-800 px-1 py-0.5 rounded text-sm'>a</code></p>
                    <Examples />
                </article>
            </div>
        </div>
    )
}
