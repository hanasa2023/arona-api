export const EquipmentCard = ({ src }: { src: string }) => {
  return (
    <div className="flex w-16 h-16 items-center rounded-full shadow-md backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20">
      <img src={src} className="w-full"></img>
    </div>
  )
}
