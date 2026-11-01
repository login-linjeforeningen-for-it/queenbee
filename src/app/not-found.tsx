import Image from 'next/image'
import { Button } from 'uibee/components'

export default function page() {
    return (
        <div className='w-full h-full flex flex-col items-center justify-center gap-6'>
            <Image
                src='/images/notFound.gif'
                width={500}
                height={282}
                alt='Not found - Breaking Bad Gif'
                className='max-w-full h-auto'
            />
            <h1 className='text-center'>
                This site does not exist. This will not be fixed until TekKom
                gets more pizza…
            </h1>
            <Button text='Back to dashboard' path='/dashboard' />
        </div>
    )
}
