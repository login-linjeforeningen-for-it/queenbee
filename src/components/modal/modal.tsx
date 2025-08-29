type ModalProps = {
    display: boolean
    children: React.ReactNode
    close: () => void
}

export default function Modal({ display, children, close }: ModalProps) {
    if (!display) {
        return <></>
    }

    return (
        <div
            className={
                'absolute inset-0 w-full h-full grid z-100 ' +
                'bg-[var(--background)]/50'
            }
            onClick={(e) => {
                if (e.currentTarget === e.target) {
                    close()
                }
            }}
        >
            <div
                className={
                    'absolute bg-login-400 bottom-[19.5px] ' +
                    'right-4 h-[90.5vh] w-[84.1vw]'
                }
            >
                {children}
            </div>
        </div>
    )
}
