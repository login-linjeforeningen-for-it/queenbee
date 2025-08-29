import Alert from '@components/alert/alert'

export default function page() {
    return (
        <div className='h-full overflow-hidden'>
            <div className='h-[var(--h-pageInfo)]'>
                <h1 className='font-semibold text-lg'>Beehive</h1>
            </div>
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    Denne funksjonaliteten mangler ett nytt API som er integrert
                    med både Beehive, Queenbee og Nucleus.
                </Alert>
            </div>
        </div>
    )
}
