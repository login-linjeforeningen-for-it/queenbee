'use client'

import { Button } from 'uibee/components'

export default function ToolTipsButton() {
    function display() {
        function setLocalStorageItem(key: string, value: string) {
            localStorage.setItem(key, value)

            const event = new CustomEvent('customStorageChange', { detail: { key, value } })
            window.dispatchEvent(event)
        }

        setLocalStorageItem('tooltips', 'true')
    }

    return <Button text='Tooltips' icon='Q' onClick={display} />
}
