import data from './exampleData'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function page({ data: _ }: { data: DockerContainer }) {
    return (
        <div>
            <h1>Container {data.container.name} ({data.container.id})</h1>
            <div className='grid p-2 w-full'>
                <h1 className='text-sm font-semibold'>Raw Output</h1>
                <h1 className='whitespace-pre'>{JSON.stringify(data, null, 4)}</h1>
            </div>
        </div>
    )
}
