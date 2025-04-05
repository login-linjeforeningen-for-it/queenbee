

export default function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
   return (
      <div style={{position: "absolute", top:0, left:0, right:0, bottom:0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 100}}>
         <div style={{justifySelf: "center", alignSelf: "center", backgroundColor: "white", width: "50%", height: "50%", margin: "auto", padding: 20, borderRadius: 10}}></div>

      </div>
   )
}