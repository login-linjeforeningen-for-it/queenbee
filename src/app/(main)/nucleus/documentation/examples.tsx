const examples = [
    {
        text: 'Varsling med tittel “Overskrift” og innhold “Innholdet i varslingen” til TekKom på norsk:',
        description: '/notify title:Overskrift description:Innholdet i varslingen topic:nTEKKOM'
    },
    {
        text: 'Varsling med tittel “Title” og innhold “Notification content” til TekKom på engelsk:',
        description: '/notify title:Title description:Notification content topic:eTEKKOM'
    },
    {
        text: `Varsling med tittel “Title of event to go to social topic”
            og innhold “Notification content” til sosialt på engelsk:`,
        description: `/notify title:Title of event to go to social topic
            description:Notification content topic:eSOCIAL`
    },
    {
        text: `Varsling med tittel “Overskrift” og innhold “Innholdet i
            varslingen” til alle som ønsker varslinger for event 19 i tillegg til å bli redirecta til eventet:`,
        description: '/notify title:Overskrift description:Innholdet i varslingen topic:n19 screen:19'
    },
    {
        text: `Varsling med tittel “Overskrift” og innhold “Innholdet i
            varslingen” til alle som ønsker varslinger for jobbannonse 2:`,
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
            <h3 className='mt-8 mb-2 text-lg font-semibold'>Eksempler</h3>
            <ul className='space-y-4 list-none pl-0'>
                <li className='bg-login-800/60 rounded-lg p-4'>
                    <span className='font-medium'>
                        {examples[0].text}
                    </span>
                    <br />
                    <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>
                        {examples[0].description}
                    </code>
                </li>
                <li className='bg-login-800/60 rounded-lg p-4'>
                    <span className='font-medium'>
                        {examples[1].text}
                    </span>
                    <br />
                    <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>
                        {examples[1].description}
                    </code>
                </li>
                <li className='bg-login-800/60 rounded-lg p-4'>
                    <span className='font-medium'>
                        {examples[2].text}
                    </span>
                    <br />
                    <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>
                        {examples[2].description}
                    </code>
                </li>
                <li className='bg-login-800/60 rounded-lg p-4'>
                    <span className='font-medium'>
                        {examples[3].text}
                    </span>
                    <br />
                    <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>
                        {examples[3].description}
                    </code>
                </li>
                <li className='bg-login-800/60 rounded-lg p-4'>
                    <span className='font-medium'>{examples[4].text}</span>
                    <br />
                    <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>
                        {examples[4].description}
                    </code>
                </li>
                <li className='bg-login-800/60 rounded-lg p-4'>
                    <span className='font-medium'>{examples[5].text}</span>
                    <br />
                    <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>
                        {examples[5].description}
                    </code>
                </li>
                <li className='bg-login-800/60 rounded-lg p-4'>
                    <span className='font-medium'>{examples[6].text}</span>
                    <br />
                    <code className='block bg-login-900 px-2 py-1 rounded mt-1 text-sm font-mono'>
                        {examples[6].description}
                    </code>
                </li>
            </ul>
        </>
    )
}
