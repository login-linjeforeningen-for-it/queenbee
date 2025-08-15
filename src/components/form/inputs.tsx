import DateInput from '@components/inputs/date'
import Input from '@components/inputs/input'
import Select from '@components/inputs/select'
import Switch from '@components/inputs/switch'
import TimeInput from '@components/inputs/time'

export function EventFormInputs() {
    return (
        <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                <div className='grid grid-cols-2 gap-x-8 gap-y-4 justify-between w-full'>
                    <Input name='titleNor' type='text' label='Title (Norwegian)' required />
                    <Input name='titleEng' type='text' label='Title (English)' required />
                    <Input name='informationalNor' type='text' label='Informational (Norwegian)' />
                    <Input name='informationalEng' type='text' label='Informational (English)' />
                    {/* Markdown description */}
                </div>
            </div>
            <div className='flex flex-row gap-8'>
                <div className='flex flex-col gap-4 w-full'>
                    <Select name='category' label='Category' options={[]} required />
                    <Select name='organization' label='Organization' options={[]} />
                    <Select name='rule' label='Rule' options={[]} />
                    <Select name='location' label='Location' options={[]} />
                    <Select name='audiences' label='Audiences' options={[]} />
                </div>
                <div className='flex flex-col gap-4 w-full'>
                    <Select name='timeType' label='Time Type' options={[]} required />
                    <div className='flex flex-row gap-4 w-full'>
                        <div className='flex flex-col gap-4 w-full'>
                            <DateInput name='startDate' label='Start Date' required />
                            <DateInput name='endDate' label='End Date' required />
                            <DateInput name='publishDate' label='Publish Date' required />
                        </div>
                        <div className='flex flex-col gap-4 w-full'>
                            <TimeInput name='startTime' label='Start Time' required />
                            <TimeInput name='endTime' label='End Time' required />
                            <TimeInput name='publishTime' label='Publish Time' required />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Signup</h1>
                <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
                    <Input name='signupLink' type='text' label='Signup Link' />
                    <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
                        <DateInput name='releaseDate' label='Release Date' />
                        <TimeInput name='releaseTime' label='Release Time' />
                    </div>
                    <Input name='capacity' type='number' label='Capacity' />
                    <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
                        <DateInput name='deadlineDate' label='Deadline Date' />
                        <TimeInput name='deadlineTime' label='Deadline Time' />
                    </div>
                    <Switch name='isFull' label='Is Full' />
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Image</h1>
                <Select name='bannerImage' label='Banner Image' options={[]} />
                <Select name='smallImage' label='Small Image' options={[]} />
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Social Links</h1>
                <Input name='facebookLink' type='text' label='Facebook Link' />
                <Input name='discordLink' type='text' label='Discord Link' />
                <Input name='streamLink' type='text' label='Stream Link' />
            </div>
        </div>
    )
}

export function JobFormInputs() {
    return (
        <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-8'>
                <div className='grid grid-cols-2 gap-x-8 gap-y-4 justify-between w-full'>
                    <Input name='titleNor' type='text' label='Title (Norwegian)' required />
                    <Input name='titleEng' type='text' label='Title (English)' required />
                    <Input name='positionNor' type='text' label='Position (Norwegian)' required />
                    <Input name='positionEng' type='text' label='Position (English)' required />
                    <Input name='shortDescriptionNor' type='text' label='Short Description (Norwegian)' required />
                    <Input name='shortDescriptionEng' type='text' label='Short Description (English)' required />
                    {/* Markdown description */}
                </div>
                <div className='grid grid-cols-2 gap-x-8 gap-y-4 justify-between w-full'>
                    <Select name='organization' label='Organization' options={[]} required />
                    <Input name='cities' type='text' label='Cities' />
                    <Select name='applicationType' label='Application Type' options={[]} required />
                    <Input name='skills' type='text' label='Skills' />
                    <div className='grid grid-cols-2 gap-x-4 gap-y-4 w-full'>
                        <DateInput name='publishDate' label='Release Date' />
                        <TimeInput name='releaseTime' label='Release Time' />
                    </div>
                    <Switch name='highlightAd' label='Highlight Ad' />
                    <div className='grid grid-cols-2 gap-x-4 gap-y-4 w-full'>
                        <DateInput name='deadlineDate' label='Deadline Date' />
                        <TimeInput name='deadlineTime' label='Deadline Time' />
                    </div>
                    
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Application</h1>
                <Input name='applicationLink' type='text' label='Application URL' required />
                <div className='flex flex-row gap-4'>
                    <DateInput name='deadlineDate' label='Deadline Date' required />
                    <TimeInput name='deadlineTime' label='Deadline Time' required />
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Image</h1>
                <Select name='bannerImage' label='Banner Image' options={[]} required />
            </div>
        </div>
    )
}

export function OrganizationFormInputs() {
    return (
        <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                <Input name='shortName' type='text' label='Short Name' required />
                <div className='flex flex-row gap-8 justify-between w-full'>
                    <Input name='nameNor' type='text' label='Name (Norwegian)' required />
                    <Input name='nameEng' type='text' label='Name (English)' required />
                </div>
                {/* Markdown description */}
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Social Links</h1>
                <Input name='linkHomepage' type='text' label='Homepage Link' required />
                <Input name='linkLinkedin' type='text' label='Linkedin Link' />
                <Input name='linkFacebook' type='text' label='Facebook Link' />
                <Input name='linkInstagram' type='text' label='Instagram Link' />
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl'>Logo</h1>
                <Select name='logo' label='Organization Logo' options={[]} required />
            </div>
        </div>
    )
}

export function LocationFormInputs() {
    return (
        <div className='flex flex-col gap-4'>
            <Input name='nameNor' type='text' label='Name (Norwegian)' required />
            <Input name='nameEng' type='text' label='Name (English)' required />
            <Input name='url' type='text' label='URL' />
            {/* Location Select with different options */}
        </div>
    )
}

export function RuleFormInputs() {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-row gap-8 justify-between w-full'>
                <Input name='nameNor' type='text' label='Name (Norwegian)' required />
                <Input name='nameEng' type='text' label='Name (English)' required />
            </div>
            <div className='flex flex-row gap-8 justify-between w-full'>
                {/* Markdown description */}
            </div>
        </div>
    )
}