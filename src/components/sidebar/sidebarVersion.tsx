import config from '@config'
import { VersionTag } from 'uibee/components'

export default function SidebarVersion() {
    if (!config.version) {
        return null
    }

    return (
        <div className='w-full flex justify-center py-2'>
            <VersionTag
                version={config.version}
                url={`${config.url.git}/tekkom/web/beehive/queenbee/-/tags/${config.version}`}
            />
        </div>
    )
}
