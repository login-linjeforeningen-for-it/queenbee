import DateInput from '@components/inputs/date'
import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import Select from '@components/inputs/select'
import Switch from '@components/inputs/switch'
import TimeInput from '@components/inputs/time'
import { getAudiences, getCategories, getEventBannerImages, getEventSmallImages, getJobImages, getLocations, getOrganizationImages, getOrganizations, getRules } from '@utils/api'

export async function EventFormInputs() {
    const bannerImagesResponse = await getEventBannerImages()
    const bannerImages = Array.isArray(bannerImagesResponse)
        ? bannerImagesResponse.map((image) => ({
            label: image.name,
            value: `${image.filepath}${image.name}`,
            image: `${image.filepath}${image.name}`,
        }))
        : []

    const smallImagesResponse = await getEventSmallImages()
    const smallImages = Array.isArray(smallImagesResponse)
        ? smallImagesResponse.map((image) => ({
            label: image.name,
            value: `${image.filepath}${image.name}`,
            image: `${image.filepath}${image.name}`,
        }))
        : []

    const categoriesResponse = await getCategories()
    const categories = Array.isArray(categoriesResponse)
        ? categoriesResponse.map((category) => ({
            label: category.name_en,
            value: category.id,
        }))
        : []

    const organizationsResponse = await getOrganizations()
    const organizations = Array.isArray(organizationsResponse)
        ? organizationsResponse.map((organization) => ({
            label: organization.name_en,
            value: organization.shortname,
        }))
        : []

    const rulesResponse = await getRules()
    const rules = Array.isArray(rulesResponse)
        ? rulesResponse.map((rule) => ({
            label: rule.name_en,
            value: rule.id,
        }))
        : []

    const locationsResponse = await getLocations()
    const locations = Array.isArray(locationsResponse)
        ? locationsResponse.map((location) => ({
            label: location.name_en,
            value: location.id,
        }))
        : []

    const audiencesResponse = await getAudiences()
    const audiences = Array.isArray(audiencesResponse)
        ? audiencesResponse.map((audience) => ({
            label: audience.name_en,
            value: audience.id,
        }))
        : []

    const timeTypes: { label: string; value: time_type }[] = [
        { label: 'Default', value: 'default' },
        { label: 'No end', value: 'no_end' },
        { label: 'Whole day', value: 'whole_day' },
        { label: 'To Be Determined', value: 'tbd' },
    ]

    return (
        <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                <div className='grid grid-cols-2 gap-x-8 gap-y-4 justify-between w-full'>
                    <Input name='titleNor' type='text' label='Title (Norwegian)' required />
                    <Input name='titleEng' type='text' label='Title (English)' required />
                    <Input name='informationalNor' type='text' label='Informational (Norwegian)' />
                    <Input name='informationalEng' type='text' label='Informational (English)' />
                    <Markdown name='descriptionNor' label='Description (Norwegian)' required />
                    <Markdown name='descriptionEng' label='Description (English)' required />
                </div>
            </div>
            <div className='flex flex-row gap-8'>
                <div className='flex flex-col gap-4 w-full'>
                    <Select name='category' label='Category' options={categories} required />
                    <Select name='organization' label='Organization' options={organizations} />
                    <Select name='rule' label='Rule' options={rules} />
                    <Select name='location' label='Location' options={locations} />
                    <Select name='audiences' label='Audiences' options={audiences} />
                </div>
                <div className='flex flex-col gap-4 w-full'>
                    <Select name='timeType' label='Time Type' options={timeTypes} required />
                    {/* Date and time inputs based on different timeType */}
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
                <Select name='bannerImage' label='Banner Image' options={bannerImages} />
                <Select name='smallImage' label='Small Image' options={smallImages} />
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

export async function JobFormInputs() {
    const organizationsResponse = await getOrganizations()
    const organizations = Array.isArray(organizationsResponse)
        ? organizationsResponse.map((organization) => ({
            label: organization.name_en,
            value: organization.shortname,
        }))
        : []

    const applicationTypes: { label: string; value: job_type }[] = [
        { label: 'Full-time', value: 'full' },
        { label: 'Part-time', value: 'part' },
        { label: 'Summer', value: 'summer' },
        { label: 'Verv', value: 'verv' },
    ]

    const jobImagesResponse = await getJobImages()
    const jobImages = Array.isArray(jobImagesResponse)
        ? jobImagesResponse.map((image) => ({
            label: image.name,
            value: `${image.filepath}${image.name}`,
            image: `${image.filepath}${image.name}`,
        }))
        : []

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
                    <Markdown name='descriptionNor' label='Description (Norwegian)' required />
                    <Markdown name='descriptionEng' label='Description (English)' required />
                </div>
                <div className='grid grid-cols-2 gap-x-8 gap-y-4 justify-between w-full'>
                    <Select name='organization' label='Organization' options={organizations} required />
                    <Input name='cities' type='text' label='Cities' />
                    <Select name='applicationType' label='Application Type' options={applicationTypes} required />
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
                <Select name='bannerImage' label='Banner Image' options={jobImages} required />
            </div>
        </div>
    )
}

export async function OrganizationFormInputs() {
    const imagesResponse = await getOrganizationImages()
    const images = Array.isArray(imagesResponse)
        ? imagesResponse.map((image) => ({
            label: image.name,
            value: `${image.filepath}${image.name}`,
            image: `${image.filepath}${image.name}`,
        }))
        : []

    return (
        <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                <Input name='shortName' type='text' label='Short Name' required />
                <div className='grid grid-cols-2 gap-y-4 gap-x-8  w-full'>
                    <Input name='nameNor' type='text' label='Name (Norwegian)' required />
                    <Input name='nameEng' type='text' label='Name (English)' required />
                    <Markdown name='descriptionNor' label='Description (Norwegian)' required />
                    <Markdown name='descriptionEng' label='Description (English)' required />
                </div>
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
                <Select name='logo' label='Organization Logo' options={images} required />
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
                <Markdown name='descriptionNor' label='Description (Norwegian)' required />
                <Markdown name='descriptionEng' label='Description (English)' required />
            </div>
        </div>
    )
}