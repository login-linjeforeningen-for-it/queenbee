
export default function Modal({ children, close }: { children: React.ReactNode; close: () => void }) {
   return (
      <div className="absolute w-full h-full justify-center flex"
         onClick={(e)=>{
            if(e.currentTarget==e.target){
               close()
            }
         }}>
         <div className="bg-background">
            {children}
         </div>
      </div>
   )
}