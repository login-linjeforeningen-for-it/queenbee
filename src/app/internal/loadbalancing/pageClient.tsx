'use client'

import { Button } from 'uibee/components'

export default function PageClient() {
    function addSite() {
        console.log('clicked')
    }

    return (
        <div>
            <div className='flex w-full justify-between items-center'>
                <h1>Load Balancing</h1>
                <Button icon='+' text='Add site' onClick={addSite} />
            </div>
            <h1>hei</h1>
        </div>
    )
}
