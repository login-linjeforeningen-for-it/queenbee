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
