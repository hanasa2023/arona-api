export const ItemCard = ({
  imgPath,
  text,
}: {
  imgPath: string
  text: string
}) => {
  return (
    <div className="flex h-8 items-center justify-center px-1 rounded-full backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20 shadow-lg">
      <img src={imgPath} className="h-6 my-1 invert" />
      <p className="text-sm font-bold mx-2">{text}</p>
    </div>
  )
}
