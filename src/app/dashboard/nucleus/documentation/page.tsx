'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter()
    return (
        <div
            className='h-[var(--h-pageInfo)] w-full flex flex-col items-center'>
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
                    <h2 className='text-primary font-extrabold mt-0'>Varslinger (Push Notifications)</h2>
                    <p className='leading-relaxed'>
                        Varslinger er en viktig funksjon i appen, men må brukes med måte for å ha ønsket hensikt. Varslinger skal brukes mer forsiktig enn <code className='bg-login-800 px-1 py-0.5 rounded text-sm'>@everyone</code> i Discord, da vi kun trenger en feil før folk slår av funksjonen. Tenk alltid gjennom om en varsling virkelig er nødvendig.
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
                    <p className='mb-4'><span className='inline-block bg-login-800 px-2 py-1 rounded text-sm font-mono'>10m, 30m, 1h, 2h, 3h, 6h, 1d, 2d, 1w</span></p>
                    <h3 className='mt-8 mb-2 text-lg font-semibold'>Språk (prefix)</h3>
                    <p className='mb-4'><code className='bg-login-800 px-1 py-0.5 rounded text-sm'>n</code> (norsk), <code className='bg-login-800 px-1 py-0.5 rounded text-sm'>e</code> (engelsk)</p>
                    <h3 className='mt-8 mb-2 text-lg font-semibold'>Ads (prefix etter språk)</h3>
                    <p className='mb-4'><code className='bg-login-800 px-1 py-0.5 rounded text-sm'>a</code></p>
                    <h3 className='mt-8 mb-2 text-lg font-semibold'>Eksempler</h3>
                    <ul className='space-y-4 list-none pl-0'>
                        <li className='bg-login-800/60 rounded-lg p-4'>
                            <span className='font-medium'>Varsling med tittel “Overskrift” og innhold “Innholdet i varslingen” til TekKom på norsk:</span><br />
                            <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>/notify title:Overskrift description:Innholdet i varslingen topic:nTEKKOM</code>
                        </li>
                        <li className='bg-login-800/60 rounded-lg p-4'>
                            <span className='font-medium'>Varsling med tittel “Title” og innhold “Notification content” til TekKom på engelsk:</span><br />
                            <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>/notify title:Title description:Notification content topic:eTEKKOM</code>
                        </li>
                        <li className='bg-login-800/60 rounded-lg p-4'>
                            <span className='font-medium'>Varsling med tittel “Title of event to go to social topic” og innhold “Notification content” til sosialt på engelsk:</span><br />
                            <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>/notify title:Title of event to go to social topic description:Notification content topic:eSOCIAL</code>
                        </li>
                        <li className='bg-login-800/60 rounded-lg p-4'>
                            <span className='font-medium'>Varsling med tittel “Overskrift” og innhold “Innholdet i varslingen” til alle som ønsker varslinger for event 19 i tillegg til å bli redirecta til eventet:</span><br />
                            <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>/notify title:Overskrift description:Innholdet i varslingen topic:n19 screen:19</code>
                        </li>
                        <li className='bg-login-800/60 rounded-lg p-4'>
                            <span className='font-medium'>Varsling med tittel “Overskrift” og innhold “Innholdet i varslingen” til alle som ønsker varslinger for jobbannonse 2:</span><br />
                            <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>/notify title:Overskrift description:Innholdet i varslingen topic:ea2</code>
                        </li>
                        <li className='bg-login-800/60 rounded-lg p-4'>
                            <span className='font-medium'>Eksempel for kategorier kun til de som ønsker varsling mindre enn 10 min før start:</span><br />
                            <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>/notify title:Overskrift description:Innholdet i varslingen topic:ntekkom10m</code>
                        </li>
                        <li className='bg-login-800/60 rounded-lg p-4'>
                            <span className='font-medium'>Event hvor man kun ønsker varslinger mellom 3-7 dager før arrangementet starter:</span><br />
                            <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>/notify title:Overskrift description:Innholdet i varslingen topic:n191w screen:19</code>
                        </li>
                    </ul>
                </article>
            </div>
        </div>
    )
}
