declare global {
    type time_type = 'default' | 'no_end' | 'whole_day' | 'tbd'
    type location_type = 'mazemap' | 'coords' | 'address' | 'digital'
    type embed_type = 'on' | 'off'

    // Events
    type Event = {
        visible: boolean
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        informational_no: string | null
        informational_en: string | null
        time_type: time_type
        time_start: string
        time_end: string
        time_publish: string
        time_signup_release: string | null
        time_signup_deadline: string | null
        canceled: boolean
        digital: boolean
        highlight: boolean
        image_small: string | null
        image_banner: string | null
        link_facebook: string | null
        link_discord: string | null
        link_signup: string | null
        link_stream: string | null
        capacity: number | null
        is_full: boolean
    }

    type GetEventProps = Event & {
        id: number
        category: GetCategoryProps
        location: GetLocationProps | null
        parent_id: number | null
        rule: GetRuleProps | null
        audience: GetAudienceProps | null
        organization: GetOrganizationProps | null
        updated_at: string
        created_at: string
    }

    type GetEventsProps = {
        events: GetEventProps[]
        total_count: number
    }

    type GetAllEventsProps = {
        id: number
        name_en: string
        time_start: string
    }[]

    type PostEventProps = Event & {
        category_id: number
        location_id: number | null
        parent_id: number | null
        rule_id: number | null
        audience_id: number | null
        organization_id: number | null
    }

    type PutEventProps = PostEventProps

    // Jobs
    type Job = {
        visible: boolean
        highlight: boolean
        title_no: string
        title_en: string
        cities: string[] | null
        skills: string[] | null
        position_title_no: string
        position_title_en: string
        description_short_no: string
        description_short_en: string
        description_long_no: string
        description_long_en: string
        time_publish: string
        time_expire: string
        banner_image: string | null
        application_url: string | null

    }

    type GetJobProps = Job & {
        id: number
        job_type: GetJobTypeProps
        organization: GetOrganizationProps
        created_at: string
        updated_at: string
    }

    type GetJobsProps = {
        jobs: GetJobProps[]
        total_count: number
    }

    type PostJobProps = Job & {
        job_type_id: number
        organization_id: number
    }

    type PutJobProps = PostJobProps

    // Organizations
    type Organization = {
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        link_homepage: string | null
        link_linkedin: string | null
        link_facebook: string | null
        link_instagram: string | null
        logo: string | null
    }

    type GetOrganizationProps = Organization & {
        id: number
        created_at: string
        updated_at: string
    }

    type GetOrganizationsProps = {
        organizations: GetOrganizationProps[]
        total_count: number
    }

    type GetAllOrganizationsProps = {
        id: number
        name_en: string
    }[]

    type PostOrganizationProps = Organization
    type PutOrganizationProps = Organization

    // Locations
    type Location = {
        name_no: string
        name_en: string
        type: string
        mazemap_campus_id: number | null
        mazemap_poi_id: number | null
        address_street: string | null
        address_postcode: number | null
        city_name: string | null
        coordinate_lat: number | null
        coordinate_lon: number | null
        url: string | null
    }

    type GetLocationProps = Location & {
        id: number
        created_at: string
        updated_at: string
    }

    type GetLocationsProps = {
        locations: GetLocationProps[]
        total_count: number
    }

    type GetAllLocationsProps = {
        id: number
        name_en: string
        type: string
    }[]

    type PostLocationProps = Location
    type PutLocationProps = Location

    // Rules
    type Rule = {
        name_no: string
        name_en: string
        description_no: string
        description_en: string
    }

    type GetRuleProps = Rule & {
        id: number
        created_at: string
        updated_at: string
    }

    type GetRulesProps = {
        rules: GetRuleProps[]
        total_count: number
    }

    type GetAllRulesProps = {
        id: number
        name_en: string
    }[]

    type PostRuleProps = Rule
    type PutRuleProps = Rule

    // Audience
    type GetAudienceProps = {
        id: number
        name_no: string
        name_en: string
        created_at: string
        updated_at: string
    }

    type GetAudiencesProps = {
        audiences: GetAudienceProps[]
        total_count: number
    }

    type PostAudienceProps = {
        name_no: string
        name_en: string
    }

    type PutAudienceProps = PostAudienceProps

    // Categories
    type GetCategoryProps = {
        id: number
        name_no: string
        name_en: string
        color: string
        created_at: string
        updated_at: string
    }

    type GetCategoriesProps = {
        categories: GetCategoryProps[]
        total_count: number
    }

    // Job Type
    type GetJobTypeProps = {
        id: number
        name_no: string
        name_en: string
        updated_at: string
        created_at: string
    }

    type GetJobTypesProps = {
        job_types: GetJobTypeProps[]
        total_count: number
    }

    // Announcements
    type GetAnnouncementProps = {
        id: number
        title: string
        description: string
        channel: string
        roles: string[]
        embed: boolean
        color: string
        interval: string
        time: string | null
    }

    type PostAnnouncementProps = {
        title: string
        description: string
        channel: string
        roles: string[]
        embed: boolean
        color: string
        interval: string
        time: string | null
        active: true
    }

    type PostAnnouncementPropsUnparsed = {
        title: string
        description: string
        channel: string
        roles: string
        embed: boolean
        color: string
        interval: string
        time: string | null
        active: true
    }

    type PutAnnouncementProps = PostAnnouncementProps & {
        id: number
    }

    type PutAnnouncementPropsUnparsed = PostAnnouncementPropsUnparsed & {
        id: number
    }

    type GetAnnouncementsProps = {
        announcements: Announcement[]
        total_count: number
    }

    // Albums
    type AlbumProps = {
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        year: number
    }

    type GetAlbumProps = AlbumProps & {
        id: number
        images: string[]
        event: {
            id: number
            name_en: string
            name_no: string
            time_start: string
            time_end: string
        }
        created_at: string
        updated_at: string
    }

    type GetAlbumsProps = {
        albums: GetAlbumProps[]
        total_count: number
    }

    type PostAlbumProps = AlbumProps & {
        event_id: number
    }

    type PutAlbumProps = AlbumProps & {
        event_id: number
    }

    type ShareURLResponse = {
        url: string,
        headers: {[key: string]: string | string[]},
        key: string
    }

    // Alerts
    type AlertProps = {
        service: string,
        page: string,
        title_en: string,
        title_no: string,
        description_en: string,
        description_no: string,
    }

    type GetAlertProps = AlertProps & {
        id: number,
        created_at: string,
        updated_at: string,
    }

    type GetAlertsProps = {
        alerts: GetAlertProps[],
        total_count: number,
    }

    type PostAlertProps = AlertProps
    type PutAlertProps = AlertProps

    // Stats
    type GetStatisticsCategoriesProps = {
        id: number
        name_en: string
        event_count: number
        color: string
    }[]

    type GetStatisticsNewAdditionsProps = {
        id: number
        name_en: string
        updated_at: string
        created_at: string
        action: 'created' | 'updated'
        source: string
    }[]

    type GetStatisticsYearlyActivityProps = {
        insert_date: string
        inserted_count: number
    }[]

    // Honeys
    type HoneyProps = {
        service: string
        language: string
        page: string
        text: string
    }

    type GetHoneyProps = HoneyProps & {
        id: number
        created_at: string
        updated_at: string
    }

    type GetHoneysProps = {
        honeys: GetHoneyProps[]
        total_count: number
    }

    type PostHoneyProps = HoneyProps
    type PutHoneyProps = HoneyProps

    // Enum types
    type GetTypesProps = {
        en: string
        no: string
    }[]

    // Images
    type ImagePaths = 'events' | 'jobs' | 'organizations'


    // Beeformed
    type BeeformedProps = {
        title: string
    }

    type GetBeeformedProps = BeeformedProps & {
        id: number
        created_at: string
        updated_at: string
    }

    type PostBeeformedProps = BeeformedProps

    type PutBeeformedProps = BeeformedProps

    // Other
    type DeleteParamsProps = {
        message: string
    }

    type OptionsProps = { label: string; value: number | string }

    type CityProps = {
        city: string
        id: number
    }

    type SkillProps = {
        id: number
        skill: string
    }

    type AudienceProps = {
        audience: number
        event: number
    }

    type EventWithOnlyID = {
        id: string
    }

    type SendResponseClient = {
        status: number
        message: string
    }

    type User = {
        access_token: string
        access_token_expires: string
        refresh_token: string
        refresh_token_expires: string
        user_id: string
        user_name: string
        user_roles: string
    }

    type Organization = {
        label: string
        value: string
    }

    type Application = {
        label: string
        value: job_type
    }

    type LoginImage = {
        label: string
        value: string
        image: string
    }

    type LocationTypes = {
        label: string
        value: location_type
    }

    type Option = { value: string | number; label: string; image?: string }

    type FormName =
        | 'event'
        | 'job'
        | 'organization'
        | 'location'
        | 'rule'
        | 'announcement'
        | 'form'
        | 'album'
        | 'alert'
        | 'honey'

    type Announcement = {
        id: string
        title?: string
        description?: string
        channel?: string
        roles?: string[]
        embed?: boolean
        color?: string
        interval: boolean
        time: string
        sent: boolean
        last_sent: string
        active: boolean
    }

    type ChannelResponse = {
        guildId: string
        guildName: string
        id: string
        name: string
        category: string
    }

    type Channel = {
        label: string
        value: string
    }

    type RoleResponse = {
        name: string
        id: string
        color: string
    }

    type Role = {
        label: string
        value: string
        color: string
    }

    type DashboardTotalStats = {
        events: number
        jobs: number
        announcements: number
        organizations: number
        locations: number
        albums: number
    }

    type DetailedEvent = {
        id: number | string
        visible: boolean
        name_no: string
        name_en: string
        description_no: string
        description_en: string
        informational_no: string
        informational_en: string
        time_type: string
        time_start: string
        time_end: string
        time_publish: string
        time_signup_release: string
        time_signup_deadline: string
        canceled: boolean
        digital: boolean
        highlight: boolean
        image_small: string
        image_banner: string
        link_facebook: string
        link_discord: string
        link_signup: string
        link_stream: string
        capacity: number | null
        full: boolean
        category: number
        location: null
        parent: null
        rule: null
        updated_at: string
        created_at: string
        deleted_at: string
        category_name_no: string
        category_name_en: string
    }
}

export { }