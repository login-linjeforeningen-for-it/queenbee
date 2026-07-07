import BackButton from '@components/navigation/back'
import { Code } from 'uibee/components'
import Examples from './examples'

const text = {
    title: 'Varslinger (Push Notifications)',
    descriptionBefore: `Varslinger er en viktig funksjon i appen, men må brukes
        med måte for å ha ønsket hensikt. Varslinger skal brukes like
        forsiktig som `,
    descriptionAfter: ` i Discord, da vi kun trenger en feil før
        funksjonen blir slår av. Tenk alltid gjennom om en varsling
        virkelig er nødvendig.`,
    intervals: '10m, 30m, 1h, 2h, 3h, 6h, 1d, 2d, 1w',
}

export default function Page() {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-3'>
                <BackButton pushURL='/nucleus' />
                <h1 className='font-semibold text-lg text-login-50'>Documentation</h1>
            </div>
            <div className='max-w-2xl rounded-2xl border border-white/5 bg-login-50/5 p-6'>
                <h2 className='mb-3 font-semibold text-login-50'>{text.title}</h2>
                <p className='text-sm leading-relaxed text-login-50'>
                    {text.descriptionBefore}
                    <Code>@everyone</Code>
                    {text.descriptionAfter}
                </p>

                <h3 className='mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-login-300'>Topics</h3>
                <ul className='grid list-disc grid-cols-2 gap-x-6 gap-y-1 pl-5 text-sm text-login-50 sm:grid-cols-4'>
                    <li>TEKKOM</li>
                    <li>SOCIAL</li>
                    <li>CTF</li>
                    <li>KARRIEREDAG</li>
                    <li>FADDERUKA</li>
                    <li>BEDPRES</li>
                    <li>LOGIN</li>
                    <li>ANNET</li>
                </ul>

                <h3 className='mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-login-300'>Intervaller</h3>
                <Code className='inline-block'>{text.intervals}</Code>

                <h3 className='mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-login-300'>Språk (prefix)</h3>
                <p className='text-sm text-login-50'>
                    <Code>n</Code> norsk &nbsp;
                    <Code>e</Code> engelsk
                </p>

                <h3 className='mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-login-300'>Ads (prefix etter språk)</h3>
                <Code>a</Code>

                <Examples />
            </div>
        </div>
    )
}
