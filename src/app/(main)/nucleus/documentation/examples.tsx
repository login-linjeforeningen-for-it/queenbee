import { Code } from 'uibee/components'

const examples = [
    {
        text: 'Varsling med tittel "Overskrift" og innhold "Innholdet i varslingen" til TekKom på norsk:',
        description: '/notify title:Overskrift description:Innholdet i varslingen topic:nTEKKOM'
    },
    {
        text: 'Varsling med tittel "Title" og innhold "Notification content" til TekKom på engelsk:',
        description: '/notify title:Title description:Notification content topic:eTEKKOM'
    },
    {
        text: 'Varsling med tittel "Title of event to go to social topic" og innhold "Notification content" til sosialt på engelsk:',
        description: '/notify title:Title of event to go to social topic description:Notification content topic:eSOCIAL'
    },
    {
        text: 'Varsling med tittel "Overskrift" og innhold "Innholdet i varslingen" til alle som ønsker'
            + ' varslinger for event 19 i tillegg til å bli redirecta til eventet:',
        description: '/notify title:Overskrift description:Innholdet i varslingen '
            + 'topic:n19 screen:19'
    },
    {
        text: 'Varsling med tittel "Overskrift" og innhold "Innholdet i varslingen" til alle som ønsker varslinger for jobbannonse 2:',
        description: '/notify title:Overskrift description:Innholdet i varslingen topic:ea2'
    },
    {
        text: 'Eksempel for kategorier kun til de som ønsker varsling mindre enn 10 min før start:',
        description: '/notify title:Overskrift description:Innholdet i varslingen topic:ntekkom10m'
    },
    {
        text: 'Event hvor man kun ønsker varslinger mellom 3-7 dager før arrangementet starter:',
        description: '/notify title:Overskrift description:Innholdet i varslingen topic:n191w screen:19'
    },
]

export default function Examples() {
    return (
        <>
            <h3 className='mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-login-300'>Eksempler</h3>
            <ul className='space-y-2 list-none pl-0'>
                {examples.map((example, i) => (
                    <li key={i} className='rounded-xl border border-white/5 bg-login-50/5 p-3'>
                        <p className='text-sm text-login-50'>{example.text}</p>
                        <Code className='mt-2 block rounded-lg px-3 py-2'>
                            {example.description}
                        </Code>
                    </li>
                ))}
            </ul>
        </>
    )
}
