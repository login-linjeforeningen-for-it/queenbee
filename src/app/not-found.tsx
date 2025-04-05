import Image from 'next/image'

export default function page(){
    return(
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <Image
                src='/images/notFound.gif'
                width={500}
                height={500}
                alt="Picture of the author"
            />
            <p className='p-[2rem]'>Denne siden finnes ikke. Dette blir ikke fikset før TekKom har fått mer pizza...</p>
        </div>
    )
}