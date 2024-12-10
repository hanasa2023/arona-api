export const TerrainCard = ({ img1, img2 }: { img1: string; img2: string }) => {
  return (
    <div className="flex-row h-full items-center justify-between p-[2px] backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20 shadow-lg rounded-md">
      <div className="flex items-center justify-center bg-white/50 rounded-md">
        <img src={img1} className="h-7 invert"></img>
      </div>
      <div className="h-3"></div>
      <div className="flex items-center justify-center">
        <img src={img2} className="h-5"></img>
      </div>
    </div>
  )
}
