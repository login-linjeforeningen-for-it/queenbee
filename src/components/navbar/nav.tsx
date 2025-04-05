import Image from "next/image";


export default function Nav() {
    return (
        <nav className="relative w-full bg-black h-[45px] flex gap-4">
            <div className="relative h-[45px] w-[45px]">
                <Image alt="Logo" src="/images/queenbee-logo.png" fill={true} quality={100} />
            </div>
            <h1 className="self-center font-semibold">QUEENBEE - Admintool</h1>
        </nav>
    )
}
