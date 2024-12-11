export const ItemCardWithBG = ({
  imgPath,
  text,
  imgBG,
}: {
  imgPath: string
  text: string
  imgBG: string
}) => {
  return (
    <div className="flex h-8 items-center justify-center px-1 rounded-full backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20 shadow-lg">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${imgBG}`}
      >
        <img src={imgPath} className={`h-4`} />
      </div>
      <p className="text-sm font-sans font-bold mx-2">{text}</p>
    </div>
  )
}
