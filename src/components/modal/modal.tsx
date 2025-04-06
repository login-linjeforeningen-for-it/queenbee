type ModalProps = { 
    children: React.ReactNode
    close: () => void
}

export default function Modal({ children, close }: ModalProps) {
   return (
      <div className="absolute w-full h-full justify-center flex z-100"
         onClick={(e) => {
            if (e.currentTarget === e.target) {
               close()
            }
         }}>
         <div className="bg-normal">
            {children}
         </div>
      </div>
   )
}