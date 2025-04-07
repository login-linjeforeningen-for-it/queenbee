import Alert from '@components/alert/alert'
import { getRules } from '@utils/api'

export default async function page() {
    const list = await getRules()

    if(typeof list === 'string') return (
        <div className='w-full h-full flex items-center justify-center'>
            <Alert>
                Error loading events
            </Alert>
        </div>
    )

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <Alert>
                Not set up yet...
            </Alert>
        </div>
    )

    // const [filterText, setFilterText] = useState('')
    // return (
    //     <div className='h-[var(--h-pageInfo)]'>
    //         <h1 className="font-semibold text-lg">Rules</h1>
    //         <div className='flex justify-between pb-4'>
    //             <Filter text={filterText} setText={setFilterText} />
    //             <Button text="New rule" icon='+' path='rules/0' />
    //         </div>
    //         <form>
    //             <TextArea width={"50%"} height={"50%"} placeholder="hello" required={true} />
    //             <TextInput width={"50%"} placeholder="hello" required={true} />
    //             <input type="submit"/>
    //         </form>
    //     </div>
    // )
}
