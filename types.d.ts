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
        url: string
        headers: { [key: string]: string | string[] }
        key: string
    }

    // Alerts
    type AlertProps = {
        service: string
        page: string
        title_en: string
        title_no: string
        description_en: string
        description_no: string
    }

    type GetAlertProps = AlertProps & {
        id: number
        created_at: string
        updated_at: string
    }

    type GetAlertsProps = {
        alerts: GetAlertProps[]
        total_count: number
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


    // Other
    type DeleteParamsProps = {
        message: string
    }

    type OptionsProps = { label: string; value: number | string }

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

    type GetIngressProps = {
        port: string
    }

    type Stats = {
        system: {
            load: number[]
            memory: {
                used: number
                total: number
                percent: string
            }
            swap: string
            disk: string
            temperature: string
            powerUsage: string
            processes: number
            ipv4: string[]
            ipv6: string[]
            os: string
        }
    }

    type Docker = {
        status: 'available' | 'unavailable'
        count: number
        containers: Container[]
    }

    type Container = {
        id: string
        name: string
        status: string
    }

    type DockerContainer = {
        service: string
        container: {
            id: string
            name: string
            status: string
            uptime: string
            details: {
                Id: string
                Created: string
                Path: string
                Args: string[]
                State: {
                    Status: string
                    Running: boolean
                    Paused: boolean
                    Restarting: boolean
                    OOMKilled: boolean
                    Dead: boolean
                    Pid: number
                    ExitCode: number
                    Error: string
                    StartedAt: string
                    FinishedAt: string
                }
                Image: string
                ResolvConfPath: string
                HostnamePath: string
                HostsPath: string
                LogPath: string
                Name: string
                RestartCount: number
                Driver: string
                Platform: string
                MountLabel: string
                ProcessLabel: string
                AppArmorProfile: string
                ExecIDs: unknown | null
                HostConfig: {
                    Binds: unknown | null
                    ContainerIDFile: string
                    LogConfig: {
                        Type: string
                        Config: object
                    }
                    NetworkMode: string
                    PortBindings: {
                        [port: string]: PortIP[]
                    }
                    RestartPolicy: {
                        Name: string
                        MaximumRetryCount: number
                    }
                    AutoRemove: boolean
                    VolumeDriver: string
                    VolumesFrom: unkown | null
                    ConsoleSize: number[]
                    CapAdd: unknown | null
                    CapDrop: unknown | null
                    CgroupnsMode: string
                    Dns: []
                    DnsOptions: []
                    DnsSearch: []
                    ExtraHosts: []
                    GroupAdd: null
                    IpcMode: string
                    Cgroup: string
                    Links: null
                    OomScoreAdj: number
                    PidMode: string
                    Privileged: false
                    PublishAllPorts: false
                    ReadonlyRootfs: false
                    SecurityOpt: null
                    UTSMode: string
                    UsernsMode: string
                    ShmSize: string
                    Runtime: string
                    Isolation: string
                    CpuShares: number
                    Memory: number
                    NanoCpus: number
                    CgroupParent: string
                    BlkioWeight: number
                    BlkioWeightDevice: unknown | null
                    BlkioDeviceReadBps: unknown | null
                    BlkioDeviceWriteBps: unknown | null
                    BlkioDeviceReadIOps: unknown | null
                    BlkioDeviceWriteIOps: unknown | null
                    CpuPeriod: number
                    CpuQuota: number
                    CpuRealtimePeriod: number
                    CpuRealtimeRuntime: number
                    CpusetCpus: string
                    CpusetMems: string
                    Devices: unknown | null
                    DeviceCgroupRules: unknown | null
                    DeviceRequests: unknown | null
                    MemoryReservation: number
                    MemorySwap: number
                    MemorySwappiness: unknown | null
                    OomKillDisable: unknown | null
                    PidsLimit: unknown | null
                    Ulimits: unknown | null
                    CpuCount: number
                    CpuPercent: number
                    IOMaximumIOps: number
                    IOMaximumBandwidth: number
                    MaskedPaths: string[]
                    ReadonlyPaths: string[]
                }
                GraphDriver: {
                    Data: {
                        ID: string
                        LowerDir: string
                        MergedDir: string
                        UpperDir: string
                        WorkDir: string
                    }
                    Name: string
                }
                Mounts: unknown[]
                Config: {
                    Hostname: string
                    Domainname: string
                    User: string
                    AttachStdin: boolean
                    AttachStdout: boolean
                    AttachStderr: boolean
                    ExposedPorts: {
                        [port: string]: PortIP[]
                    }
                    Tty: boolean
                    OpenStdin: boolean
                    StdinOnce: boolean
                    Env: string[]
                    Cmd: string[]
                    Image: string
                    Volumes: string | null
                    WorkingDir: string
                    Entrypoint: string[]
                    OnBuild: unknown | null
                    Labels: {
                        'com.docker.compose.config-hash': string
                        'com.docker.compose.container-number': string
                        'com.docker.compose.depends_on': string
                        'com.docker.compose.image': string
                        'com.docker.compose.oneoff': string
                        'com.docker.compose.project': string
                        'com.docker.compose.project.config_files': string
                        'com.docker.compose.project.working_dir': string
                        'com.docker.compose.replace': string
                        'com.docker.compose.service': string
                        'com.docker.compose.version': string
                    }
                    StopTimeout: number
                }
                NetworkSettings: {
                    Bridge: string
                    SandboxID: string
                    SandboxKey: string
                    Ports: {
                        [port: string]: PortIP[]
                    }
                    HairpinMode: boolean
                    LinkLocalIPv6Address: string
                    LinkLocalIPv6PrefixLen: number
                    SecondaryIPAddresses: null
                    SecondaryIPv6Addresses: null
                    EndpointID: string
                    Gateway: string
                    GlobalIPv6Address: string
                    GlobalIPv6PrefixLen: number
                    IPAddress: string
                    IPPrefixLen: number
                    IPv6Gateway: string
                    MacAddress: string
                    Networks: {
                        studentbee_default: {
                            IPAMConfig: unknown | null
                            Links: unknown | null
                            Aliases: string[]
                            MacAddress: string
                            DriverOpts: unknown | null
                            GwPriority: number
                            NetworkID: string
                            EndpointID: string
                            Gateway: string
                            IPAddress: string
                            IPPrefixLen: number
                            IPv6Gateway: string
                            GlobalIPv6Address: string
                            GlobalIPv6PrefixLen: number
                            DNSNames: string[]
                        }
                    }
                }
            }
            logs: string[]
        }
        related: RelatedContainer[]
    }

    type RelatedContainer = {
        id: string
        name: string
        status: string
        uptime: string
    }

    type PortIP = {
        HostIp: string
        HostPort: string
    }
}

export { }
