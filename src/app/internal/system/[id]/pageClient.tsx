export default function page({ container }: { container: DockerContainer }) {
    return (
        <div>
            <h1>Container {container.container.id}</h1>
            <div className='grid p-2 w-full'>
                <h1>{JSON.stringify(container, null, 4)}</h1>
            </div>
        </div>
    )
}
